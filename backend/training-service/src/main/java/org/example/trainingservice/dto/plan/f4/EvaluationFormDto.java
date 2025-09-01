package org.example.trainingservice.dto.plan.f4;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationFormDto {
    private String token;
    private UUID groupeEvaluationId;
    private String evaluationLabel;
    private String evaluationType;
    private ParticipantInfoDto participant;
    private TrainingInfoDto training;
    private QuestionnaireDto questionnaire;
}