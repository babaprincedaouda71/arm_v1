package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum TrainingType {
    INTERNAL("Interne"),
    EXTERNAL("Externe");

    private final String description;

    TrainingType(String description) {
        this.description = description;
    }
}