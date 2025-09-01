package org.example.trainingservice.service.groups;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.exceptions.GroupeNotFoundException;
import org.example.trainingservice.repository.GroupeRepository;
import org.example.trainingservice.repository.NeedRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class GroupCreationServiceImpl implements GroupCreationService {
    private final GroupeRepository groupeRepository;
    private final NeedRepository needRepository;

    public GroupCreationServiceImpl(GroupeRepository groupeRepository, NeedRepository needRepository) {
        this.groupeRepository = groupeRepository;
        this.needRepository = needRepository;
    }

    @Override
    public ResponseEntity<?> duplicateGroup(Long id) {
        // 1. Récupérer le groupe original à partir de la base de données en utilisant son ID.
        Groupe found = groupeRepository.findById(id)
                .orElseThrow(() -> new GroupeNotFoundException("Groupe non trouvé avec l'ID : " + id, null));

        // 2. Créer une nouvelle instance de l'entité Groupe pour la copie.
        Groupe duplicatedGroup = new Groupe();

        // 3. Copier manuellement chaque attribut de l'objet 'found' vers 'duplicatedGroup'.
        //    Notez que l'attribut 'id' est intentionnellement omis car il sera généré automatiquement
        //    lors de la sauvegarde de la nouvelle entité.
        duplicatedGroup.setNeed(found.getNeed());
        duplicatedGroup.setCompanyId(found.getCompanyId());

        // 4. Modifier l'attribut 'name' pour le nouveau groupe. Nous utilisons l'ID de l'ancien groupe
        //    pour générer un nouveau nom unique.
        duplicatedGroup.setName("Groupe " + (found.getNeed().getNumberOfGroup() + 1));

        duplicatedGroup.setStartDate(found.getStartDate());
        duplicatedGroup.setEndDate(found.getEndDate());
        duplicatedGroup.setParticipantCount(found.getParticipantCount());
        duplicatedGroup.setDayCount(found.getDayCount());
        duplicatedGroup.setPrice(found.getPrice());
        duplicatedGroup.setTrainingType(found.getTrainingType());
        duplicatedGroup.setTrainingProvider(found.getTrainingProvider());
        duplicatedGroup.setTrainingId(found.getTrainingId());
        duplicatedGroup.setTrainerName(found.getTrainerName());
        duplicatedGroup.setStatus(found.getStatus());
        duplicatedGroup.setOcf(found.getOcf());
        duplicatedGroup.setInternalTrainerId(found.getInternalTrainerId());
        duplicatedGroup.setSiteIds(found.getSiteIds());
        duplicatedGroup.setDepartmentIds(found.getDepartmentIds());
        duplicatedGroup.setLocation(found.getLocation());
        duplicatedGroup.setCity(found.getCity());
        duplicatedGroup.setDates(found.getDates());
        duplicatedGroup.setMorningStartTime(found.getMorningStartTime());
        duplicatedGroup.setMorningEndTime(found.getMorningEndTime());
        duplicatedGroup.setAfternoonStartTime(found.getAfternoonStartTime());
        duplicatedGroup.setAfternoonEndTime(found.getAfternoonEndTime());
        duplicatedGroup.setUserGroupIds(found.getUserGroupIds());
        duplicatedGroup.setTargetAudience(found.getTargetAudience());
        duplicatedGroup.setManagerCount(found.getManagerCount());
        duplicatedGroup.setEmployeeCount(found.getEmployeeCount());
        duplicatedGroup.setWorkerCount(found.getWorkerCount());
        duplicatedGroup.setTemporaryWorkerCount(found.getTemporaryWorkerCount());
        duplicatedGroup.setComment(found.getComment());
        duplicatedGroup.setTrainer(found.getTrainer());
        duplicatedGroup.setIsAllFieldsFilled(found.getIsAllFieldsFilled());

        // 5. Sauvegarder la nouvelle entité 'duplicatedGroup' dans la base de données.
        groupeRepository.save(duplicatedGroup);

        // 6. Mettre à jour le nombre de groupes associés au besoin original.
        Need need = found.getNeed();
        need.setNumberOfGroup(need.getNumberOfGroup() + 1);
        needRepository.save(need);

        // 7. Retourner une réponse HTTP indiquant que l'opération a réussi.
        return ResponseEntity.ok().build();
    }
}