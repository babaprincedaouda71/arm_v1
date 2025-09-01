package org.example.authservice.service;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.example.authservice.client.NotificationClient;
import org.example.authservice.dto.*;
import org.example.authservice.dto.auth.CreatePasswordTokenRequest;
import org.example.authservice.dto.user.*;
import org.example.authservice.entity.Groupe;
import org.example.authservice.entity.User;
import org.example.authservice.exceptions.*;
import org.example.authservice.repository.GroupeRepository;
import org.example.authservice.repository.UserRepository;
import org.example.authservice.utils.SecurityUtils;
import org.example.authservice.utils.UserUtilMethods;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final GroupeRepository groupeRepository;
    private final TokenService tokenService;
    private final NotificationClient notificationClient;
    private final AuthService authService;

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, GroupeRepository groupeRepository, TokenService tokenService, NotificationClient notificationClient, AuthService authService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.groupeRepository = groupeRepository;
        this.tokenService = tokenService;
        this.notificationClient = notificationClient;
        this.authService = authService;
    }

    @Override
    public ResponseEntity<?> changePassword(ChangePasswordRequest request, Principal connectedUser) {
        // Récupérer l'utilisateur connecté
        String username = connectedUser.getName();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé", null)); // Gestion d'erreur basique

        // Valider les entrées
        validatePasswordChangeRequest(request, user);

        // Mettre à jour le mot de passe
        updateUserPassword(user, request.getNewPassword());

        // Déconnexion de l'utilisateur après la mise à jour du mot de passe
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok().body("Mot de passe modifié avec success!");
    }

    /**
     * Valide la demande de changement de mot de passe.
     *
     * @param request La demande de changement de mot de passe.
     * @param user    L'utilisateur concerné.
     * @throws IllegalStateException Si une validation échoue.
     */
    private void validatePasswordChangeRequest(ChangePasswordRequest request, User user) {
        // Vérifier que le mot de passe actuel est correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IncorrectPasswordException("Mot de passe actuel incorrect", "currentPassword");
        }

        // Vérifier que les nouveaux mots de passe correspondent
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new PasswordMismatchException("Les mots de passe ne correspondent pas", "confirmationPassword");
        }

        // Vérifier que le nouveau mot de passe est différent de l'ancien
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new PasswordUpdateException("Le nouveau mot de passe et l'ancien doivent être différents", "newPassword");
        }
    }

    /**
     * Met à jour le mot de passe de l'utilisateur.
     *
     * @param user        L'utilisateur dont le mot de passe doit être mis à jour.
     * @param newPassword Le nouveau mot de passe.
     */
    private void updateUserPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public ResponseEntity<?> getAllUsers() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        List<User> userList = userRepository.findAllByCompanyId(companyId);
        if (userList.isEmpty()) {
            throw new UsersNotFoundException("Pas de données disponible");
        }
        List<GetAllUserResponse> getAllUserResponses = mapToGetAllUsersResponse(userList);
        return ResponseEntity.ok(getAllUserResponses);
    }

    private List<GetAllUserResponse> mapToGetAllUsersResponse(List<User> userList) {
        List<GetAllUserResponse> userResponseList = new ArrayList<>();
        userList.forEach(user -> {
            String managerName = "Pas défini";
            Long managerId = user.getManagerId();

            if (managerId != null) {
                for (User possibleManager : userList) {
                    if (possibleManager.getId().equals(managerId)) {
                        managerName = possibleManager.getFirstName() + " " + possibleManager.getLastName();
                        break; // Une fois le manager trouvé, on peut sortir de la boucle
                    }
                }
            }

            GetAllUserResponse getAllUserResponse = new GetAllUserResponse();
            getAllUserResponse.setId(user.getId());
            getAllUserResponse.setCompanyId(user.getCompanyId());
            getAllUserResponse.setEmail(user.getEmail());
            getAllUserResponse.setFirstName(user.getFirstName());
            getAllUserResponse.setLastName(user.getLastName());
            getAllUserResponse.setRole(user.getRole());
            getAllUserResponse.setGender(user.getGender());
            getAllUserResponse.setBirthDate(user.getBirthDate());
            getAllUserResponse.setAddress(user.getAddress());
            getAllUserResponse.setPhoneNumber(user.getPhoneNumber());
            getAllUserResponse.setCin(user.getCin());
            getAllUserResponse.setCollaboratorCode(user.getCollaboratorCode());
            getAllUserResponse.setHiringDate(user.getHiringDate());
            getAllUserResponse.setSocialSecurityNumber(user.getSocialSecurityNumber());
            getAllUserResponse.setDepartment(user.getDepartment());
            getAllUserResponse.setGroupe(toGroupeDTO(user.getGroupe()));
            getAllUserResponse.setPosition(user.getPosition());
            getAllUserResponse.setCreationDate(user.getCreationDate());
            getAllUserResponse.setStatus(user.getStatus());
            getAllUserResponse.setActive(user.isActive());
            getAllUserResponse.setManager(managerName); // Ajout du nom du manager
//            getAllUserResponse.setGroupes(toRoleResponse(user.getGroupes()));
            userResponseList.add(getAllUserResponse);
        });
        return userResponseList;
    }

    private GroupeDTO toGroupeDTO(Groupe groupe) {
        GroupeDTO groupeDTO = new GroupeDTO();
        groupeDTO.setId(groupe.getId());
        groupeDTO.setName(groupe.getName());
        groupeDTO.setDescription(groupe.getDescription());
        return groupeDTO;
    }

    @Override
    public ResponseEntity<?> getUserById(Long id) {
        // Validation de l'entrée
        if (id == null) {
            return ResponseEntity.badRequest().body("L'ID de l'utilisateur ne peut pas être null.");
        }

        // Récupération de l'utilisateur
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable", null));

        // Construction de l'objet UserDetails
        UserDetails userDetails = buildUserDetails(user);

        // Retourne la réponse avec les détails de l'utilisateur
        return ResponseEntity.ok(userDetails);
    }

    // Méthode utilitaire pour construire un objet UserDetails
    private UserDetails buildUserDetails(User user) {
        return UserDetails.builder().id(user.getId()).firstName(user.getFirstName()).lastName(user.getLastName()).email(user.getEmail()).gender(user.getGender()).birthDate(user.getBirthDate()).phoneNumber(user.getPhoneNumber()).address(user.getAddress()).cin(user.getCin()).collaboratorCode(user.getCollaboratorCode()).hiringDate(user.getHiringDate()).socialSecurityNumber(user.getSocialSecurityNumber()).department(user.getDepartment()).position(user.getPosition()).creationDate(user.getCreationDate()).status(user.getStatus()).groupe(user.getGroupe().getName()).build();
    }

    @Override
    public ResponseEntity<?> updateStatus(UpdateStatusRequest request) {
        log.info("Status : {}", request.getStatus());
        if (request.getId() == null) {
            return ResponseEntity.badRequest().body("Invalid request or user ID.");
        }

        User user = userRepository.findById(request.getId()).orElseThrow(() -> new UsersNotFoundException("Utilisateur non trouvé"));

        user.setStatus(request.getStatus());
        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok().body(updatedUser);
    }

    @Override
    public ResponseEntity<?> changeRole(ChangeRoleRequest request) {
        // Validation des entrées
        if (request == null || request.getId() == null || request.getRole() == null) {
            return ResponseEntity.badRequest().body("Requête invalide : ID ou rôle manquant.");
        }

        // Récupération de l'utilisateur
        User user = userRepository.findById(request.getId()).orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé", null));

        // Récuperation du company id
        Long companyId = SecurityUtils.getCurrentCompanyId();

        // recuperation du groupe correspondant au role
        Groupe groupe = groupeRepository.findByNameAndCompanyId(request.getRole(), companyId).orElseThrow(() -> new GroupeAlreadyExistsException("Un groupe avec le même nom existe déjà."));
//        if (groupe == null) {
//            return ResponseEntity.badRequest().body("Groupe 'Collaborateur' not found.");
//        }

        // Mise à jour du rôle
        user.setRole(request.getRole());

        // Mise à jour du groupe
        user.setGroupe(groupe);

        try {
            // Sauvegarde de l'utilisateur
            User savedUser = userRepository.save(user);

            // Déconnexion de l'utilisateur après la mise à jour du rôle
            SecurityContextHolder.clearContext();

            // Retourne la réponse avec l'utilisateur mis à jour
            return ResponseEntity.ok().body(mapToUserDetailsRequest(savedUser));
        } catch (Exception e) {
            // Log de l'erreur
            logger.error("Erreur lors de la mise à jour du rôle de l'utilisateur", e);

            // Retourne une réponse d'erreur structurée
            return ResponseEntity.badRequest().body(Map.of("error", "Erreur lors de la mise à jour du rôle", "message", e.getMessage()));
        }
    }

    @org.springframework.transaction.annotation.Transactional
    @Override
    public ResponseEntity<?> updateManager(UpdateManagerRequest request) {
        // Validation des entrées
        if (request == null || request.getUserId() == null || request.getManagerId() == null) {
            return ResponseEntity.badRequest().body("Requête invalide : ID du user ou du manager manquant.");
        }

        // Récupération de l'utilisateur
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé", null));

        // Récupération de l'utilisateur
        userRepository.findById(request.getManagerId()).orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé", null));

        // Mis à jour
        user.setManagerId(request.getManagerId());

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok().body(mapToUserDetailsRequest(savedUser));
    }

    public ResponseEntity<?> importCollaborators(List<UserImportRequest> collaborators) {
        // Récuperation du company id
        Long companyId = SecurityUtils.getCurrentCompanyId();

        Groupe collaboratorGroupe = groupeRepository.findByNameAndCompanyId("Employé", companyId).orElseThrow(() -> new GroupeAlreadyExistsException("Un groupe avec le même nom existe déjà."));
//        if (collaboratorGroupe == null) {
//            return ResponseEntity.badRequest().body("Groupe 'Collaborateur' not found.");
//        }

        Set<User> users = collaborators.stream().map(collaborator ->
                User.builder()
                        .email(collaborator.getEmail())
                        .password(passwordEncoder.encode(collaborator.getEmail()))
                        .firstName(collaborator.getFirstName())
                        .lastName(collaborator.getLastName())
                        .position(collaborator.getPosition())
                        .gender(collaborator.getGender())
                        .birthDate(collaborator.getBirthDate())
                        .address(collaborator.getAddress())
                        .phoneNumber(collaborator.getPhoneNumber())
                        .department(collaborator.getDepartment())
                        .cin(collaborator.getCin())
                        .creationDate(collaborator.getCreationDate())
                        .companyId(companyId)
                        .groupe(collaboratorGroupe)
                        .active(true)
                        .status(collaborator.getStatus())
                        .role("Employé")
                        .firstLogin(true)
                        .build()).collect(Collectors.toSet());

        List<User> savedUsers = userRepository.saveAll(users);
        return ResponseEntity.ok().body(savedUsers);
    }

    @Override
    public ResponseEntity<?> addUser(UserDetailsRequest request) {
        Long companyId = SecurityUtils.getCurrentCompanyId();

        Groupe collaboratorGroupe = groupeRepository.findByNameAndCompanyId("Collaborateur", companyId).orElseThrow(() -> new GroupeAlreadyExistsException("Un groupe avec le même nom existe déjà."));
//        if (collaboratorGroupe == null) {
//            return ResponseEntity.badRequest().body("Groupe 'Collaborateur' not found.");
//        }

        Optional<User> byEmail = userRepository.findByEmail(request.getEmail());
        if (byEmail.isPresent()) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        User user = User.builder().companyId(companyId).email(request.getEmail()).firstName(request.getFirstName()).lastName(request.getLastName()).password(passwordEncoder.encode(request.getEmail())).role(request.getGroupe()).managerId(2L).active(true).gender(request.getGender()).birthDate(request.getBirthDate()).phoneNumber(request.getPhoneNumber()).address(request.getAddress()).cin(request.getCin()).collaboratorCode(request.getCollaboratorCode()).hiringDate(request.getHiringDate()).socialSecurityNumber(request.getSocialSecurityNumber()).department(request.getDepartment()).position(request.getPosition()).creationDate(LocalDate.now().toString()).status("Actif").groupe(collaboratorGroupe).firstLogin(true).build();
        User save = userRepository.save(user);

        // Envoyer un lien d'activation de compte
        String token = tokenService.generateToken(companyId, request.getEmail());
        String passwordSetupLink = frontendUrl + "/setting-user-password?token=" + token;
        EmailNotificationRequest emailRequest = EmailNotificationRequest.builder().recipient(request.getEmail()).activationLink(passwordSetupLink).build();
        notificationClient.sendEmail(emailRequest);
        // Créer un token de réinitialisation de mot de passe dans Auth Service
        CreatePasswordTokenRequest tokenRequest = CreatePasswordTokenRequest.builder().companyId(companyId).email(request.getEmail()).token(token).build();
        authService.createPasswordToken(tokenRequest);
        return ResponseEntity.ok().body(save);
    }

    @Override
    public ResponseEntity<?> updateUser(Long id, UserDetailsRequest request) {
        Long companyId = SecurityUtils.getCurrentCompanyId();

        Groupe collaboratorGroupe = groupeRepository.findByNameAndCompanyId(request.getGroupe(), companyId).orElseThrow(() -> new GroupeAlreadyExistsException("Un groupe avec le même nom existe déjà."));
//        if (collaboratorGroupe == null) {
//            return ResponseEntity.badRequest().body("Groupe 'Collaborateur' not found.");
//        }

        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Utilisateur", null));
        user.setCompanyId(companyId);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setGender(request.getGender());
        user.setBirthDate(request.getBirthDate());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setCin(request.getCin());
        user.setDepartment(request.getDepartment());
        user.setPosition(request.getPosition());
        user.setRole(request.getGroupe());
        user.setCollaboratorCode(request.getCollaboratorCode());
        user.setHiringDate(request.getHiringDate());
        user.setSocialSecurityNumber(request.getSocialSecurityNumber());
        user.setStatus("Actif");
        user.setGroupe(collaboratorGroupe);
        userRepository.save(user);
        UserDetailsRequest userDetailsRequest = mapToUserDetailsRequest(user);
        return ResponseEntity.ok().body(userDetailsRequest);
    }

    @Override
    public ResponseEntity<?> deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Utilisateur not trouvé", null));
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> updateProfile(Long id, UserDetailsRequest request) {
        Long companyId = SecurityUtils.getCurrentCompanyId();

        Groupe collaboratorGroupe = groupeRepository.findByNameAndCompanyId(request.getGroupe(), companyId).orElseThrow(() -> new GroupeAlreadyExistsException("Un groupe avec le même nom existe déjà."));
//        if (collaboratorGroupe == null) {
//            return ResponseEntity.badRequest().body("Groupe 'Collaborateur' not found.");
//        }

        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Utilisateur", null));
        user.setCompanyId(companyId);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setGender(request.getGender());
        user.setBirthDate(request.getBirthDate());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setCin(request.getCin());
        user.setGroupe(collaboratorGroupe);
        userRepository.save(user);
        UserDetailsRequest userDetailsRequest = mapToUserDetailsRequest(user);
        return ResponseEntity.ok().body(userDetailsRequest);
    }

    @Override
    public ResponseEntity<?> getAllTrainers() {
        List<User> trainers = userRepository.findByGroupe_Name("Formateur");
        return ResponseEntity.ok().body(UserUtilMethods.mapToTrainersDto(trainers));
    }

    @Override
    public ResponseEntity<?> getTrainerName(Long trainerId) {
        if (trainerId != null) {
            User trainer = userRepository.findById(trainerId).orElseThrow(() -> new UserNotFoundException("Formateur introuvable", null));
            return ResponseEntity.ok().body(UserUtilMethods.mapToTrainerDto(trainer));
        }
        return ResponseEntity.ok().body(null);
    }

    @Override
    public ResponseEntity<?> getMyProfile(Long userId) {
        // Récupération de l'utilisateur
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable", null));
        return ResponseEntity.ok().body(UserUtilMethods.mapToMyProfileDto(user));
    }

    @Override
    public ResponseEntity<?> getApproverById(Long approverId) {
        User user = userRepository.findById(approverId).orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable", null));
        return ResponseEntity.ok().body(UserUtilMethods.mapToApproverDto(user));
    }

    @Override
    public ResponseEntity<?> getCampaignEvaluationParticipants() {
        List<User> users = userRepository.findAllByCompanyId(SecurityUtils.getCurrentCompanyId());
        log.warn("users : {}", users.size());
        List<CampaignEvaluationParticipantsDto> campaignEvaluationParticipantsDtos = users.stream().map(UserUtilMethods::mapToCampaignEvaluationParticipantsDto).collect(Collectors.toList());
        return ResponseEntity.ok(campaignEvaluationParticipantsDtos);
    }

    @Override
    public ResponseEntity<?> getMyTeamIds(Long managerId) {
        List<Long> teamIds = userRepository.findIdsByCompanyIdAndManagerId(SecurityUtils.getCurrentCompanyId(), managerId);
        return ResponseEntity.ok(teamIds);
    }

    @Override
    public ResponseEntity<?> getTeamEvaluationParticipant(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable", null));
        TeamEvaluationDetailsForUserDto teamEvaluationDetailsForUserDto = TeamEvaluationDetailsForUserDto.builder()
                .id(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .position(user.getPosition())
                .groupe(user.getGroupe().getName())
                .cin(user.getCin())
                .cnss(user.getSocialSecurityNumber())
                .build();
        return ResponseEntity.ok(teamEvaluationDetailsForUserDto);
    }

    @Transactional
    @Override
    public ResponseEntity<?> fetchCampaignEvaluationParticipants(List<Long> participantIds) {
        List<CampaignEvaluationParticipantsDto> evaluationParticipantsDtoList = new ArrayList<>();
        userRepository.findAllById(participantIds).forEach(user -> {
            String managerName = "Pas de manager";
            Long managerId = user.getManagerId();
            if (managerId != null) {
                User foundManager = userRepository.findById(managerId)
                        .orElseThrow(() -> new UserNotFoundException("Manager introuvable pour l'utilisateur avec l'ID : " + user.getId(), null));
                managerName = foundManager.getFirstName() + " " + foundManager.getLastName();
            }

            evaluationParticipantsDtoList.add(CampaignEvaluationParticipantsDto.builder().id(user.getId())
                    .department(user.getDepartment())
                    .lastName(user.getLastName())
                    .firstName(user.getFirstName())
                    .cin(user.getCin())
                    .cnss(user.getSocialSecurityNumber())
                    .email(user.getEmail())
                    .groupe(user.getGroupe().getName())
                    .manager(managerName).build());
        });
        return ResponseEntity.ok(evaluationParticipantsDtoList);
    }

    @Override
    public ResponseEntity<?> getUserRole(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable", null));
        UserRoleDto.UserRoleDtoBuilder builder = UserRoleDto.builder()
                .id(user.getId())
                .role(user.getRole())
                .managerId(user.getManagerId());

        if (user.getManagerId() != null) {
            User manager = userRepository.findById(user.getManagerId()).orElseThrow(() -> new UserNotFoundException("Manager introuvable", null));
            builder.managerName(manager.getFirstName() + " " + manager.getLastName());
        } else {
            builder.managerName(null); // Ou une autre valeur par défaut comme "Aucun manager"
        }

        UserRoleDto userRoleDto = builder.build();
        return ResponseEntity.ok(userRoleDto);
    }

    @Override
    public ResponseEntity<?> getParticipantsNames(Set<Long> participantIds) {
        // Validation basique
        if (participantIds == null || participantIds.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        try {
            // Construction directe des DTOs
            List<ParticipantsNamesDto> participantsNamesDtos = userRepository
                    .findAllById(participantIds)
                    .stream()
                    .filter(Objects::nonNull)
                    .map(user -> ParticipantsNamesDto.builder()
                            .id(user.getId())
                            .name(buildFullName(user.getFirstName(), user.getLastName()))
                            .email(user.getEmail())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(participantsNamesDtos);

        } catch (Exception e) {
            log.error("Error retrieving participants names: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving participants names");
        }
    }

    @Override
    public ResponseEntity<?> getParticipantsEmails(Set<Long> participantIds) {
        // Validation basique
        if (participantIds == null || participantIds.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        try {
            // Construction directe des DTOs
            List<ParticipantsNamesDto> participantsNamesDtos = userRepository
                    .findAllById(participantIds)
                    .stream()
                    .filter(Objects::nonNull)
                    .map(user -> ParticipantsNamesDto.builder()
                            .id(user.getId())
                            .name(buildFullName(user.getFirstName(), user.getLastName()))
                            .email(user.getEmail())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(participantsNamesDtos);

        } catch (Exception e) {
            log.error("Error retrieving participants names: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving participants names");
        }
    }

    @Override
    public ResponseEntity<?> getParticipantsDetails(Set<Long> participantIds) {
        if (participantIds == null || participantIds.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        try {
            // Construction directe des DTOs
            List<ParticipantsForPresenceListDto> participantsNamesDtos = userRepository
                    .findAllById(participantIds)
                    .stream()
                    .filter(Objects::nonNull)
                    .map(user -> ParticipantsForPresenceListDto.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .cin(user.getCin())
                            .cnss(user.getSocialSecurityNumber())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(participantsNamesDtos);

        } catch (Exception e) {
            log.error("Error retrieving participants details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving participants names");
        }
    }

    // Méthode helper pour construire le nom complet
    private String buildFullName(String firstName, String lastName) {
        StringBuilder name = new StringBuilder();

        if (firstName != null && !firstName.trim().isEmpty()) {
            name.append(firstName.trim());
        }

        if (lastName != null && !lastName.trim().isEmpty()) {
            if (name.length() > 0) {
                name.append(" ");
            }
            name.append(lastName.trim());
        }

        return name.length() > 0 ? name.toString() : "Unknown User";
    }

    public UserDetailsRequest mapToUserDetailsRequest(User user) {
        UserDetailsRequest userDetailsRequest = new UserDetailsRequest();
        userDetailsRequest.setFirstName(user.getFirstName());
        userDetailsRequest.setLastName(user.getLastName());
        userDetailsRequest.setEmail(user.getEmail());
        userDetailsRequest.setGender(user.getGender());
        userDetailsRequest.setBirthDate(user.getBirthDate());
        userDetailsRequest.setPhoneNumber(user.getPhoneNumber());
        userDetailsRequest.setAddress(user.getAddress());
        userDetailsRequest.setCin(user.getCin());
        return userDetailsRequest;
    }
}