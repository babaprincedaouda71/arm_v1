package org.example.authservice.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsRequest {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
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
    private String creationDate;
    private String status;
    private String groupe;
}