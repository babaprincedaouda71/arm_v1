package org.example.trainingservice.enums;


import lombok.Getter;

import java.util.Arrays;

@Getter
public enum GroupeEvaluationStatusEnums {
    DRAFT("Brouillon"),
    PUBLISHED("Publiée"),
    CLOSED("Terminée"),
    AUTO("Auto");

    private final String description;

    GroupeEvaluationStatusEnums(String description) {
        this.description = description;
    }

    /**
     * Recherche une constante d'énumération par sa description.
     *
     * @param description La description à rechercher (par exemple, "Réglée").
     * @return La constante d'énumération correspondante.
     * @throws IllegalArgumentException si aucune constante ne correspond à la description.
     */
    public static GroupeEvaluationStatusEnums fromDescription(String description) {
        return Arrays.stream(GroupeEvaluationStatusEnums.values())
                .filter(status -> status.description.equalsIgnoreCase(description))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Statut inconnu : " + description));
    }
}