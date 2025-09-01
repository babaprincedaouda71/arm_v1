package org.example.trainingservice.service.plan;

import org.example.trainingservice.dto.group.AddOrEditGroupExternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupInternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupParticipantsDto;
import org.example.trainingservice.dto.group.AddOrEditGroupPlanningDto;
import org.example.trainingservice.dto.plan.SendInvitationDto;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface TrainingGroupeService {
    ResponseEntity<?> getTrainingGroupToAddOrEdit(Long groupId);

    ResponseEntity<?> addGroupPlanning(UUID trainingId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto);

    ResponseEntity<?> editGroupPlanning(Long groupId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto);

    ResponseEntity<?> addGroupParticipants(UUID trainingId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto);

    ResponseEntity<?> editGroupParticipants(Long groupId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto);

    ResponseEntity<?> addGroupInternalProvider(UUID trainingId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto);

    ResponseEntity<?> editGroupInternalProvider(Long groupId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto);

    ResponseEntity<?> addGroupExternalProvider(UUID trainingId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto);

    ResponseEntity<?> editGroupExternalProvider(Long groupId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto);

    // 5. Méthode utilitaire pour obtenir un rapport détaillé (optionnel)
    ResponseEntity<?> getGroupCompletionStatus(Long groupId);

    ResponseEntity<?> sendInvitations(Long groupId, SendInvitationDto sendInvitationDto);

    ResponseEntity<?> getParticipantsForTrainingInvitation(Long groupId);

    ResponseEntity<?> getParticipantsForList(Long groupId);

    ResponseEntity<?> getGroupDetailsForSendInvitationToTrainer(Long groupId);

    ResponseEntity<?> getGroupDates(Long groupId);

    ResponseEntity<?> getUserPlanning(Long userId);

    ResponseEntity<?> getUserTrainingHistory(Long userId);
}