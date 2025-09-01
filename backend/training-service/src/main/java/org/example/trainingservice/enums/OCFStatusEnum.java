package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum OCFStatusEnum {
    ACTIVE("Actif"),
    INACTIVE("Inactif");

    private final String description;

    OCFStatusEnum(String description) {
        this.description = description;
    }
}