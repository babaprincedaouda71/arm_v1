package org.example.trainingservice.dto.plan.f4;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantInfoDto {
    private Long participantId;
    private String fullName;
    private String cin;
    private String cnss;
    private String email;
}