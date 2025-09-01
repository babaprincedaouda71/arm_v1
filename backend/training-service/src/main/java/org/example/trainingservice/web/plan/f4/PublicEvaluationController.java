package org.example.trainingservice.web.plan.f4;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.plan.f4.QREvaluationScanResponseDto;
import org.example.trainingservice.dto.plan.f4.SubmitEvaluationResponsesDto;
import org.example.trainingservice.dto.plan.f4.SubmitResponseResultDto;
import org.example.trainingservice.service.plan.f4.PublicEvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller public pour l'accès aux évaluations via QR code (sans authentification)
 */
@RestController
@Slf4j
@RequestMapping("/api/public/evaluation")
public class PublicEvaluationController {

    private final PublicEvaluationService publicEvaluationService;

    public PublicEvaluationController(PublicEvaluationService publicEvaluationService) {
        this.publicEvaluationService = publicEvaluationService;
    }

    /**
     * Scanner un QR code et récupérer le formulaire d'évaluation
     * GET /api/public/evaluation/scan/{token}
     */
    @GetMapping("/scan/{token}")
    public ResponseEntity<QREvaluationScanResponseDto> scanEvaluationQR(@PathVariable String token) {
        log.info("Public evaluation QR scan: {}", token);
        return publicEvaluationService.scanEvaluationQR(token);
    }

    /**
     * Soumettre les réponses du questionnaire d'évaluation
     * POST /api/public/evaluation/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<SubmitResponseResultDto> submitEvaluationResponses(
            @RequestBody SubmitEvaluationResponsesDto request) {
        log.info("Public evaluation response submission for token: {}", request.getToken());
        return publicEvaluationService.submitEvaluationResponses(request);
    }
}