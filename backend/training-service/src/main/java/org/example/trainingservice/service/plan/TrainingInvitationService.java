package org.example.trainingservice.service.plan;

import org.example.trainingservice.dto.plan.RespondInvitationDto;
import org.example.trainingservice.dto.plan.SendInvitationDto;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.springframework.http.ResponseEntity;

import java.util.Set;
import java.util.UUID;

public interface TrainingInvitationService {
    ResponseEntity<?> getInvitations(Long groupId);

    ResponseEntity<?> sendInvitations(Long groupId, SendInvitationDto sendInvitationDto);

    ResponseEntity<?> sendTrainerInvitation(Long groupId, SendInvitationDto sendInvitationDto);

    void createTrainingInvitation(TrainingGroupe trainingGroupe, Set<Long> userGroupIds);

    ResponseEntity<?> getUserInvitations(Long userId);

    ResponseEntity<?> respondInvitation(UUID invitationId, RespondInvitationDto respondInvitationDto);

    ResponseEntity<?> getTeamInvitations(Long managerId);

    ResponseEntity<?> respondTeamUserInvitation(UUID invitationId, RespondInvitationDto respondInvitationDto);
}