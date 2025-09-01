package org.example.trainingservice.service.groups;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.group.AddOrEditGroupInternalProviderDto;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.enums.TrainingType;
import org.example.trainingservice.exceptions.GroupeNotFoundException;
import org.example.trainingservice.exceptions.NeedNotFoundException;
import org.example.trainingservice.repository.GroupeRepository;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.service.completion.CompletionUtilMethods;
import org.example.trainingservice.service.plan.GroupeCompletionService;
import org.example.trainingservice.utils.GroupUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GroupInternalProviderServiceImpl implements GroupInternalProviderService {
    private final GroupeRepository groupeRepository;
    private final NeedRepository needRepository;
    private final GroupeCompletionService groupeCompletionService;
    private final CompletionUtilMethods completionUtilMethods;

    public GroupInternalProviderServiceImpl(GroupeRepository groupeRepository, NeedRepository needRepository, GroupeCompletionService groupeCompletionService, CompletionUtilMethods completionUtilMethods) {
        this.groupeRepository = groupeRepository;
        this.needRepository = needRepository;
        this.groupeCompletionService = groupeCompletionService;
        this.completionUtilMethods = completionUtilMethods;
    }

    @Override
    public ResponseEntity<?> addGroupInternalProvider(Long needId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto) {
        log.info("addGroupInternalProvider {}", addOrEditGroupInternalProviderDto);
        Need need = needRepository.findById(needId).orElseThrow(() -> new NeedNotFoundException("Need not found with ID : " + needId, null));
        Groupe groupe = Groupe.builder()
                .need(need)
                .name("Groupe " + ((need.getNumberOfGroup()) + 1))
                .internalTrainerId(addOrEditGroupInternalProviderDto.getTrainer().getId())
                .trainerName(addOrEditGroupInternalProviderDto.getTrainer().getName())
                .comment(addOrEditGroupInternalProviderDto.getComment())
                .trainingType(TrainingType.INTERNAL)
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
    public ResponseEntity<?> editGroupInternalProvider(Long groupId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto) {
        // Implementation pour la modification d'un groupe avec un fournisseur interne
        log.info("editGroupInternalProvider {}", addOrEditGroupInternalProviderDto);
        Groupe groupe = groupeRepository.findById(groupId).orElseThrow(() -> new GroupeNotFoundException("Groupe not found with ID : " + groupId, null));
        groupe.setInternalTrainerId(addOrEditGroupInternalProviderDto.getTrainer().getId());
        groupe.setComment(addOrEditGroupInternalProviderDto.getComment());
        groupe.setTrainerName(addOrEditGroupInternalProviderDto.getTrainer().getName());
        groupe.setTrainingType(TrainingType.INTERNAL);

        // Vérification si le groupe est complet
        groupe = groupeCompletionService.updateCompletionStatus(groupe);
        Groupe save = groupeRepository.save(groupe);

        // Vérifier la complétion du besoin
        completionUtilMethods.checkAndUpdateNeedCompletion(save);

        return ResponseEntity.ok().body(GroupUtilMethods.convertToGroupToAddOrEditDto(save));
    }
}