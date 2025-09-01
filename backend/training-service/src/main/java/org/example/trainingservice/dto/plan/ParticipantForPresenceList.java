package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParticipantForPresenceList {
    private Long id;

    private String firstName;

    private String lastName;

    private String cnss;

    private String cin;
}