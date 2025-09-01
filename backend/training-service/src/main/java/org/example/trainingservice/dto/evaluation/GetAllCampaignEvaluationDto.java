package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class GetAllCampaignEvaluationDto {
    private UUID id;

    private String title;

    private String creationDate;

    private String department;

    private String site;

    private String questionnaire;

    private String status;

    private Integer progress;
}