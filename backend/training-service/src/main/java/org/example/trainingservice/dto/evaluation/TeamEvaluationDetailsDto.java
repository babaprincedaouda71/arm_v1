package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TeamEvaluationDetailsDto {
    private UUID id;

    private String title;

    private String category;

    private String startDate;

    private String status; // global

    private String creationDate;

    private String type;

    private List<TeamEvaluationDetailsForUserDto> participants;

    private Integer progress; // global

    private List<QuestionDto> questions;
}