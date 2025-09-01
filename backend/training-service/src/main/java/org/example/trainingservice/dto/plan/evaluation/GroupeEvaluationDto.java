package org.example.trainingservice.dto.plan.evaluation;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class GroupeEvaluationDto {
    private UUID id;

    private String label;

    private String type;

    private String description;

    private LocalDate creationDate;

    private String status;
}