package org.example.trainingservice.service.trainingRequests;

import org.example.trainingservice.dto.trainingRequest.AddMyTrainingRequestDto;
import org.example.trainingservice.dto.trainingRequest.UpdateTeamRequestStatusDto;
import org.springframework.http.ResponseEntity;

public interface TrainingRequestService {
    ResponseEntity<?> getMyRequests(Long userId);

    ResponseEntity<?> getTeamRequests(Long managerId);

    ResponseEntity<?> addNewRequest(AddMyTrainingRequestDto newRequest);

    ResponseEntity<?> updateTeamRequestStatus(Long approverId, UpdateTeamRequestStatusDto updateTeamRequestStatusDto);
}