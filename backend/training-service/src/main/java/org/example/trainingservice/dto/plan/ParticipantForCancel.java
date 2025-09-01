package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParticipantForCancel {
    private Long id;

    private String name;

    private String email;
}