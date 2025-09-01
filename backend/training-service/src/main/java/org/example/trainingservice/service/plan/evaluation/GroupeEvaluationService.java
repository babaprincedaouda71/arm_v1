package org.example.trainingservice.service.plan.evaluation;

import org.example.trainingservice.dto.evaluation.Participant;
import org.example.trainingservice.dto.plan.evaluation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface GroupeEvaluationService {
    List<GroupeEvaluationDto> getAllGroupeEvaluations(UUID trainingId, Long groupId);

    List<Participant> fetchParticipants(UUID trainingId, Long groupId);

    void addGroupeEvaluation(UUID trainingId, Long groupId, AddGroupeEvaluationDto addGroupeEvaluationDto);

    void updateStatus(UpdateGroupeEvaluationStatusDto dto);

    ResponseEntity<?> getGroupeEvaluationForQuestionnaire(UUID groupeEvaluationId);

    ResponseEntity<?> getQRTokensForEvaluation(UUID groupeEvaluationId);

    ResponseEntity<?> getParticipantResponses(Long participantId, UUID groupeEvaluationId);

    @Transactional
    ResponseEntity<?> deleteGroupeEvaluation(UUID groupeEvaluationId);

    GroupeEvaluationEditDetailsDto getGroupeEvaluationEditDetails(UUID evaluationId);

    void updateGroupeEvaluation(UUID evaluationId, UpdateGroupeEvaluationDto updateDto);
}