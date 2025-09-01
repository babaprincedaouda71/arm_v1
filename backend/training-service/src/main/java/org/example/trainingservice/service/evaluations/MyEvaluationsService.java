package org.example.trainingservice.service.evaluations;

import org.example.trainingservice.dto.evaluation.AddUserResponseDto;
import org.example.trainingservice.dto.evaluation.SendEvaluationDto;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

public interface MyEvaluationsService {
    ResponseEntity<?> getMyEvaluations(Long userId);

    ResponseEntity<?> addUserResponse(UUID questionnaireId, List<AddUserResponseDto> addUserResponseDtos);

    ResponseEntity<?> getAllUserResponses(Long userId, UUID questionnaireId);

    ResponseEntity<?> sendEvaluation(UUID id, SendEvaluationDto sendEvaluationDto);

    ResponseEntity<?> getAllUserQuestionsResponses(Long userId, UUID questionnaireId);
}