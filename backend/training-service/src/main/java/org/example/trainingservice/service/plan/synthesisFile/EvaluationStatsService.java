package org.example.trainingservice.service.plan.synthesisFile;

import org.example.trainingservice.dto.plan.synthesisFile.EvaluationSyntheseDto;

import java.util.UUID;

public interface EvaluationStatsService {
    /**
     * Génère les statistiques de synthèse pour une évaluation de groupe
     */
    EvaluationSyntheseDto generateEvaluationSynthese(UUID groupeEvaluationId);
}