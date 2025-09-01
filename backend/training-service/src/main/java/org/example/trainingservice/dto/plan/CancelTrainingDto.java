package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class CancelTrainingDto {
    private UUID trainingId;

    private String priority;

    private String object;

    private String content;

    private Set<Long> participantIds;

    private Boolean includeInternalTrainer;

    private Boolean includeOcf;

    private Boolean sendSms;
}