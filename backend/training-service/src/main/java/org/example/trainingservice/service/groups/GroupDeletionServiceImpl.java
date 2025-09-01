package org.example.trainingservice.service.groups;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.exceptions.GroupeNotFoundException;
import org.example.trainingservice.repository.GroupeRepository;
import org.example.trainingservice.repository.NeedRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GroupDeletionServiceImpl implements GroupDeletionService {
    private final GroupeRepository groupeRepository;
    private final NeedRepository needRepository;

    public GroupDeletionServiceImpl(GroupeRepository groupeRepository, NeedRepository needRepository) {
        this.groupeRepository = groupeRepository;
        this.needRepository = needRepository;
    }

    @Override
    public ResponseEntity<?> deleteGroup(Long groupId) {
        Groupe groupe = groupeRepository.findById(groupId).orElseThrow(() -> new GroupeNotFoundException("Groupe non trouvé avec l'ID : " + groupId, null));
        Need needAssociated = groupe.getNeed();
        if (needAssociated != null) {
            needAssociated.getGroupes().remove(groupe);
            needAssociated.setNumberOfGroup(needAssociated.getNumberOfGroup() - 1);
            needRepository.save(needAssociated);
        }

        groupeRepository.delete(groupe);
        return ResponseEntity.ok().build();
    }
}