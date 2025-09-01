package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class QuestionDto {
    private UUID id;

    private Long companyId;

    private String type;

    private String text;

    private List<String> options;

    private Integer scoreValue;

    private Integer ratingValue;

    private List<String> levels;
}