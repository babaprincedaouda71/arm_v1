package org.example.companyservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.companyservice.client.AuthClient;
import org.example.companyservice.client.NotificationClient;
import org.example.companyservice.dto.*;
import org.example.companyservice.entity.Company;
import org.example.companyservice.exceptions.CompanyAlreadyExistsException;
import org.example.companyservice.repository.CompanyRepository;
import org.example.companyservice.utils.CompanyUtilMethods;
import org.example.companyservice.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository companyRepository;
    private final NotificationClient notificationClient;
    private final TokenService tokenService;
    private final AuthClient authClient;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public CompanyServiceImpl(CompanyRepository companyRepository, NotificationClient notificationClient, TokenService tokenService, AuthClient authClient) {
        this.companyRepository = companyRepository;
        this.notificationClient = notificationClient;
        this.tokenService = tokenService;
        this.authClient = authClient;
    }

    @Override
    public CompanyResponse registerCompany(InitialRegistrationRequest request) {
        if (companyRepository.existsByMainContactEmail(request.getMainContactEmail())) {
            throw new CompanyAlreadyExistsException("Une entreprise avec cet email exist déjà", "mainContactEmail");
        }

        Company company = Company.builder()
                .name(request.getCompanyName())
                .cnssNumber(request.getCnss())
                .mainContactFirstName(request.getMainContactFirstName())
                .mainContactLastName(request.getMainContactLastName())
                .mainContactEmail(request.getMainContactEmail())
                .mainContactPhone(request.getMainContactPhone())
                .mainContactRole(request.getMainContactRole())
                .registrationCompleted(false)
                .status("En_Attente")
                .build();

        Company savedCompany = companyRepository.save(company);

        //Send notification
        sendPasswordSetupEmail(savedCompany);

        return mapToCompanyResponse(savedCompany);
    }

    @Override
    public CompanyResponse updateCompanyDetails(CompanyDetailsRequest request) {
        Company company = companyRepository.findById(Long.parseLong(request.getCompanyId()))
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée"));

        company.setEmployees(request.getEmployees());
        company.setSector(request.getSector());
        company.setLegalContactFirstName(request.getLegalContactFirstName());
        company.setLegalContactLastName(request.getLegalContactLastName());
        company.setLegalContactRole(request.getLegalContactRole());
        company.setIceNumber(request.getIceNumber());
        company.setRegistrationCompleted(true);

        Company updatedCompany = companyRepository.save(company);

        return mapToCompanyResponse(updatedCompany);
    }

    @Override
    public CompanyResponse getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée"));

        return mapToCompanyResponse(company);
    }

    @Override
    public CompanyResponse getCompanyByIdSecure(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée"));

        return mapToCompanyResponse(company);
    }

    @Override
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    @Override
    public ResponseEntity<?> getAllWaiting() {
        return ResponseEntity.ok(companyRepository.findAllByStatus("En_Attente"));
    }

    @Override
    public ResponseEntity<?> getCurrentCompany() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        log.error("Company id : {}", companyId);
        Optional<Company> byId = companyRepository.findById(companyId);
        if (byId.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(CompanyUtilMethods.mapToCurrentCompanyDto(byId.get()));
    }

    @Override
    public ResponseEntity<?> getName(Long id) {
        Optional<Company> byId = companyRepository.findById(id);
        if (byId.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Company company = byId.get();
        String name = company.getName();
        return ResponseEntity.ok(name);
    }

    /********************************************************/

    private void sendPasswordSetupEmail(Company company) {
        // Générer un jeton pour la configuration du mot de passe
        String token = tokenService.generateToken(company.getId(), company.getMainContactEmail());
        String passwordSetupLink = frontendUrl + "/account-creation/setting-password?token=" + token;

        // Envoyer l'émail
        EmailNotificationRequest emailRequest = EmailNotificationRequest.builder()
                .recipient(company.getMainContactEmail())
                .emailType("ACTIVATION")
                .activationLink(passwordSetupLink)
                .build();

        notificationClient.sendEmail(emailRequest);

        // Créer un token de réinitialisation de mot de passe dans Auth Service
        CreatePasswordTokenRequest tokenRequest = CreatePasswordTokenRequest.builder()
                .companyId(company.getId())
                .email(company.getMainContactEmail())
                .token(token)
                .build();

        authClient.createPasswordToken(tokenRequest); // Appel à AuthService via Feign
    }

    private CompanyResponse mapToCompanyResponse(Company company) {
        CompanyResponse response = new CompanyResponse();
        response.setId(company.getId());
        response.setName(company.getName());
        response.setMainContactFirstName(company.getMainContactFirstName());
        response.setMainContactLastName(company.getMainContactLastName());
        response.setMainContactRole(company.getMainContactRole());
        response.setMainContactEmail(company.getMainContactEmail());
        response.setMainContactPhone(company.getMainContactPhone());
        response.setEmployees(company.getEmployees());
        response.setSector(company.getSector());
        response.setLegalContactFirstName(company.getLegalContactFirstName());
        response.setLegalContactLastName(company.getLegalContactLastName());
        response.setLegalContactRole(company.getLegalContactRole());
        response.setIceNumber(company.getIceNumber());
        response.setCnssNumber(company.getCnssNumber());
        response.setRegistrationCompleted(company.isRegistrationCompleted());
        return response;
    }
}