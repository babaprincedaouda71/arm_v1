package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AddCampaignEvaluationDto {
    private String title;

    private List<Long> departmentIds;

    private List<Long> siteIds;

    private List<Long> participantIds;

    private List<UUID> questionnaireIds;

    private String instructions;
}