package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum PlanStatusEnum {
    NOT_PLANNED("Non Planifié"),
    PLANNED("Planifié"),
    EXECUTED("Réalisé"),
    COMPLETED("Terminé"),
    CANCELLED("Annulé");

    private final String description;

    PlanStatusEnum(String description) {
        this.description = description;
    }
}