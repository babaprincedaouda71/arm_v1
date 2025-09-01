package org.example.trainingservice.dto.plan.evaluation;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class AddGroupeEvaluationDto {
    private String label;

    private String type;

    private UUID questionnaireId;

    private List<Long> participantIds;
}