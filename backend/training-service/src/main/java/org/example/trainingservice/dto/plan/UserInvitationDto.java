package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserInvitationDto {
    private UUID id;
    private String trainingTheme;
    private UUID trainingId;
    private Long groupId;
    private String invitationDate;
    private Integer participantCount;
    private String status;
    private String trainerName;
    private String location;
    private String city;
    private List<String> dates;
}