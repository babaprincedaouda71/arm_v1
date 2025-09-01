package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GetQuestionnaireDto {
    private UUID id;
    private String title;
    private String questionnaireType; // Le type de questionnaire (ex: "SATISFACTION_CLIENT", "AUDIT_INTERNE")
    private String description;
    private LocalDate creationDate;
    private List<GetQuestionDto> questions;
    private Boolean isDefault;
}