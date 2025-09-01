package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum InvitationStatusEnum {
    NOT_SENT("Non envoyée"),
    PENDING("En attente"),
    ACCEPTED("Acceptée"),
    DECLINED("Refusée"),
    EXPIRED("Expirée"),
    CANCELLED("Annulée");

    private final String description;

    InvitationStatusEnum(String description) {
        this.description = description;
    }

}