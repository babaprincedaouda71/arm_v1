package org.example.trainingservice.utils;

import org.example.trainingservice.dto.plan.evaluation.GroupeEvaluationDto;
import org.example.trainingservice.entity.plan.evaluation.GroupeEvaluation;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class GroupeEvaluationUtilMethods {
    public static List<GroupeEvaluationDto> mapToGroupeEvaluationDtos(List<GroupeEvaluation> allByTrainingIdAndGroupeId) {
        if (allByTrainingIdAndGroupeId == null || allByTrainingIdAndGroupeId.isEmpty()) {
            return Collections.emptyList();
        }

        return allByTrainingIdAndGroupeId.stream()
                .map(GroupeEvaluationUtilMethods::mapToGroupeEvaluationDto)
                .collect(Collectors.toList());
    }

    private static GroupeEvaluationDto mapToGroupeEvaluationDto(GroupeEvaluation groupeEvaluation) {
        if (groupeEvaluation == null) {
            return null;
        }

        return GroupeEvaluationDto.builder()
                .id(groupeEvaluation.getId())
                .label(groupeEvaluation.getLabel())
                .type(groupeEvaluation.getType())
                .description(groupeEvaluation.getDescription())
                .creationDate(groupeEvaluation.getCreationDate())
                .status(groupeEvaluation.getStatus().getDescription())
                .build();
    }
}