package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CampaignEvaluationDetailsDto {
    private UUID id;

    private Long participantId;

    private String site;

    private String department;

    private String lastName;

    private String firstName;

    private String groupe;

    private String status;

    private String manager;

    private String responseDate;

    private UUID questionnaireId;
}