package org.example.trainingservice.service.plan;

import org.example.trainingservice.dto.plan.CancelTrainingDto;
import org.example.trainingservice.dto.plan.EditTrainingDto;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface TrainingService {
    ResponseEntity<?> getAllTrainings(UUID planId);

    ResponseEntity<?> getTrainingDetails(UUID trainingId);

    ResponseEntity<?> getTrainingForAddGroup(UUID id);

    ResponseEntity<?> getTrainingToEditById(UUID id);

    ResponseEntity<?> editTraining(UUID id, EditTrainingDto editTrainingDto);

    ResponseEntity<?> trainingDetailForCancel(UUID id);

    ResponseEntity<?> trainingDetailForInvitation(UUID trainingId, Long groupId);

    ResponseEntity<?> getParticipantsForTrainingCancellation(UUID id);

    ResponseEntity<?> cancelTraining(CancelTrainingDto cancelTrainingDto);
}