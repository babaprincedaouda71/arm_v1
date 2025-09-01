package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CancelTrainingResponse {
    private UUID trainingId;
    private String status;
    private int notifiedParticipants;
}