package org.example.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private Long id;
    private Long companyId;
    private Long managerId;
    private String firstName;
    private String lastName;
    private String gender;
    private String address;
    private String birthDate;
    private String phoneNumber;
    private String cin;
    private String role;
    private String email;
}