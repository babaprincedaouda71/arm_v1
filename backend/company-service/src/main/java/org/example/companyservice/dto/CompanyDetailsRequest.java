package org.example.companyservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompanyDetailsRequest {
    @NotNull(message = "Company id is missing")
    private String companyId;

    @NotNull(message = "Number of employees is required")
    private String employees;

    @NotBlank(message = "Business sector is required")
    private String sector;

    @NotBlank(message = "Legal contact first name is required")
    private String legalContactFirstName;

    @NotBlank(message = "Legal contact last name is required")
    private String legalContactLastName;

    @NotBlank(message = "Legal contact role is required")
    private String legalContactRole;

    @NotBlank(message = "ICE number is required")
    private String iceNumber;
}