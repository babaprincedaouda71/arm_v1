package org.example.authservice.dto;

import lombok.Data;

@Data
public class CompanyResponse {
    private Long id;
    private String name;
    private String mainContactEmail;
    private String mainContactFirstName;
    private String mainContactLastName;
    private String mainContactRole;
    private String mainContactPhone;
    private boolean registrationCompleted;
}