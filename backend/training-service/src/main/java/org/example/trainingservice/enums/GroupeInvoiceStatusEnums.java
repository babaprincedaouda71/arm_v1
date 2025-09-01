package org.example.trainingservice.enums;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum GroupeInvoiceStatusEnums {
    NOT_PAID("Non Réglée"),
    PAID("Réglée"),
    CANCELLED("Annulée");

    private final String description;

    GroupeInvoiceStatusEnums(String description) {
        this.description = description;
    }

    /**
     * Recherche une constante d'énumération par sa description.
     *
     * @param description La description à rechercher (par exemple, "Réglée").
     * @return La constante d'énumération correspondante.
     * @throws IllegalArgumentException si aucune constante ne correspond à la description.
     */
    public static GroupeInvoiceStatusEnums fromDescription(String description) {
        return Arrays.stream(GroupeInvoiceStatusEnums.values())
                .filter(status -> status.description.equalsIgnoreCase(description))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Statut inconnu : " + description));
    }
}