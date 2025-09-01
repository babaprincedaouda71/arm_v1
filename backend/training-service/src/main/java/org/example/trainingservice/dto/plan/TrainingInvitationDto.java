package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;
import org.example.trainingservice.enums.InvitationStatusEnum;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class TrainingInvitationDto {
    private UUID id;

    private Long userId;

    private String userFullName;

    private String userEmail;

    private LocalDate invitationDate;

    private  String theme;

    private String status;
}