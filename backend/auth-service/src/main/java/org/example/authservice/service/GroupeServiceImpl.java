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

    public GroupeServiceImpl(GroupeRepository groupeRepository) {
        this.groupeRepository = groupeRepository;
    }

    public ResponseEntity<?> addGroupe(GroupeRequest request) {
        // Récuperer le companyId
        Long companyId = SecurityUtils.getCurrentCompanyId();

        // Vérifier si un groupe avec le même nom existe déjà
        Groupe existingGroupe = groupeRepository.findByNameAndCompanyId(request.getName(), companyId).orElseThrow(() -> new GroupeAlreadyExistsException("Un groupe avec le même nom existe déjà."));
//        if (existingGroupe != null) {
//            throw new GroupeAlreadyExistsException("Un groupe avec le même nom existe déjà.");
//        }

        // Créer un nouveau groupe si le nom est unique
        Groupe groupe = Groupe.builder()
                .companyId(companyId)
                .name(request.getName())
                .description(request.getName())  // Utilisez request.getDescription() au lieu de request.getName()
                .users(null)
                .build();
        Groupe savedGroupe = groupeRepository.save(groupe);
        return ResponseEntity.ok(savedGroupe);
    }

    @Override
    public ResponseEntity<?> update(Long id, GroupeRequest request) {
        Groupe byName = groupeRepository.findByName(request.getName());
        if (byName != null) {
            throw new GroupeAlreadyExistsException("Un groupe avec le même nom existe.");
        }
        Groupe groupe = groupeRepository.findById(id).orElseThrow(() -> new GroupeNotFoundException("Groupe n'existe pas"));
        groupe.setName(request.getName());
        return ResponseEntity.ok(groupeRepository.save(groupe));
    }

//    @Override
//    public ResponseEntity<?> getAllGroupes() {
//        // Récuperer le companyId
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (!(authentication instanceof CustomAuthenticationToken)) {
//            return ResponseEntity.badRequest().body("Invalid authentication token.");
//        }
//
//        Long companyId = extractCompanyId((CustomAuthenticationToken) authentication);
//
//        return ResponseEntity.ok(groupeRepository.findAllWithUserCountByCompanyId(companyId));
//    }

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

        groupeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}