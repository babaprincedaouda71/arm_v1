package org.example.authservice.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonalInfos {
    private String fullName;
    private String gender;
    private String birthDate;
    private String address;
    private String phoneNumber;
    private String email;
    private String cin;
}