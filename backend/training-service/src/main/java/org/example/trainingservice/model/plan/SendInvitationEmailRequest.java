package org.example.trainingservice.model.plan;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class SendInvitationEmailRequest {
    private Set<String> emails;

    private String object;

    private String message;
}