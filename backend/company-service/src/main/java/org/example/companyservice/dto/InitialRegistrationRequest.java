package org.example.companyservice.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InitialRegistrationRequest {
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "CNSS name is required")
    private String cnss;

    @NotBlank(message = "Contact first name is required")
    private String mainContactFirstName;

    @NotBlank(message = "Contact last name is required")
    private String mainContactLastName;

    @NotBlank(message = "Contact role is required")
    private String mainContactRole;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Email should be valid")
    private String mainContactEmail;

    @NotBlank(message = "Contact phone is required")
    private String mainContactPhone;
}