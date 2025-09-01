package org.example.trainingservice.service.needs;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.cacheService.SiteCacheService;
import org.example.trainingservice.cacheService.UserCacheService;
import org.example.trainingservice.dto.need.*;
import org.example.trainingservice.dto.trainingRequest.IndividualRequestNeedViewDto;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.enums.NeedSource;
import org.example.trainingservice.enums.NeedStatusEnums;
import org.example.trainingservice.exceptions.NeedCannotBeDeletedException;
import org.example.trainingservice.exceptions.NeedNotFoundException;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.utils.NeedUtilMethods;
import org.example.trainingservice.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
public class NeedServiceImpl implements NeedService {
    private final NeedRepository needRepository;
    private final SiteCacheService siteCacheService;
    private final UserCacheService userCacheService;

    public NeedServiceImpl(NeedRepository needRepository, SiteCacheService siteCacheService, UserCacheService userCacheService) {
        this.needRepository = needRepository;
        this.siteCacheService = siteCacheService;
        this.userCacheService = userCacheService;
    }

    @Override
    public ResponseEntity<?> getAllNeeds() {
        log.info("Fetching all strategic axes needs.");
        Long companyId = SecurityUtils.getCurrentCompanyId();
        try {
            List<Need> allNeeds = needRepository.findAllByCompanyId(companyId);

            if (allNeeds.isEmpty()) {
                log.info("No strategic axes needs found.");
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            List<StrategicAxeNeedViewDto> needViewDtos = allNeeds.stream()
                    .map(NeedUtilMethods::convertToStrategicAxeNeedViewDto)
                    .collect(Collectors.toList());

            log.info("Successfully fetched {} strategic axes needs.", needViewDtos.size());
            return new ResponseEntity<>(needViewDtos, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error occurred while fetching all strategic axes needs: {}", e.getMessage(), e);
            return new ResponseEntity<>("Une erreur est survenue lors de la récupération des besoins.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> getAllValidatedNeedToAddToPlan() {
        log.info("Fetching all validated needs to add to plan.");
        Long companyId = SecurityUtils.getCurrentCompanyId();
        try {
            List<Need> allValidatedNeeds = needRepository.findAllByCompanyIdAndStatus(companyId, NeedStatusEnums.APPROVED);
            if (allValidatedNeeds.isEmpty()) {
                log.info("No validated needs found.");
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            List<NeedToAddToPlanDto> needToAddToPlanDtos = allValidatedNeeds.stream()
                    .map(NeedUtilMethods::convertToNeedToAddToPlanDto)
                    .toList();
            return new ResponseEntity<>(needToAddToPlanDtos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Une erreur est survenue", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional // Indique que cette méthode doit être exécutée dans une transaction
    public ResponseEntity<?> addStrategicAxesNeed(AddStrategicAxeNeedDto addStrategicAxeNeedDto) {
        log.info("Received request to add strategic axes need: {}", addStrategicAxeNeedDto);

        Long companyId = SecurityUtils.getCurrentCompanyId();

        try {
            // Vérification que l'axe stratégique est présent
            if (addStrategicAxeNeedDto.getAxe() == null || addStrategicAxeNeedDto.getAxe().getId() == null) {
                log.warn("Strategic axe is required.");
                return new ResponseEntity<>("L'axe stratégique est obligatoire.", HttpStatus.BAD_REQUEST);
            }

            // Vérification que le thème est présent et non vide
            if (addStrategicAxeNeedDto.getTheme() == null || addStrategicAxeNeedDto.getTheme().trim().isEmpty()) {
                log.warn("Theme is required.");
                return new ResponseEntity<>("Le thème est obligatoire.", HttpStatus.BAD_REQUEST);
            }

            // Mapping du DTO vers l'entité Need
            Need needToSave = NeedUtilMethods.convertToAddStrategicNeedDtoToEntity(addStrategicAxeNeedDto, companyId);

            // Initialisation des groupes si numberOfGroup est supérieur à zéro
            if (addStrategicAxeNeedDto.getNbrGroup() > 0) {
                List<Groupe> groupes = new ArrayList<>();
                for (int i = 1; i <= addStrategicAxeNeedDto.getNbrGroup(); i++) {
                    Groupe groupe = Groupe.builder()
                            .need(needToSave) // Association du groupe au besoin
                            .companyId(companyId) // Récupération de l'ID de l'entreprise
                            .name("Groupe " + i)
                            .status(GroupeStatusEnums.DRAFT)
                            .build();
                    groupes.add(groupe);
                }
                needToSave.setGroupes(groupes); // Ajout de la liste des groupes au besoin
            }

            // Sauvegarde de l'entité dans la base de données
            Need savedNeed = needRepository.save(needToSave);

            log.info("Successfully added strategic need with ID: {}", savedNeed.getId());
            return new ResponseEntity<>(savedNeed, HttpStatus.CREATED); // Retourne l'entité créée avec un statut 201
        } catch (Exception e) {
            log.error("Error occurred while adding strategic need: {}", e.getMessage(), e);
            return new ResponseEntity<>("Une erreur est survenue lors de l'enregistrement du besoin.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllStrategicAxesNeed() {
        log.info("Fetching all strategic axes needs.");
        Long companyId = SecurityUtils.getCurrentCompanyId();
        log.info("Company ID: {}", companyId);
        try {
            List<Need> allNeeds = needRepository.findAllByCompanyIdAndSource(companyId, NeedSource.Strategic_Axes);

            List<StrategicAxeNeedViewDto> needViewDtos = allNeeds.stream()
                    .map(need -> {
                        List<String> siteNames = siteCacheService.getSiteNamesForNeed(need);
                        StrategicAxeNeedViewDto dto = NeedUtilMethods.convertToStrategicAxeNeedViewDto(need);
                        dto.setSite(siteNames != null && !siteNames.isEmpty() ? String.join(",\n", siteNames) : null);
                        return dto;
                    })
                    .collect(Collectors.toList());

            log.info("Successfully fetched {} strategic axes needs.", needViewDtos.size());
            return new ResponseEntity<>(needViewDtos, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error occurred while fetching all strategic axes needs: {}", e.getMessage(), e);
            return new ResponseEntity<>("Une erreur est survenue lors de la récupération des besoins.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> updateStatus(UpdateStatusRequestDto updateStatusRequestDto) {
        log.info("Updating status of strategic axes need.");

        try {
            Need found = needRepository.findByIdAndCompanyId(
                    updateStatusRequestDto.getId(),
                    SecurityUtils.getCurrentCompanyId()
            ).orElseThrow(() -> new NeedNotFoundException("Need not found", null));

            found.setStatus(NeedStatusEnums.fromDescription(updateStatusRequestDto.getStatus()));

            log.info("Successfully updated status of strategic axes need.");
            return ResponseEntity.ok(needRepository.save(found));

        } catch (IllegalArgumentException e) {
            // Gestion des erreurs de conversion de statut
            log.error("Invalid status provided: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Need found = needRepository.findByIdAndCompanyId(id, SecurityUtils.getCurrentCompanyId()).orElseThrow(() -> new NeedNotFoundException("Need not found", null));
        String status = found.getStatus().toString();
        if (Objects.equals(status, "Validé")) {
            throw new NeedCannotBeDeletedException("Veuillez d'abord changer le statut du besoin", null);
        }
        needRepository.delete(found);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> getNeedById(Long id) {
        log.info("Fetching  need by ID: {}", id);
        Need need = needRepository.findByIdAndCompanyId(id, SecurityUtils.getCurrentCompanyId())
                .orElseThrow(() -> new NeedNotFoundException("Besoin non trouvé avec l'ID : " + id, null));

        GetNeedToEditDto getNeedToEditDto = NeedUtilMethods.convertToGetNeedToEditDto(need);

        log.info("Successfully fetched need with ID: {}", id);
        return new ResponseEntity<>(getNeedToEditDto, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getNeedForAddGroup(Long id) {
        log.info("Fetching strategic axes need for add group by ID: {}", id);
        Need need = needRepository.findByIdAndCompanyId(id, SecurityUtils.getCurrentCompanyId())
                .orElseThrow(() -> new NeedNotFoundException("Besoin non trouvé avec l'ID : " + id, null));

        NeedForAddGroupDto needForAddGroupDto = NeedUtilMethods.convertToNeedForAddGroupDto(need);

        log.info("Successfully fetched strategic axes need for add group with ID: {}", id);
        return new ResponseEntity<>(needForAddGroupDto, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getDetailsById(Long id) {
        log.info("Fetching strategic axes need details by ID: {}", id);
        Need need = needRepository.findByIdAndCompanyId(id, SecurityUtils.getCurrentCompanyId())
                .orElseThrow(() -> new NeedNotFoundException("Besoin non trouvé avec l'ID : " + id, null));

        StrategicAxeNeedDetailsDto getStrategicAxeNeedDetailsDto = NeedUtilMethods.convertToStrategicAxeNeedDetailsDto(need);

        log.info("Successfully fetched strategic axes need details with ID: {}", id);
        return new ResponseEntity<>(getStrategicAxeNeedDetailsDto, HttpStatus.OK);
    }

    @Override
    @Transactional
    public ResponseEntity<?> editNeed(Long id, EditNeedDto editNeedDto) {
        log.info("Editing need with ID: {} and data: {}", id, editNeedDto);

        Long companyId = SecurityUtils.getCurrentCompanyId();

        Need existingNeed = needRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new NeedNotFoundException("Besoin non trouvé avec l'ID : " + id, null));

        // Récupérer le nombre de groupes associés au besoin existant
        int existingGroupCount = existingNeed.getGroupes() != null ? existingNeed.getGroupes().size() : 0;
        int requestedGroupCount = editNeedDto.getNbrGroup();

        // Créer de nouveaux groupes si le nombre demandé est supérieur au nombre actuel
        if (requestedGroupCount > existingGroupCount) {
            int numberOfGroupsToCreate = requestedGroupCount - existingGroupCount;
            List<Groupe> newGroups = new ArrayList<>();
            for (int i = 1; i <= numberOfGroupsToCreate; i++) {
                Groupe groupe = Groupe.builder()
                        .need(existingNeed) // Association du groupe au besoin existant
                        .companyId(companyId)
                        .name("Groupe " + (existingGroupCount + i)) // Nommer les nouveaux groupes en conséquence
                        .status(GroupeStatusEnums.DRAFT)
                        .build();
                newGroups.add(groupe);
            }
            // Ajouter les nouveaux groupes à la liste existante (si elle existe) ou en créer une nouvelle
            if (existingNeed.getGroupes() == null) {
                existingNeed.setGroupes(newGroups);
            } else {
                existingNeed.getGroupes().addAll(newGroups);
            }
        }

        NeedUtilMethods.updateNeedFromEditNeedDto(existingNeed, editNeedDto);

        Need updatedNeed = needRepository.save(existingNeed);

        log.info("Successfully updated need with ID: {}", updatedNeed.getId());
        return new ResponseEntity<>(updatedNeed, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getAllIndividualRequestNeeds() {
        log.info("Fetching all individual request needs.");
        try {
            List<Need> allNeeds = needRepository.findAllByCompanyIdAndSource(SecurityUtils.getCurrentCompanyId(), NeedSource.Individual_Requests);

            List<IndividualRequestNeedViewDto> individualRequestNeedViewDtos = allNeeds.stream()
                    .map(need -> NeedUtilMethods.convertToIndividualRequestNeedViewDto(need, userCacheService))
                    .collect(Collectors.toList());

            log.info("Successfully fetched {} individual request needs.", individualRequestNeedViewDtos.size());

            return new ResponseEntity<>(individualRequestNeedViewDtos, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error occurred while fetching all individual request needs: {}", e.getMessage(), e);
            return new ResponseEntity<>("Une erreur est survenue lors de la récupération des besoins.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> getAllEvaluationNeed() {
        log.info("Fetching all evaluation needs.");
        try {
            List<Need> allNeeds = needRepository.findAllByCompanyIdAndSource(SecurityUtils.getCurrentCompanyId(), NeedSource.Evaluation);

            List<GetEvaluationNeedDto> getEvaluationNeedDtos = allNeeds.stream()
                    .map(need -> NeedUtilMethods.convertToEvaluationNeedDto(need, userCacheService))
                    .toList();

            log.info("Successfully fetched {} evaluation needs.", getEvaluationNeedDtos.size());

            return new ResponseEntity<>(getEvaluationNeedDtos, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error occurred while fetching all individual request needs: {}", e.getMessage(), e);
            return new ResponseEntity<>("Une erreur est survenue lors de la récupération des besoins.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}