package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UpdateQuestionnaireStatusDto {
    private String questionnaireType;

    private Boolean isDefault;
}