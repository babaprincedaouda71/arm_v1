package org.example.trainingservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.enums.OCFStatusEnum;

import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OCF {
    // Information sur l'entreprise
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long companyId;

    private String corporateName;

    private String address;

    private String phone;

    private String email;

    private String website;

    private String staff;

    private LocalDate creationDate;

    private String legalForm;

    private String ice;

    private String rc;

    private String patent;

    private String ifValue; // 'if' est un mot réservé en Java, donc on renomme

    private String cnss;

    private Integer permanentStaff;

    private String password;

    // Legal representant

    private String nameLegalRepresentant;

    private String positionLegalRepresentant;

    private String phoneLegalRepresentant;

    private String emailLegalRepresentant;

    // Main contact

    private String nameMainContact;

    private String positionMainContact;

    private String phoneMainContact;

    private String emailMainContact;

    // Documents
    private String legalStatusFile;
    private String eligibilityCertificateFile;
    private String jrcTemplateFile;
    private String insurancePolicyFile;
    private String taxComplianceCertificateFile;
    private String bankStatementCertificateFile;
    private String otherCertificationsFile;
    private String clientReferencesFile;
    private String qualificationDocumentFile;
    private String termsAndConditionsFile;
    private String validityProofFile;

    // Statut
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private OCFStatusEnum status;
}