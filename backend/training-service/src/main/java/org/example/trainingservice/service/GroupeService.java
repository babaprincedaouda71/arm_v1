package org.example.trainingservice.service;

import org.example.trainingservice.dto.group.AddOrEditGroupExternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupInternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupParticipantsDto;
import org.example.trainingservice.dto.group.AddOrEditGroupPlanningDto;
import org.springframework.http.ResponseEntity;

public interface GroupeService {
    ResponseEntity<?> duplicateGroup(Long id);

    ResponseEntity<?> addGroupPlanning(Long needId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto);

    ResponseEntity<?> addGroupParticipants(Long needId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto);

    ResponseEntity<?> addGroupInternalProvider(Long needId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto);

    ResponseEntity<?> addGroupExternalProvider(Long needId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto);

    ResponseEntity<?> editGroupPlanning(Long groupId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto);

    ResponseEntity<?> editGroupParticipants(Long groupId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto);

    ResponseEntity<?> editGroupInternalProvider(Long groupId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto);

    ResponseEntity<?> editGroupExternalProvider(Long groupId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto);

    ResponseEntity<?> getGroupToAddOrEdit(Long groupId);

    ResponseEntity<?> deleteGroup(Long groupId);

    ResponseEntity<?> getParticipants(Long groupId);

    ResponseEntity<?> removeGroupeParticipant(Long groupeId, Long participantId);
}