package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AddQuestionnaireDto {
    private String title;

    private String questionnaireType;

    private String description;

    private List<AddQuestionDto> questions;

    private Boolean isDefault;
}