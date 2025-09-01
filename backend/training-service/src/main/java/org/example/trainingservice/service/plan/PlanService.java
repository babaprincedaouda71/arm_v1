package org.example.trainingservice.service.plan;

import org.example.trainingservice.dto.plan.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

public interface PlanService {
    ResponseEntity<?> getAllPlan();

    ResponseEntity<PlanPagedResponse<PlanDto>> getAllPlanPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection,
            @RequestParam(required = false) String search);

    ResponseEntity<?> addPlan(AddPlanDto addPlanDto);

    ResponseEntity<?> addThemeToPlan(AddThemeToPlanDto addThemeToPlanDto);

    ResponseEntity<?> updateStatus(UpdatePlanStatusRequestDto updateStatusRequestDto);

    @Transactional
    ResponseEntity<?> removeTrainingFromPlan(UUID trainingId);
}