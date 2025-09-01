package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum GroupeStatusEnums {
    DRAFT("Brouillon"),
    APPROVED("Validé"),
    PLANNED("Planifié"),
    IN_PROGRESS("En Cours"),
    COMPLETED("Terminé"),
    CANCELLED("Annulé");

    private final String description;

    GroupeStatusEnums(String description) {
        this.description = description;
    }

    /**
     * Vérifie si le statut peut être automatiquement mis à jour
     * DRAFT reste DRAFT jusqu'à validation manuelle
     */
    public boolean canBeAutoUpdated() {
        return this != DRAFT;
    }
}