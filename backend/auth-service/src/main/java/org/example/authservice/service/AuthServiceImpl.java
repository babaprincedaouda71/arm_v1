package org.example.authservice.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.example.authservice.client.CollaboratorClient;
import org.example.authservice.client.CompanyClient;
import org.example.authservice.client.NotificationClient;
import org.example.authservice.config.JwtService;
import org.example.authservice.dto.*;
import org.example.authservice.dto.auth.*;
import org.example.authservice.entity.Groupe;
import org.example.authservice.entity.PasswordResetToken;
import org.example.authservice.entity.PasswordToken;
import org.example.authservice.entity.User;
import org.example.authservice.exceptions.*;
import org.example.authservice.repository.GroupeRepository;
import org.example.authservice.repository.PasswordResetTokenRepository;
import org.example.authservice.repository.PasswordTokenRepository;
import org.example.authservice.repository.UserRepository;
import org.example.authservice.token.Token;
import org.example.authservice.token.TokenRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordTokenRepository passwordTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CompanyClient companyClient;
    private final TokenRepo tokenRepo;
    private final TokenService tokenService;
    private final NotificationClient notificationClient;
    private final CollaboratorClient collaboratorClient;
    private final GroupeRepository groupeRepository;

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Value("${app.expiration-time}")
    private Long jwtExpiration;

    @Value("${app.frontend.url}")
    private String frontendUrl; // Injecter l'URL du frontend

    public AuthServiceImpl(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository, PasswordTokenRepository passwordTokenRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, CompanyClient companyClient, TokenRepo tokenRepo, TokenService tokenService, NotificationClient notificationClient, CollaboratorClient collaboratorClient, GroupeRepository groupeRepository) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordTokenRepository = passwordTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.companyClient = companyClient;
        this.tokenRepo = tokenRepo;
        this.tokenService = tokenService;
        this.notificationClient = notificationClient;
        this.collaboratorClient = collaboratorClient;
        this.groupeRepository = groupeRepository;
    }

    @Override
    public SetPasswordResponse setPassword(SetPasswordRequest request) {
        logger.info("Traitement de la demande de définition de mot de passe pour {}", request.getEmail());

        // 1. Validation des entrées
        validatePasswordMatch(request);

        // 2. Récupération et validation du token
        PasswordToken token = retrieveAndValidateToken(request.getEmail());

        // 3. Récupération des informations de l'entreprise
        CompanyResponse company = retrieveCompanyInformation(token.getCompanyId());

        // 4. Création des groupes par défaut si ce n'est pas déjà fait
        createDefaultGroupsForCompany(company.getId());

        // 5. Détermination du rôle et du groupe de l'utilisateur (l'administrateur initial)
        UserRoleInfo roleInfo = determineInitialUserRoleAndGroup(request.getEmail(), company.getId());

        // 6. Gestion de l'utilisateur (création ou mise à jour)
        User user = handleUserAccount(request, token, company, roleInfo);

        // 7. Création de la réponse et suppression du token
        return createResponseAndCleanup(user, token);
    }

    /**
     * Valide que le mot de passe et sa confirmation correspondent.
     */
    private void validatePasswordMatch(SetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmationPassword())) {
            throw new PasswordMismatchException("Les mots de passe ne correspondent pas", "confirmationPassword");
        }
    }

    /**
     * Récupère et valide le token associé à l'email.
     */
    private PasswordToken retrieveAndValidateToken(String email) {
        PasswordToken token = passwordTokenRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidEmailException("Adresse mail invalide", "email"));

        if (token.isExpired()) {
            throw new TokenExpiredException("Le lien a expiré", "token");
        }

        logger.info("Token valide trouvé pour {}", email);
        return token;
    }

    /**
     * Récupère les informations de l'entreprise via le client externe.
     */
    private CompanyResponse retrieveCompanyInformation(Long companyId) {
        CompanyResponse company = null;
        try {
            company = companyClient.getCompanyById(companyId);
        } catch (Exception e) {
            logger.error("Problème avec la récupération de l'entreprise {}: {}", companyId, e.getMessage());
        }

        if (company == null) {
            throw new CompanyNotFoundException("L'entreprise n'a pas été trouvée", "companyId");
        }

        return company;
    }

    /**
     * Crée les groupes par défaut pour une entreprise donnée si ils n'existent pas déjà.
     *
     * @param companyId L'identifiant de l'entreprise.
     */
    private void createDefaultGroupsForCompany(Long companyId) {
        List<String> defaultGroupNames = List.of("Admin", "Manager", "Formateur", "Collaborateur", "Fournisseur", "Manager/Formateur");
        for (String groupName : defaultGroupNames) {
            if (groupeRepository.findByNameAndCompanyId(groupName, companyId).isEmpty()) {
                Groupe groupe = new Groupe();
                groupe.setCompanyId(companyId);
                groupe.setName(groupName);
                groupe.setDescription("Groupe par défaut des " + groupName.toLowerCase() + "s");
                groupeRepository.save(groupe);
                logger.info("Groupe par défaut {} créé pour l'entreprise {}", groupName, companyId);
            }
        }
    }

    /**
     * Classe interne pour encapsuler les informations de rôle et de groupe.
     */
    private static class UserRoleInfo {
        Groupe groupe;
        String role;

        UserRoleInfo(Groupe groupe, String role) {
            this.groupe = groupe;
            this.role = role;
        }
    }

    /**
     * Détermine le rôle et le groupe de l'utilisateur initial (l'administrateur) lors de l'activation.
     */
    private UserRoleInfo determineInitialUserRoleAndGroup(String email, Long companyId) {
        String role = "Admin";
        Groupe groupe = groupeRepository.findByNameAndCompanyId(role, companyId)
                .orElseThrow(() -> new IllegalStateException("Le groupe Admin devrait exister pour l'entreprise " + companyId));
        return new UserRoleInfo(groupe, role);
    }

    /**
     * Gère la création ou la mise à jour du compte utilisateur.
     */
    private User handleUserAccount(SetPasswordRequest request, PasswordToken token,
                                   CompanyResponse company, UserRoleInfo roleInfo) {
        // Tenter de récupérer l'utilisateur existant
        Optional<User> existingUserOpt = userRepository.findByEmail(token.getEmail());

        if (existingUserOpt.isPresent()) {
            // Mise à jour de l'utilisateur existant
            User existingUser = existingUserOpt.get();
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
            existingUser.setGroupe(roleInfo.groupe); // Assignation du groupe
            existingUser.setRole(roleInfo.role);     // Assignation du rôle
            logger.info("Mise à jour du mot de passe et du rôle pour l'utilisateur {}", existingUser.getEmail());
            return userRepository.save(existingUser);
        } else {
            // Création d'un nouvel utilisateur
            User newUser = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(roleInfo.role)
                    .companyId(company.getId())
                    .active(true)
                    .status("Actif")
                    .creationDate(LocalDate.now().toString())
                    .firstName(company.getMainContactFirstName())
                    .lastName(company.getMainContactLastName())
                    .phoneNumber(company.getMainContactPhone())
                    .groupe(roleInfo.groupe) // Assignation du groupe
                    .build();

            logger.info("Création d'un nouvel utilisateur {}", newUser.getEmail());
            return userRepository.save(newUser);
        }
    }

    /**
     * Crée la réponse et supprime le token utilisé.
     */
    private SetPasswordResponse createResponseAndCleanup(User user, PasswordToken token) {
        SetPasswordResponse response = new SetPasswordResponse();
        response.setEmail(user.getEmail());
        response.setCompanyId(user.getCompanyId());

        // Supprimer le token pour sécuriser le processus
        passwordTokenRepository.delete(token);
        logger.info("Token supprimé après traitement réussi pour {}", user.getEmail());

        return response;
    }

    @Override
    public SetPasswordResponse setUserPassword(SetPasswordRequest request) {
        logger.info("Traitement de la définition de mot de passe pour {}", request.getEmail());

        // 1. Validation des entrées
        validatePasswordMatch(request);

        // 2. Récupération et validation du token
        PasswordToken token = retrieveAndValidateToken(request.getEmail());

        // 3. Récupération des informations de l'entreprise
        CompanyResponse company = retrieveCompanyInformation(token.getCompanyId());

        // 4. Récupération de l'utilisateur
        User byEmail = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé", null));

        // 5. Définition du mot de passe et activation du compte
        byEmail.setPassword(passwordEncoder.encode(request.getPassword()));
        byEmail.setActive(true);
        byEmail.setStatus("Actif");

        // 6. Enregistrement de l'utilisateur
        User save = userRepository.save(byEmail);

        // 7. Construction de la réponse
        return createResponseAndCleanup(byEmail, token);
    }


    @Override
    public void createPasswordToken(CreatePasswordTokenRequest request) {
        passwordTokenRepository.findByEmail(request.getEmail()).ifPresent(passwordTokenRepository::delete);
        PasswordToken passwordToken = PasswordToken.builder().email(request.getEmail()).companyId(request.getCompanyId()).token(request.getToken()).expiryDate(LocalDateTime.now().plusMinutes(10)).build();
        passwordTokenRepository.save(passwordToken);
    }

    @Override
    public ResponseEntity<LoginResponse> login(LoginRequest request) {
        try {
            logger.info("Tentative de connexion pour l'utilisateur: {}", request.getEmail());

            // 1. Authentification de l'utilisateur
            authenticateUser(request);

            // 2. Récupération et validation de l'utilisateur
            User user = retrieveAndValidateUser(request.getEmail());

            // 3. Vérification du statut actif de l'utilisateur
            if (!user.isActive()) {
                logger.warn("Tentative de connexion refusée: utilisateur inactif {}", request.getEmail());
                return createErrorResponse(HttpStatus.FORBIDDEN);
            }

            // 4. Génération du token JWT
            String jwt = jwtService.generateToken(user);

            // 5. Vérification de l'état d'inscription de l'entreprise
            boolean registrationCompleted = checkCompanyRegistrationStatus(user.getCompanyId());

            // 6. Gestion de la première connexion et profil incomplet
            handleFirstLoginNotification(user);

            // 7. Gestion des tokens (révocation et sauvegarde)
            manageUserTokens(user, jwt);

            // 8. Construction de la réponse et du cookie
            return createSuccessResponse(user, jwt, registrationCompleted);

        } catch (InvalidCredentialsException e) {
            logger.warn("Échec d'authentification: {}", e.getMessage());
            return createErrorResponse(HttpStatus.UNAUTHORIZED);
        } catch (UserNotFoundException e) {
            logger.warn("Utilisateur non trouvé: {}", e.getMessage());
            return createErrorResponse(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Erreur lors du processus de connexion: {}", e.getMessage(), e);
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Authentifie l'utilisateur avec les identifiants fournis.
     */
    private void authenticateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if (!authentication.isAuthenticated()) {
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }

        logger.debug("Authentification réussie pour {}", request.getEmail());
    }

    /**
     * Récupère et valide l'utilisateur par son email.
     */
    private User retrieveAndValidateUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé", null));
    }

    /**
     * Vérifie l'état d'inscription de l'entreprise.
     */
    private boolean checkCompanyRegistrationStatus(Long companyId) {
        try {
            CompanyResponse company = companyClient.getCompanyById(companyId);
            boolean isComplete = company.isRegistrationCompleted();
            logger.debug("Statut d'inscription de l'entreprise {}: {}", companyId, isComplete);
            return isComplete;
        } catch (Exception e) {
            logger.error("Erreur lors de la vérification du statut d'inscription de l'entreprise {}: {}",
                    companyId, e.getMessage());
            return false;
        }
    }

    /**
     * Gère la notification lors de la première connexion avec profil incomplet.
     */
    private void handleFirstLoginNotification(User user) {
        if (user.isFirstLogin() && user.isProfileIncomplete()) {
            String link = frontendUrl + "/User/user-profile/edit-profile?id=" + user.getId();
            NotificationsRequest notification = NotificationsRequest.builder()
                    .userId(user.getId())
                    .title("Complétion de profil")
                    .message("Veuillez completer votre profil")
                    .link(link)
                    .build();

            try {
                notificationClient.sendAddNotification(notification);
                logger.info("Notification de complétion de profil envoyée à l'utilisateur {}", user.getId());
            } catch (Exception e) {
                logger.error("Erreur lors de l'envoi de la notification: {}", e.getMessage());
            }
        }
    }

    /**
     * Révoque tous les tokens existants et enregistre le nouveau token.
     */
    private void manageUserTokens(User user, String jwt) {
        revokeAllUserTokens(user);
        saveUserToken(user, jwt);
        logger.debug("Tokens gérés pour l'utilisateur {}", user.getId());
    }

    /**
     * Révoque tous les tokens valides existants pour l'utilisateur.
     */
    private void revokeAllUserTokens(User user) {
        List<Token> validUserTokens = tokenRepo.findAllValidTokensByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            return;
        }

        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepo.saveAll(validUserTokens);
        logger.debug("{} token(s) révoqué(s) pour l'utilisateur {}", validUserTokens.size(), user.getId());
    }

    /**
     * Enregistre un nouveau token pour l'utilisateur.
     */
    private void saveUserToken(User user, String generatedToken) {
        Token token = Token.builder()
                .user(user)
                .token(generatedToken)
                .type("Bearer")
                .expired(false)
                .revoked(false)
                .build();
        tokenRepo.save(token);
    }

    /**
     * Construit la réponse de login et met à jour l'utilisateur.
     */
    private ResponseEntity<LoginResponse> createSuccessResponse(User user, String jwt, boolean registrationCompleted) {
        LoginResponse response = buildLoginResponse(user, jwt, registrationCompleted);

        // Détecter si on est en environnement de développement
        boolean isDevelopment = !isProductionEnvironment(); // À implémenter selon votre logique

        ResponseCookie cookie = ResponseCookie.from("token", jwt)
                .httpOnly(true)
                .secure(!isDevelopment) // Secure uniquement en production
                .path("/")
                .maxAge(Duration.ofMillis(jwtExpiration))
                .sameSite(isDevelopment ? "Lax" : "None") // Ajustement pour dev/prod
                .build();

        updateUserAfterLogin(user);
        logger.info("Connexion réussie pour l'utilisateur {}", user.getEmail());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    // Méthode helper pour détecter l'environnement
    private boolean isProductionEnvironment() {
        // Implémentez selon votre logique (variables d'environnement, profils Spring, etc.)
        String environment = System.getProperty("spring.profiles.active");
        return "production".equals(environment) || "prod".equals(environment);
    }

    /**
     * Met à jour l'utilisateur après une connexion réussie.
     */
    private void updateUserAfterLogin(User user) {
        user.setFirstLogin(false);
        userRepository.save(user);
    }

    /**
     * Construit l'objet de réponse de login.
     */
    private LoginResponse buildLoginResponse(User user, String jwt, boolean registrationCompleted) {
        LoginResponse response = new LoginResponse();
        response.setEmail(user.getEmail());
        response.setCompanyId(user.getCompanyId());
        response.setToken(jwt);
        response.setRegistrationCompleted(registrationCompleted);
        response.setRole(user.getRole());

        try {
            response.setGroupe(user.getGroupe());
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération du groupe: {}", e.getMessage());
            response.setGroupe(null);
            throw new GroupeException("Problème de groupe");
        }

        return response;
    }

    /**
     * Crée une réponse d'erreur avec le statut HTTP spécifié.
     */
    private ResponseEntity<LoginResponse> createErrorResponse(HttpStatus status) {
        return ResponseEntity.status(status)
                .body(new LoginResponse(null, null, null, null, null, null, false));
    }

    @Override
    public String getTokenForEmail(String email) {
        return passwordResetTokenRepository.findByEmail(email).map(PasswordResetToken::getToken).orElse(null);
    }

    @Override
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        Optional<String> token = extractTokenFromCookie(request);

        if (token.isPresent()) {
            return processProfileRequest(token.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private Optional<String> extractTokenFromCookie(HttpServletRequest request) {
        Cookie tokenCookie = WebUtils.getCookie(request, "token");
        if (tokenCookie != null) {
            return Optional.of(tokenCookie.getValue());
        }
        return Optional.empty();
    }

    private ResponseEntity<?> processProfileRequest(String token) {
        try {
            String username = jwtService.extractUsername(token);
            Long companyId = jwtService.extractCompanyId(token);
            User user = userRepository.findByEmail(username).orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'email : " + username, null));

            UserProfile userProfile = UserProfile.builder()
                    .id(user.getId())
                    .companyId(companyId)
                    .managerId(user.getManagerId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .gender(user.getGender())
                    .address(user.getAddress())
                    .birthDate(user.getBirthDate())
                    .phoneNumber(user.getPhoneNumber())
                    .cin(user.getCin())
                    .role(user.getRole())
                    .build();

            logger.info("Profil utilisateur récupéré : {}", userProfile);

            ResponseCookie cookie = createTokenCookie(token);

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(userProfile);

        } catch (UserNotFoundException e) {
            logger.error("Utilisateur non trouvé", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erreur lors du traitement du profil", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur");
        }
    }

    private ResponseCookie createTokenCookie(String token) {
        boolean isDevelopment = !isProductionEnvironment();

        return ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(!isDevelopment)
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite(isDevelopment ? "Lax" : "None")
                .build();
    }

    @Override
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        logger.info("Récupération du profil utilisateur");

        // 1. Extraction du token depuis les cookies
        String token = extractTokenFromCookies(request);

        // 2. Vérification de la présence du token
        if (token == null) {
            logger.warn("Tentative d'accès au profil sans token valide");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // 3. Extraction du nom d'utilisateur et récupération de l'utilisateur
            User user = retrieveUserFromToken(token);

            // 4. Récupération des informations de l'entreprise
            CompanyResponse company = retrieveCompanyInformation(user.getCompanyId());

            // 5. Construction du profil utilisateur
            UserProfile userProfile = buildUserProfile(user, company);

            // 6. Rafraîchissement du cookie pour prolonger la session
            ResponseCookie refreshedCookie = refreshSessionCookie(token);

            logger.info("Profil de l'utilisateur {} récupéré avec succès", user.getEmail());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, refreshedCookie.toString())
                    .body(userProfile);

        } catch (Exception e) {
            logger.error("Erreur lors de la récupération du profil utilisateur: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Extrait le token JWT des cookies de la requête.
     */
    private String extractTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }

    /**
     * Récupère l'utilisateur à partir du token JWT.
     */
    private User retrieveUserFromToken(String token) {
        String userName = jwtService.extractUsername(token);
        return userRepository.findByEmail(userName)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé", null));
    }

    /**
     * Construit l'objet de profil utilisateur à partir des données de l'utilisateur et de l'entreprise.
     */
    private UserProfile buildUserProfile(User user, CompanyResponse company) {
        return UserProfile.builder()
                .id(user.getId())
                .firstName(company.getMainContactFirstName())
                .lastName(company.getMainContactLastName())
                .email(user.getEmail())
                .gender(user.getGender())
                .address(user.getAddress())
                .birthDate(user.getBirthDate())
                .phoneNumber(user.getPhoneNumber())
                .cin(user.getCin())
                .role(user.getRole())
                .companyId(company.getId())
                .build();
    }

    /**
     * Crée un nouveau cookie avec le token existant mais avec une durée de validité prolongée.
     */
    private ResponseCookie refreshSessionCookie(String token) {
        boolean isDevelopment = !isProductionEnvironment();

        return ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(!isDevelopment)
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite(isDevelopment ? "Lax" : "None")
                .build();
    }

    @Override
    public void createPasswordResetToken(Long companyId, String email, String token) {
        // Supprimer les tokens existants pour cet email
        passwordResetTokenRepository.findByEmail(email).ifPresent(passwordResetTokenRepository::delete);

        // créer un nouveau token
        log.info("Problem is here my dear......");
        PasswordResetToken tokenToSave = null;
        try {
            tokenToSave = PasswordResetToken.builder().token(token).companyId(companyId).email(email).expiryDate(LocalDateTime.now().plusHours(24)).build();
        } catch (Exception e) {
            logger.error("Erreur lors de la creation", e);
            throw new RuntimeException(e);
        }
        try {
            passwordResetTokenRepository.save(tokenToSave);
        } catch (Exception e) {
            logger.error("Erreur lors du traitement du serveur", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<?> forgotPassword(ForgotPasswordRequest request) {
        User byEmail = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new EmailDoesNotExistException("L'adresse email n'existe pas"));

        try {
            String token = tokenService.generateToken(byEmail.getCompanyId(), byEmail.getEmail());
            String passwordResetLink = frontendUrl + "/reset-password?token=" + token;

            // enregistrer le token
            createPasswordResetToken(byEmail.getCompanyId(), byEmail.getEmail(), token);

            // send email
            EmailNotificationRequest emailRequest = EmailNotificationRequest.builder().recipient(byEmail.getEmail()).emailType("RESET_PASSWORD").resetLink(passwordResetLink).build();
            notificationClient.sendEmail(emailRequest);
            return ResponseEntity.ok().body(Map.of("message", "Un email de réinitialisation a été envoyé."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "INTERNAL_ERROR", "message", "Une erreur s'est produite. Veuillez réessayer plus tard."));
        }
    }

    @Override
    public ResponseEntity<?> resetPassword(ResetPasswordRequest request) {
        try {
            // Recherche de l'utilisateur par email
            User byEmail = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Email " + request.getEmail() + " not found"));

            // Vérification que le nouveau mot de passe est différent de l'ancien
            String oldPassword = byEmail.getPassword();
            if (passwordEncoder.matches(request.getPassword(), oldPassword)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Les mots de passes doivent être différents"));
            }

            // Mise à jour du mot de passe
            byEmail.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(byEmail); // Sauvegarder les modifications

            // Construction de la réponse
            UserResponse userResponse = UserResponse.builder().id(byEmail.getId()).email(byEmail.getEmail()).role(byEmail.getRole()).build();

            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    public String generateRandomToken() {
        return java.util.UUID.randomUUID().toString();
    }

}