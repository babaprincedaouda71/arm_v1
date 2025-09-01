package org.example.trainingservice.web.plan;

import org.example.trainingservice.dto.plan.CancelTrainingDto;
import org.example.trainingservice.dto.plan.EditTrainingDto;
import org.example.trainingservice.service.plan.TrainingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/plan/trainings")
public class TrainingController {
    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @GetMapping("/get/all/{planId}")
    public ResponseEntity<?> getAllTrainings(@PathVariable UUID planId) {
        return trainingService.getAllTrainings(planId);
    }

    @GetMapping("/get/details/{trainingId}")
    public ResponseEntity<?> getTrainingDetails(@PathVariable UUID trainingId) {
        return trainingService.getTrainingDetails(trainingId);
    }

    @GetMapping("/get/trainingForAddGroup/{id}")
    public ResponseEntity<?> getNeedForAddGroup(@PathVariable UUID id) {
        return trainingService.getTrainingForAddGroup(id);
    }

    @GetMapping("/get/trainingToEdit/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        return trainingService.getTrainingToEditById(id);
    }

    @GetMapping("/get/trainingDetailForCancel/{id}")
    public ResponseEntity<?> trainingDetailForCancel(@PathVariable UUID id) {
        return trainingService.trainingDetailForCancel(id);
    }

    @GetMapping("/get/trainingDetailForInvitation/{trainingId}/{groupId}")
    public ResponseEntity<?> trainingDetailForInvitation(@PathVariable UUID trainingId, @PathVariable Long groupId) {
        return trainingService.trainingDetailForInvitation(trainingId, groupId);
    }

    @PostMapping("/cancel/training")
    public ResponseEntity<?> cancelTraining(@RequestBody CancelTrainingDto cancelTrainingDto) {
        return trainingService.cancelTraining(cancelTrainingDto);
    }

    @GetMapping("/get/getParticipants/{id}")
    public ResponseEntity<?> getParticipantsForTrainingCancellation(@PathVariable UUID id) {
        return trainingService.getParticipantsForTrainingCancellation(id);
    }

    @PutMapping("/edit/training/{id}")
    public ResponseEntity<?> edit(@PathVariable UUID id, @RequestBody EditTrainingDto editTrainingDto) {
        return trainingService.editTraining(id, editTrainingDto);
    }
}