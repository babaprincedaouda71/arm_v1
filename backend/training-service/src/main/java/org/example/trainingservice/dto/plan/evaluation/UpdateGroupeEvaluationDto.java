package org.example.trainingservice.dto.plan.evaluation;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UpdateGroupeEvaluationDto {
    private String label;
    private String type;
    private UUID questionnaireId;
    private List<Long> participantIds;
}