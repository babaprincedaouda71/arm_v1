package org.example.trainingservice.service.evaluations;

import org.example.trainingservice.dto.evaluation.AddCampaignEvaluationDto;
import org.example.trainingservice.dto.evaluation.PublishCampaignDto;
import org.example.trainingservice.dto.evaluation.UpdateCampaignEvaluationDto;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface CampaignEvaluationService {
    ResponseEntity<?> addCampaignEvaluation(AddCampaignEvaluationDto dto);

    ResponseEntity<?> getAllCampaignEvaluation();

    ResponseEntity<?> getCampaignEvaluationEditDetails(UUID id);

    ResponseEntity<?> updateCampaignEvaluation(UUID id, UpdateCampaignEvaluationDto updateCampaignEvaluationDto);

    ResponseEntity<?> deleteCampaignEvaluation(UUID id);

    ResponseEntity<?> publishCampaign(PublishCampaignDto publishCampaignDto);

    ResponseEntity<?> getCampaignEvaluationDetails(UUID id);

    ResponseEntity<?> deleteUserResponse(Long participantId, UUID questionnaireId);
}