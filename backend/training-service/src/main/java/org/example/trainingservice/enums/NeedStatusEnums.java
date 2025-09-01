package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum NeedStatusEnums {
    DRAFT("Brouillon"),
    APPROVED("Validé");

    private final String description;

    NeedStatusEnums(String description) {
        this.description = description;
    }

    /**
     * Convertit une description française en enum correspondant
     *
     * @param description La description en français ("Brouillon" ou "Validé")
     * @return L'enum correspondant
     * @throws IllegalArgumentException si la description n'est pas reconnue
     */
    public static NeedStatusEnums fromDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Le statut ne peut pas être null ou vide");
        }

        for (NeedStatusEnums status : values()) {
            if (status.description.equalsIgnoreCase(description.trim())) {
                return status;
            }
        }

        throw new IllegalArgumentException("Statut non reconnu: " + description +
                ". Statuts valides: " + String.join(", ",
                java.util.Arrays.stream(values())
                        .map(NeedStatusEnums::getDescription)
                        .toArray(String[]::new)));
    }

    /**
     * Vérifie si une description est valide
     *
     * @param description La description à vérifier
     * @return true si la description est valide, false sinon
     */
    public static boolean isValidDescription(String description) {
        try {
            fromDescription(description);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}