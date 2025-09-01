package org.example.trainingservice.helper.plan.evaluation;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.trainingservice.enums.EvaluationSource;

import java.util.UUID;

@Data
@AllArgsConstructor
public class EvaluationContext {
    private EvaluationSource source;
    private UUID evaluationId; // campaignEvaluationId OU groupeEvaluationId

    @Override
    public String toString() {
        return String.format("EvaluationContext{source=%s, evaluationId=%s}", source, evaluationId);
    }
}