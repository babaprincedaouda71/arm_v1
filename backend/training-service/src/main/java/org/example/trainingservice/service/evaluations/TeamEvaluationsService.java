package org.example.trainingservice.service.evaluations;

import org.example.trainingservice.dto.evaluation.SendEvaluationToAdminDto;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface TeamEvaluationsService {
    ResponseEntity<?> getTeamEvaluations(Long managerId);

    ResponseEntity<?> getTeamEvaluationDetails(UUID questionnaireId, Long managerId);

    ResponseEntity<?> sendEvaluationToAdmin(UUID id, SendEvaluationToAdminDto sendEvaluationToAdminDto);

    // 🔄 CHANGÉ : Méthode prend groupeEvaluationId au lieu de questionnaireId
    ResponseEntity<?> getAdminEvaluationDetails(UUID groupeEvaluationId);
}