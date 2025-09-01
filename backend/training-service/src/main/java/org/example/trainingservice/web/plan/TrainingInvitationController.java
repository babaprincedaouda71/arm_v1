package org.example.trainingservice.web.plan;

import org.example.trainingservice.dto.plan.RespondInvitationDto;
import org.example.trainingservice.dto.plan.SendInvitationDto;
import org.example.trainingservice.service.plan.TrainingInvitationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/plan/trainings/invitations")
public class TrainingInvitationController {
    private final TrainingInvitationService trainingInvitationService;

    public TrainingInvitationController(TrainingInvitationService trainingInvitationService) {
        this.trainingInvitationService = trainingInvitationService;
    }

    @GetMapping("/get/all/{groupId}")
    public ResponseEntity<?> getInvitations(@PathVariable Long groupId) {
        return trainingInvitationService.getInvitations(groupId);
    }

    @PostMapping("/send-invitations/{groupId}")
    public ResponseEntity<?> sendInvitations(@PathVariable Long groupId, @RequestBody SendInvitationDto sendInvitationDto) {
        return trainingInvitationService.sendInvitations(groupId, sendInvitationDto);
    }

    @PostMapping("/send-trainer-invitation/{groupId}")
    public ResponseEntity<?> sendTrainerInvitation(@PathVariable Long groupId, @RequestBody SendInvitationDto sendInvitationDto) {
        return trainingInvitationService.sendTrainerInvitation(groupId, sendInvitationDto);
    }

    @GetMapping("/get/userInvitations/{userId}")
    public ResponseEntity<?> getUserInvitations(@PathVariable Long userId) {
        return trainingInvitationService.getUserInvitations(userId);
    }

    @PutMapping("/respond/{invitationId}")
    public ResponseEntity<?> respondInvitation(@PathVariable UUID invitationId, @RequestBody RespondInvitationDto respondInvitationDto) {
        return trainingInvitationService.respondInvitation(invitationId, respondInvitationDto);
    }

    @GetMapping("/get/teamInvitations/{managerId}")
    public ResponseEntity<?> getTeamInvitations(@PathVariable Long managerId) {
        return trainingInvitationService.getTeamInvitations(managerId);
    }

    @PutMapping("/respond-team-invitation/{invitationId}")
    public ResponseEntity<?> respondTeamUserInvitation(@PathVariable UUID invitationId, @RequestBody RespondInvitationDto respondInvitationDto) {
        return trainingInvitationService.respondTeamUserInvitation(invitationId, respondInvitationDto);
    }
}