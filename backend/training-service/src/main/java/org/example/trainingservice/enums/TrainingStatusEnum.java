package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum TrainingStatusEnum {
    NOT_PLANNED("Non Planifiée"),
    PLANNED("Planifiée"),
    IN_PROGRESS(" En Cours"),
    COMPLETED("Terminée"),
    CANCELLED("Annulée");

    private final String description;

    TrainingStatusEnum(String description) {
        this.description = description;
    }
}