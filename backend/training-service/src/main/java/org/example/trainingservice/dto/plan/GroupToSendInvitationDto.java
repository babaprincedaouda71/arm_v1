package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GroupToSendInvitationDto {
    private Long id;
    private String name;
    private Integer participantCount;
    private String targetAudience;
    private String location;
}