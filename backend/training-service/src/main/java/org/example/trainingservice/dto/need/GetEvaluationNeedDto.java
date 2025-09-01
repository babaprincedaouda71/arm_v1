package org.example.trainingservice.dto.need;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GetEvaluationNeedDto {
    private Long id;

    private String theme;

    private String creationDate;

    private String domain;

    private String questionnaire;

    private String priority;

    private String manager;

    private String status;
}