package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum EvaluationSource {
    CAMPAIGN("Campaign"),
    GROUPE_EVALUATION("GroupeEvaluation");

    private final String description;

    EvaluationSource(String description) {
        this.description = description;
    }

}