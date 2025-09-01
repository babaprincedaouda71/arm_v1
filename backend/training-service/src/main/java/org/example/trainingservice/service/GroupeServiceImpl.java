package org.example.trainingservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.dto.evaluation.Participant;
import org.example.trainingservice.dto.group.AddOrEditGroupExternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupInternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupParticipantsDto;
import org.example.trainingservice.dto.group.AddOrEditGroupPlanningDto;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.exceptions.GroupeNotFoundException;
import org.example.trainingservice.repository.GroupeRepository;
import org.example.trainingservice.service.groups.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class GroupeServiceImpl implements GroupeService {
    private final GroupCreationService groupCreationService;
    private final GroupPlanningService groupPlanningService;
    private final GroupParticipantsService groupParticipantsService;
    private final GroupInternalProviderService groupInternalProviderService;
    private final GroupExternalProviderService groupExternalProviderService;
    private final GroupRetrievalService groupRetrievalService;
    private final GroupDeletionService groupDeletionService;
    private final GroupeRepository groupeRepository;
    private final AuthServiceClient authServiceClient;

    public GroupeServiceImpl(
            GroupCreationService groupCreationService,
            GroupPlanningService groupPlanningService,
            GroupParticipantsService groupParticipantsService,
            GroupInternalProviderService groupInternalProviderService,
            GroupExternalProviderService groupExternalProviderService,
            GroupRetrievalService groupRetrievalService, GroupDeletionService groupDeletionService, GroupeRepository groupeRepository, AuthServiceClient authServiceClient) {
        this.groupCreationService = groupCreationService;
        this.groupPlanningService = groupPlanningService;
        this.groupParticipantsService = groupParticipantsService;
        this.groupInternalProviderService = groupInternalProviderService;
        this.groupExternalProviderService = groupExternalProviderService;
        this.groupRetrievalService = groupRetrievalService;
        this.groupDeletionService = groupDeletionService;
        this.groupeRepository = groupeRepository;
        this.authServiceClient = authServiceClient;
    }

    @Override
    public ResponseEntity<?> duplicateGroup(Long id) {
        return groupCreationService.duplicateGroup(id);
    }

    @Override
    public ResponseEntity<?> addGroupPlanning(Long needId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto) {
        return groupPlanningService.addGroupPlanning(needId, addOrEditGroupPlanningDto);
    }

    @Override
    public ResponseEntity<?> addGroupParticipants(Long needId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto) {
        return groupParticipantsService.addGroupParticipants(needId, addOrEditGroupParticipantsDto);
    }

    @Override
    public ResponseEntity<?> addGroupInternalProvider(Long needId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto) {
        return groupInternalProviderService.addGroupInternalProvider(needId, addOrEditGroupInternalProviderDto);
    }

    @Override
    public ResponseEntity<?> addGroupExternalProvider(Long needId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto) {
        return groupExternalProviderService.addGroupExternalProvider(needId, addOrEditGroupExternalProviderDto);
    }

    @Override
    public ResponseEntity<?> editGroupPlanning(Long groupId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto) {
        return groupPlanningService.editGroupPlanning(groupId, addOrEditGroupPlanningDto);
    }

    @Override
    public ResponseEntity<?> editGroupParticipants(Long groupId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto) {
        return groupParticipantsService.editGroupParticipants(groupId, addOrEditGroupParticipantsDto);
    }

    @Override
    public ResponseEntity<?> editGroupInternalProvider(Long groupId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto) {
        return groupInternalProviderService.editGroupInternalProvider(groupId, addOrEditGroupInternalProviderDto);
    }

    @Override
    public ResponseEntity<?> editGroupExternalProvider(Long groupId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto) {
        return groupExternalProviderService.editGroupExternalProvider(groupId, addOrEditGroupExternalProviderDto);
    }

    @Override
    public ResponseEntity<?> getGroupToAddOrEdit(Long groupId) {
        return groupRetrievalService.getGroupToAddOrEdit(groupId);
    }

    @Override
    public ResponseEntity<?> deleteGroup(Long groupId) {
        return groupDeletionService.deleteGroup(groupId);
    }

    @Override
    public ResponseEntity<?> getParticipants(Long groupId) {
        log.info("getParticipants groupId : {}", groupId);
        Groupe groupe = groupeRepository.findById(groupId).orElseThrow(() -> new GroupeNotFoundException("Groupe non trouvé", null));
        Set<Long> userGroupIds = groupe.getUserGroupIds();
        List<Long> participantIds = new ArrayList<>(userGroupIds);
        if (participantIds.isEmpty()) {
            return ResponseEntity.ok().body(groupe.getParticipantCount());
        }
        List<Participant> participants = authServiceClient.getParticipants(participantIds);
        return ResponseEntity.ok().body(participants);
    }

    @Override
    public ResponseEntity<?> removeGroupeParticipant(Long groupId, Long participantId) {
        log.info("removeGroupeParticipant groupeId : {}, participantId : {}", groupId, participantId);
        Groupe groupe = groupeRepository.findById(groupId).orElseThrow(() -> new GroupeNotFoundException("Groupe non trouvé", null));

        Set<Long> userGroupIds = groupe.getUserGroupIds();
        if (userGroupIds == null || userGroupIds.isEmpty()) {
            return ResponseEntity.ok().body(groupe.getParticipantCount());
        }

        userGroupIds.remove(participantId);
        groupe.setUserGroupIds(userGroupIds);
        groupeRepository.save(groupe);
        return ResponseEntity.ok().body(groupe.getParticipantCount());
    }
}