package org.example.trainingservice.service.groups;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.group.AddOrEditGroupExternalProviderDto;
import org.example.trainingservice.dto.ocf.OCFAddOrEditGroupDto;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.entity.OCF;
import org.example.trainingservice.entity.Trainer;
import org.example.trainingservice.enums.TrainingType;
import org.example.trainingservice.exceptions.GroupeNotFoundException;
import org.example.trainingservice.exceptions.NeedNotFoundException;
import org.example.trainingservice.repository.GroupeRepository;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.repository.OCFRepository;
import org.example.trainingservice.repository.TrainerRepository;
import org.example.trainingservice.service.completion.CompletionUtilMethods;
import org.example.trainingservice.service.plan.GroupeCompletionService;
import org.example.trainingservice.utils.GroupUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class GroupExternalProviderServiceImpl implements GroupExternalProviderService {
    private final GroupeRepository groupeRepository;
    private final NeedRepository needRepository;
    private final TrainerRepository trainerRepository;
    private final OCFRepository ocfRepository;
    private final GroupeCompletionService groupeCompletionService;
    private final CompletionUtilMethods completionUtilMethods;

    public GroupExternalProviderServiceImpl(GroupeRepository groupeRepository, NeedRepository needRepository, TrainerRepository trainerRepository, OCFRepository ocfRepository, GroupeCompletionService groupeCompletionService, CompletionUtilMethods completionUtilMethods) {
        this.groupeRepository = groupeRepository;
        this.needRepository = needRepository;
        this.trainerRepository = trainerRepository;
        this.ocfRepository = ocfRepository;
        this.groupeCompletionService = groupeCompletionService;
        this.completionUtilMethods = completionUtilMethods;
    }

    @Override
    public ResponseEntity<?> addGroupExternalProvider(Long needId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto) {
        log.info("addGroupExternalProvider - needId: {}, dto: {}", needId, addOrEditGroupExternalProviderDto);

        Need need = needRepository.findById(needId)
                .orElseThrow(() -> new NeedNotFoundException("Besoin non trouvé avec l'ID : " + needId, null));

        Groupe groupe = new Groupe();
        groupe.setName("Groupe " + ((need.getNumberOfGroup()) + 1));
        groupe.setNeed(need);
        groupe.setCompanyId(need.getCompanyId());
        groupe.setTrainingType(TrainingType.EXTERNAL);

        if (addOrEditGroupExternalProviderDto.getOcf() != null) {
            OCFAddOrEditGroupDto ocfDto = addOrEditGroupExternalProviderDto.getOcf();
            OCF ocf = ocfRepository.findById(ocfDto.getId()).orElse(null);
            if (ocf != null) {
                groupe.setOcf(ocf);
                log.info("OCF existant associé au groupe : {}", ocf);
            } else if (ocfDto.getCorporateName() != null && !ocfDto.getCorporateName().isEmpty()) {
                OCF newOcf = new OCF();
                newOcf.setCorporateName(ocfDto.getCorporateName());
                newOcf.setEmailMainContact(ocfDto.getEmailMainContact() != null && !ocfDto.getEmailMainContact().isEmpty() ? ocfDto.getEmailMainContact() : null);
                ocfRepository.save(newOcf);
                groupe.setOcf(newOcf);
                log.info("Nouvel OCF créé et associé au groupe : {}", newOcf);
            } else {
                log.warn("Aucun OCF existant trouvé avec l'ID {} et le nom de l'entreprise OCF n'est pas fourni.", ocfDto.getId());
            }
        } else {
            log.info("Aucune information OCF fournie dans le DTO.");
        }

        if (addOrEditGroupExternalProviderDto.getExternalTrainerName() != null && !addOrEditGroupExternalProviderDto.getExternalTrainerName().isEmpty()) {
            Trainer existingTrainer = trainerRepository.findByNameAndEmail(
                    addOrEditGroupExternalProviderDto.getExternalTrainerName(),
                    addOrEditGroupExternalProviderDto.getExternalTrainerEmail()
            ).orElse(null);

            if (existingTrainer != null) {
                groupe.setTrainer(existingTrainer);
                groupe.setTrainerName(existingTrainer.getName());
                log.info("Formateur externe existant associé au groupe : {}", existingTrainer);
            } else {
                Trainer newTrainer = new Trainer();
                newTrainer.setName(addOrEditGroupExternalProviderDto.getExternalTrainerName());
                newTrainer.setEmail(addOrEditGroupExternalProviderDto.getExternalTrainerEmail());
                trainerRepository.save(newTrainer);
                groupe.setTrainer(newTrainer);
                groupe.setTrainerName(newTrainer.getName());
                log.info("Nouveau formateur externe créé et associé au groupe : {}", newTrainer);
            }
        } else {
            log.info("Aucune information sur le formateur externe fournie dans le DTO.");
        }

        groupe.setPrice(addOrEditGroupExternalProviderDto.getCost());

        // Vérification si le groupe est complet
        groupe = groupeCompletionService.updateCompletionStatus(groupe);

        Groupe savedGroupe = groupeRepository.save(groupe);
        log.info("Groupe externe ajouté avec succès : {}", savedGroupe);

        // Mise à jour du numberOfGroup dans l'entité Need
        need.setNumberOfGroup(need.getNumberOfGroup() + 1);
        needRepository.save(need);

        // Vérifier la complétion du besoin
        completionUtilMethods.checkAndUpdateNeedCompletion(savedGroupe);

        return ResponseEntity.ok().body(GroupUtilMethods.convertToGroupToAddOrEditDto(savedGroupe));
    }

    @Override
    public ResponseEntity<?> editGroupExternalProvider(Long groupId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto) {
        // Implementation pour la modification d'un groupe avec un fournisseur externe
        log.info("Starting updating group external provider : {}", addOrEditGroupExternalProviderDto);
        Groupe groupe = groupeRepository.findById(groupId).orElseThrow(() -> new GroupeNotFoundException("Groupe not found with ID : " + groupId, null));
        log.info("Getting OCF");
        OCFAddOrEditGroupDto ocfDto = addOrEditGroupExternalProviderDto.getOcf();
        OCF ocf = ocfRepository.findById(ocfDto.getId()).orElse(null);
        if (ocf != null) {
            groupe.setOcf(ocf);
            groupe.setPrice(addOrEditGroupExternalProviderDto.getCost());
            log.info("OCF existant associé au groupe : {}", ocf);
        } else if (ocfDto.getCorporateName() != null && !ocfDto.getCorporateName().isEmpty()) {
            OCF newOcf = new OCF();
            newOcf.setCorporateName(ocfDto.getCorporateName());
            newOcf.setEmailMainContact(ocfDto.getEmailMainContact() != null && !ocfDto.getEmailMainContact().isEmpty() ? ocfDto.getEmailMainContact() : null);
            ocfRepository.save(newOcf);
            groupe.setOcf(newOcf);
            log.info("Nouvel OCF créé et associé au groupe : {}", newOcf);
        } else {
            log.warn("Aucun OCF existant trouvé avec l'ID {} et le nom de l'entreprise OCF n'est pas fourni.", ocfDto.getId());
        }

        if (addOrEditGroupExternalProviderDto.getExternalTrainerName() != null && !addOrEditGroupExternalProviderDto.getExternalTrainerName().isEmpty()) {
            Trainer existingTrainer = trainerRepository.findByNameAndEmail(
                    addOrEditGroupExternalProviderDto.getExternalTrainerName(),
                    addOrEditGroupExternalProviderDto.getExternalTrainerEmail()
            ).orElse(null);

            if (existingTrainer != null) {
                groupe.setTrainer(existingTrainer);
                groupe.setTrainerName(existingTrainer.getName());
                log.info("Formateur externe existant associé au groupe : {}", existingTrainer);
            } else {
                Trainer newTrainer = new Trainer();
                newTrainer.setName(addOrEditGroupExternalProviderDto.getExternalTrainerName());
                newTrainer.setEmail(addOrEditGroupExternalProviderDto.getExternalTrainerEmail());
                newTrainer.setGroupesAnimated(List.of(groupe));
                trainerRepository.save(newTrainer);
                groupe.setTrainer(newTrainer);
                groupe.setTrainerName(newTrainer.getName());
                log.info("Nouveau formateur externe créé et associé au groupe : {}", newTrainer);
            }
        } else {
            log.info("Aucune information sur le formateur externe fournie dans le DTO.");
        }

        groupe.setPrice(addOrEditGroupExternalProviderDto.getCost());
        groupe.setTrainingType(TrainingType.EXTERNAL);

        // Vérification si le groupe est complet
        groupe = groupeCompletionService.updateCompletionStatus(groupe);

        Groupe savedGroupe = groupeRepository.save(groupe);
        log.info("****** Groupe externe ajouté avec succès ******");

        // Vérifier la complétion du besoin
        completionUtilMethods.checkAndUpdateNeedCompletion(savedGroupe);

        return ResponseEntity.ok().body(GroupUtilMethods.convertToGroupToAddOrEditDto(savedGroupe));
    }
}