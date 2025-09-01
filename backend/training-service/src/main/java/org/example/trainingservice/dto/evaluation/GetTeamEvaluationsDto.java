package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GetTeamEvaluationsDto {
    private UUID id;

    private String title;

    private String status;

    private String creationDate;

    private String type;

    private List<Long> participantIds;

    private Integer participants;

    private Integer progress;
}