package org.example.authservice.service;

import jakarta.transaction.Transactional;
import org.example.authservice.dto.groups.GroupeRequest;
import org.example.authservice.dto.GroupeUserCountProjection;
import org.example.authservice.entity.Groupe;
import org.example.authservice.exceptions.GroupeAlreadyExistsException;
import org.example.authservice.exceptions.GroupeNotEmptyException;
import org.example.authservice.exceptions.GroupeNotFoundException;
import org.example.authservice.repository.GroupeRepository;
import org.example.authservice.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupeServiceImpl implements GroupeService {
    private final GroupeRepository groupeRepository;
    private final AccessRightService accessRightService; // Nouveau service injecté

    public GroupeServiceImpl(GroupeRepository groupeRepository, AccessRightService accessRightService) {
        this.groupeRepository = groupeRepository;
        this.accessRightService = accessRightService;
    }

    public ResponseEntity<?> addGroupe(GroupeRequest request) {
        // Récupérer le companyId
        Long companyId = SecurityUtils.getCurrentCompanyId();

        // Vérifier si un groupe avec le même nom existe déjà
        if (groupeRepository.findByNameAndCompanyId(request.getName(), companyId).isPresent()) {
            throw new GroupeAlreadyExistsException("Un groupe avec le même nom existe déjà.");
        }

        // Créer un nouveau groupe si le nom est unique
        Groupe groupe = Groupe.builder()
                .companyId(companyId)
                .name(request.getName())
                .description(request.getName())
                .build();

        Groupe savedGroupe = groupeRepository.save(groupe);

        // Créer les droits d'accès par défaut pour ce nouveau groupe
        accessRightService.createDefaultAccessRights(savedGroupe);

        return ResponseEntity.ok(savedGroupe);
    }

    @Override
    public ResponseEntity<?> update(Long id, GroupeRequest request) {
        Groupe byName = groupeRepository.findByName(request.getName());
        if (byName != null && !byName.getId().equals(id)) { // Éviter le conflit avec lui-même
            throw new GroupeAlreadyExistsException("Un groupe avec le même nom existe.");
        }

        Groupe groupe = groupeRepository.findById(id)
                .orElseThrow(() -> new GroupeNotFoundException("Groupe n'existe pas"));
        groupe.setName(request.getName());
        groupe.setDescription(request.getName());

        return ResponseEntity.ok(groupeRepository.save(groupe));
    }

    @Override
    public ResponseEntity<?> getAllGroupes() {
        // Récupérer le companyId
        Long companyId = SecurityUtils.getCurrentCompanyId();

        // Récupérer les groupes avec leurs droits d'accès
        List<Groupe> groupes = groupeRepository.findAllWithAccessRightsByCompanyId(companyId);

        // Récupérer le nombre d'utilisateurs par groupe
        Map<Long, Long> userCountByGroupId = groupeRepository.countUsersByGroupeId(companyId)
                .stream()
                .collect(Collectors.toMap(
                        GroupeUserCountProjection::getGroupeId,
                        GroupeUserCountProjection::getUserCount
                ));

        // Construire les DTOs adaptés au format du frontend
        List<Map<String, Object>> result = groupes.stream()
                .map(groupe -> {
                    Map<String, Object> groupeMap = new HashMap<>();
                    groupeMap.put("name", groupe.getName());
                    groupeMap.put("id", groupe.getId());
                    groupeMap.put("description", groupe.getDescription());
                    groupeMap.put("userCount", String.valueOf(userCountByGroupId.getOrDefault(groupe.getId(), 0L)));

                    // Ajouter les droits d'accès si nécessaire
                    // groupeMap.put("accessRights", groupe.getAccessRights());

                    return groupeMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    public ResponseEntity<?> deleteGroupe(Long id) {
        Groupe groupe = groupeRepository.findById(id)
                .orElseThrow(() -> new GroupeNotFoundException("Groupe non trouvé"));

        if (!groupe.getUsers().isEmpty()) {
            throw new GroupeNotEmptyException("Groupe non vide");
        }

        // Supprimer les droits d'accès associés avant de supprimer le groupe
        accessRightService.deleteGroupAccessRights(id);

        groupeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}