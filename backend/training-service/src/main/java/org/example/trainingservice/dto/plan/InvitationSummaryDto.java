package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvitationSummaryDto {
    private Integer totalParticipants;
    private Integer newInvitations;
    private Integer existingInvitations;
    private Integer emailsSent;
    private Integer smsSent;
    private String message;

    public String getMessage() {
        if (message != null) {
            return message;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Invitations traitées avec succès. ");
        sb.append("Nouvelles invitations: ").append(newInvitations).append(", ");
        sb.append("Emails envoyés: ").append(emailsSent);

        if (smsSent > 0) {
            sb.append(", SMS envoyés: ").append(smsSent);
        }

        if (existingInvitations > 0) {
            sb.append(". ").append(existingInvitations).append(" participant(s) avaient déjà reçu une invitation.");
        }

        return sb.toString();
    }
}