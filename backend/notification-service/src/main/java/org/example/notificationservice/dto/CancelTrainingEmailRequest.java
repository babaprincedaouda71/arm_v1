package org.example.notificationservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class CancelTrainingEmailRequest {
    private Set<String> emails;

    private String object;

    private String message;
}