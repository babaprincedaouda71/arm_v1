package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AddQuestionDto {
    private String type;

    private String text;

    private String comment;

    private List<String> options;

    private Integer scoreValue;

    private Integer ratingValue;

    private List<String> levels;
}