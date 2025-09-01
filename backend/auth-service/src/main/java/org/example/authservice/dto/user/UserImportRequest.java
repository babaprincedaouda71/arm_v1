package org.example.authservice.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserImportRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String creationDate;
    private String status;
    private String gender;
    private String birthDate;
    private String phoneNumber;
    private String address;
    private String cin;
    private String collaboratorCode;
    private String hiringDate;
    private String socialSecurityNumber;
    private String department;
    private String position;
}