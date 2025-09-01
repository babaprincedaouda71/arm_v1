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
public class OCFDashboardDataDto {
    private Long id;

    private Long companyId;

    private String code;

    private String corporateName;

    private String ice;

    private String phone;

    private String email;

    private String address;

    private String website;

    private String nameMainContact;

    private String positionMainContact;

    private String phoneMainContact;

    private String emailMainContact;

    private String nameLegalRepresentant;

    private String positionLegalRepresentant;

    private String phoneLegalRepresentant;

    private String emailLegalRepresentant;

    private String staff;

    private LocalDate creationDate;

    private String legalForm;

    private String rc;

    private String patent;

    private String ifValue;

    private String cnss;

    private Integer permanentStaff;

    private String status;
}