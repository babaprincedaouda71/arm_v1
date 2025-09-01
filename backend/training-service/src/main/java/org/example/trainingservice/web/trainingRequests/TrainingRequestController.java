package org.example.trainingservice.web.trainingRequests;

import org.example.trainingservice.dto.trainingRequest.AddMyTrainingRequestDto;
import org.example.trainingservice.dto.trainingRequest.UpdateTeamRequestStatusDto;
import org.example.trainingservice.service.trainingRequests.TrainingRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainings/training-requests")
public class TrainingRequestController {
    private final TrainingRequestService trainingRequestService;

    public TrainingRequestController(TrainingRequestService trainingRequestService) {
        this.trainingRequestService = trainingRequestService;
    }

    @GetMapping("/get/my-requests/{userId}")
    public ResponseEntity<?> getMyRequests(@PathVariable Long userId) {
        return trainingRequestService.getMyRequests(userId);
    }

    @PostMapping("/add/new-request")
    public ResponseEntity<?> addNewRequest(@RequestBody AddMyTrainingRequestDto newRequest) {
        return trainingRequestService.addNewRequest(newRequest);
    }

    @GetMapping("/get/team-requests/{managerId}")
    public ResponseEntity<?> getTeamRequests(@PathVariable Long managerId) {
        return trainingRequestService.getTeamRequests(managerId);
    }

    @PutMapping("/update-status/{approverId}")
    public ResponseEntity<?> updateTeamRequestStatus(@PathVariable Long approverId, @RequestBody UpdateTeamRequestStatusDto updateTeamRequestStatusDto) {
        return trainingRequestService.updateTeamRequestStatus(approverId, updateTeamRequestStatusDto);
    }
}