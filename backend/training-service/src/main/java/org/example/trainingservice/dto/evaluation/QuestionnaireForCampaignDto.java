package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class QuestionnaireForCampaignDto {
    private UUID id;
    private String title;
}