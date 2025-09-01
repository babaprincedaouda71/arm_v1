package org.example.companyservice.dto;

import lombok.Data;

@Data
public class CompanyResponse {
    private Long id;
    private String name;
    private String mainContactFirstName;
    private String mainContactLastName;
    private String mainContactRole;
    private String mainContactEmail;
    private String mainContactPhone;
    private String employees;
    private String sector;
    private String legalContactFirstName;
    private String legalContactLastName;
    private String legalContactRole;
    private String iceNumber;
    private String cnssNumber;
    private boolean registrationCompleted;
}