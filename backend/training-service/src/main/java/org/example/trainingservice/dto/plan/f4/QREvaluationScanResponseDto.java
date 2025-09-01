package org.example.trainingservice.dto.plan.f4;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QREvaluationScanResponseDto {
    private Boolean valid;
    private String message;
    private String errorCode;
    private EvaluationFormDto evaluationForm;
}