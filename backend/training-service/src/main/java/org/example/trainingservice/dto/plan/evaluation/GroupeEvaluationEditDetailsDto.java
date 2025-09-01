package org.example.trainingservice.dto.plan.evaluation;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GroupeEvaluationEditDetailsDto {
    private UUID id;
    private String label;
    private String type;
    private String description;
    private LocalDate creationDate;
    private String status;
    private UUID questionnaireId;
    private List<Long> participantIds;
}