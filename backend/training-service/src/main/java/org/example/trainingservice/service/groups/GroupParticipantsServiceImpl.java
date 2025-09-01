package org.example.trainingservice.service.groups;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.group.AddOrEditGroupParticipantsDto;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.exceptions.GroupeNotFoundException;
import org.example.trainingservice.exceptions.NeedNotFoundException;
import org.example.trainingservice.repository.GroupeRepository;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.service.completion.CompletionUtilMethods;
import org.example.trainingservice.service.plan.GroupeCompletionService;
import org.example.trainingservice.service.plan.TrainingInvitationService;
import org.example.trainingservice.utils.GroupUtilMethods;
import org.example.trainingservice.utils.TrainingGroupeUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GroupParticipantsServiceImpl implements GroupParticipantsService {
    private final GroupeRepository groupeRepository;
    private final NeedRepository needRepository;
    private final CompletionUtilMethods completionUtilMethods;
    private final GroupeCompletionService groupeCompletionService;
    private final TrainingInvitationService trainingInvitationService;

    public GroupParticipantsServiceImpl(GroupeRepository groupeRepository, NeedRepository needRepository, CompletionUtilMethods completionUtilMethods, GroupeCompletionService groupeCompletionService, TrainingInvitationService trainingInvitationService) {
        this.groupeRepository = groupeRepository;
        this.needRepository = needRepository;
        this.completionUtilMethods = completionUtilMethods;
        this.groupeCompletionService = groupeCompletionService;
        this.trainingInvitationService = trainingInvitationService;
    }

    @Override
    public ResponseEntity<?> addGroupParticipants(Long needId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto) {
        Need need = needRepository.findById(needId).orElseThrow(() -> new NeedNotFoundException("Need not found with ID : " + needId, null));
        Groupe groupe = Groupe.builder()
                .need(need)
                .name("Groupe " + ((need.getNumberOfGroup()) + 1))
                .targetAudience(addOrEditGroupParticipantsDto.getTargetAudience())
                .managerCount(addOrEditGroupParticipantsDto.getManagerCount())
                .employeeCount(addOrEditGroupParticipantsDto.getEmployeeCount())
                .workerCount(addOrEditGroupParticipantsDto.getWorkerCount())
                .temporaryWorkerCount(addOrEditGroupParticipantsDto.getTemporaryWorkerCount())
                .userGroupIds(addOrEditGroupParticipantsDto.getUserGroupIds())
                .participantCount(TrainingGroupeUtilMethods.calculateTotalParticipants(addOrEditGroupParticipantsDto))
                .build();

        // Vérification si le groupe est complet
        groupe = groupeCompletionService.updateCompletionStatus(groupe);

        Groupe save = groupeRepository.save(groupe);

        need.setNumberOfGroup(need.getNumberOfGroup() + 1);
        needRepository.save(need);

        // Vérifier la complétion du besoin
        completionUtilMethods.checkAndUpdateNeedCompletion(save);

        return ResponseEntity.ok().body(GroupUtilMethods.convertToGroupToAddOrEditDto(save));
    }

    @Override
    public ResponseEntity<?> editGroupParticipants(Long groupId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto) {
        Groupe groupe = groupeRepository.findById(groupId).orElseThrow(() -> new GroupeNotFoundException("Groupe not found with ID : " + groupId, null));
        groupe.setTargetAudience(addOrEditGroupParticipantsDto.getTargetAudience());
        groupe.setManagerCount(addOrEditGroupParticipantsDto.getManagerCount());
        groupe.setEmployeeCount(addOrEditGroupParticipantsDto.getEmployeeCount());
        groupe.setWorkerCount(addOrEditGroupParticipantsDto.getWorkerCount());
        groupe.setTemporaryWorkerCount(addOrEditGroupParticipantsDto.getTemporaryWorkerCount());
        groupe.setUserGroupIds(addOrEditGroupParticipantsDto.getUserGroupIds());
        groupe.setParticipantCount(TrainingGroupeUtilMethods.calculateTotalParticipants(addOrEditGroupParticipantsDto));

        // Vérification si le groupe est complet
        groupe = groupeCompletionService.updateCompletionStatus(groupe);

        Groupe save = groupeRepository.save(groupe);

        // Vérifier la complétion du besoin
        completionUtilMethods.checkAndUpdateNeedCompletion(save);

        return ResponseEntity.ok().body(GroupUtilMethods.convertToGroupToAddOrEditDto(save));
    }
}