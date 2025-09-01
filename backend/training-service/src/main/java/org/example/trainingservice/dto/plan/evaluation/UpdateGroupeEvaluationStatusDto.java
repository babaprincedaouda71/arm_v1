package org.example.trainingservice.dto.plan.evaluation;

import lombok.Data;

import java.util.UUID;

@Data
public class UpdateGroupeEvaluationStatusDto {
    private UUID id;

    private String status;
}