package org.example.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetAllUserResponse {
    private Long id;
    private Long companyId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String gender;
    private String birthDate;
    private String phoneNumber;
    private String address;
    private String cin;
    private String collaboratorCode;
    private String hiringDate;
    private String socialSecurityNumber;
    private String department;
    private GroupeDTO groupe;
    private String position;
    private String creationDate;
    private String manager;
    private String status;
    //    private GroupeResponse role;
    private boolean active;
}