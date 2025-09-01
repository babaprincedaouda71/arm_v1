package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GetQuestionDto {
    private UUID id;
    private String type;
    private String text;
    private String comment;
    private List<String> options;
    private Integer scoreValue;
    private List<String> levels;
    private Integer ratingValue;
}