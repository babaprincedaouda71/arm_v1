package org.example.authservice.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfessionalInfos {
    private String collaboratorCode;
    private String hiringDate;
    private String department;
    private String position;
    private String level;
    private String socialSecurityNumber;
    private List<String> certificates;
    private List<String> competences;
}