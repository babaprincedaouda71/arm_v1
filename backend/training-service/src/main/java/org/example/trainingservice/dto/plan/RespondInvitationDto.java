package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RespondInvitationDto {
    private Long userId;

    private String action;
}