package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TrainingDetailsForInvitationDto {
    private UUID id;

    private String theme;

    private String csfPlanifie;

    private String startDate;

    private String location;
}