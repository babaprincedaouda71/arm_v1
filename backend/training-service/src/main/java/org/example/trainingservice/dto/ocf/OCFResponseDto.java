package org.example.trainingservice.dto.ocf;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OCFResponseDto {
    private Long id;
    private Long companyId;
    private String code;
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
    private String ifValue;
    private String cnss;
    private Integer permanentStaff;

    // Représentant légal
    private String nameLegalRepresentant;
    private String positionLegalRepresentant;
    private String phoneLegalRepresentant;
    private String emailLegalRepresentant;

    // Contact principal
    private String nameMainContact;
    private String positionMainContact;
    private String phoneMainContact;
    private String emailMainContact;

    // Noms des fichiers pour la gestion des documents existants
    private String legalStatusFile;
    private String eligibilityCertificateFile;
    private String jrcTemplateFile;
    private String insurancePolicyFile;
    private String taxComplianceCertificateFile;
    private String bankStatementCertificateFile;
    private String termsAndConditionsFile;
    private String otherCertificationsFile;
}