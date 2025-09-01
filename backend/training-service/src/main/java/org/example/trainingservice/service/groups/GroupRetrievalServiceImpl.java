package org.example.trainingservice.service.groups;

import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.exceptions.GroupeNotFoundException;
import org.example.trainingservice.repository.GroupeRepository;
import org.example.trainingservice.utils.GroupUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class GroupRetrievalServiceImpl implements GroupRetrievalService {
    private final GroupeRepository groupeRepository;

    public GroupRetrievalServiceImpl(GroupeRepository groupeRepository) {
        this.groupeRepository = groupeRepository;
    }

    @Override
    public ResponseEntity<?> getGroupToAddOrEdit(Long groupId) {
        Groupe found = groupeRepository.findById(groupId)
                .orElseThrow(() -> new GroupeNotFoundException("Groupe non trouvé avec l'ID : " + groupId, null));
        return ResponseEntity.ok().body(GroupUtilMethods.convertToGroupToAddOrEditDto(found));
    }
}