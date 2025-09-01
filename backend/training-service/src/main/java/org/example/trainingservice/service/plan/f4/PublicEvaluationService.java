package org.example.trainingservice.service.plan.f4;

import org.example.trainingservice.dto.plan.f4.QREvaluationScanResponseDto;
import org.example.trainingservice.dto.plan.f4.SubmitEvaluationResponsesDto;
import org.example.trainingservice.dto.plan.f4.SubmitResponseResultDto;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface PublicEvaluationService {

    /**
     * Scanner un QR code et récupérer le formulaire d'évaluation
     */
    ResponseEntity<QREvaluationScanResponseDto> scanEvaluationQR(String token);

    /**
     * Soumettre les réponses du questionnaire d'évaluation
     */
    ResponseEntity<SubmitResponseResultDto> submitEvaluationResponses(SubmitEvaluationResponsesDto request);

    /**
     * Générer les tokens QR pour tous les participants d'une évaluation
     * (appelé lors de la publication)
     */
    void generateQRTokensForEvaluation(UUID groupeEvaluationId);
}