package org.example.authservice.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CampaignEvaluationParticipantsDto {
    private Long id;

    private String collaboratorCode;

    private String firstName;

    private String lastName;

    private String email;

    private String cin;

    private String cnss;

    private String position;

    private String level;

    private String manager;

    private String department;

    private String site;

    private String groupe;
}