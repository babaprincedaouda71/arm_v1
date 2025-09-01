package org.example.authservice.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyProfileDto {
    private Long id;
    private Long companyId;
    private PersonalInfos personalInfos;
    private ProfessionalInfos professionalInfos;
    private String creationDate;
    private String status;
    private String groupe;
}