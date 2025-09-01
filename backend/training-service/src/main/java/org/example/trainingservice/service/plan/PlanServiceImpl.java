package org.example.trainingservice.service.plan;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.plan.*;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.entity.Trainer;
import org.example.trainingservice.entity.TrainerForTrainingGroupe;
import org.example.trainingservice.entity.plan.Plan;
import org.example.trainingservice.entity.plan.Training;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.enums.NeedStatusEnums;
import org.example.trainingservice.enums.PlanStatusEnum;
import org.example.trainingservice.enums.TrainingStatusEnum;
import org.example.trainingservice.exceptions.PlanNotFoundException;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.repository.TrainerForTrainingGroupeRepository;
import org.example.trainingservice.repository.TrainerRepository;
import org.example.trainingservice.repository.plan.PlanRepository;
import org.example.trainingservice.repository.plan.TrainingRepository;
import org.example.trainingservice.utils.PlanUtilMethods;
import org.example.trainingservice.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PlanServiceImpl implements PlanService {
    private final PlanRepository planRepository;
    private final NeedRepository needRepository;
    private final TrainingRepository trainingRepository;
    private final TrainerForTrainingGroupeRepository trainerForTrainingGroupeRepository;
    private final TrainerRepository trainerRepository;
    private final TrainingInvitationService trainingInvitationService;


    public PlanServiceImpl(
            PlanRepository planRepository,
            NeedRepository needRepository,
            TrainingRepository trainingRepository,
            TrainerForTrainingGroupeRepository trainerForTrainingGroupeRepository,
            TrainerRepository trainerRepository, TrainingInvitationService trainingInvitationService
    ) {
        this.planRepository = planRepository;
        this.needRepository = needRepository;
        this.trainingRepository = trainingRepository;
        this.trainerForTrainingGroupeRepository = trainerForTrainingGroupeRepository;
        this.trainerRepository = trainerRepository;
        this.trainingInvitationService = trainingInvitationService;
    }

    /**
     * Récupère tous les plans associés à l'entreprise courante.
     *
     * @return ResponseEntity contenant la liste des PlanDto ou un code d'erreur approprié
     * - 200 OK avec la liste des plans (peut être vide)
     * - 400 Bad Request si l'ID de l'entreprise courante est invalide
     * - 500 Internal Server Error en cas d'erreur technique
     * @throws SecurityException si l'utilisateur n'a pas les droits d'accès
     * @since 1.0
     */
    @Override
    public ResponseEntity<List<PlanDto>> getAllPlan() {
        try {
            // Récupération de l'ID de l'entreprise de l'utilisateur connecté
            Long companyId = SecurityUtils.getCurrentCompanyId();
            if (companyId == null) {
                log.warn("Tentative d'accès aux plans sans ID d'entreprise valide");
                return ResponseEntity.badRequest().build();
            }

            // Récupération des plans depuis la base de données
            List<Plan> companyPlans = planRepository.findAllByCompanyId(companyId);

            // Conversion des entités Plan en DTOs pour l'API
            List<PlanDto> planDtos = companyPlans.stream().map(PlanUtilMethods::mapToPlanDto).collect(Collectors.toList());

            log.debug("Récupération réussie de {} plan(s) pour l'entreprise {}", planDtos.size(), companyId);

            return ResponseEntity.ok(planDtos);

        } catch (Exception e) {
            log.error("Erreur lors de la récupération des plans pour l'entreprise: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<PlanPagedResponse<PlanDto>> getAllPlanPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection,
            @RequestParam(required = false) String search) {

        try {
            // Récupération de l'ID de l'entreprise de l'utilisateur connecté
            Long companyId = SecurityUtils.getCurrentCompanyId();
            if (companyId == null) {
                log.warn("Tentative d'accès aux plans sans ID d'entreprise valide");
                return ResponseEntity.badRequest().build();
            }

            // Configuration de la pagination et du tri
            Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC")
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            // Récupération des plans avec pagination
            Page<Plan> planPage;

            if (search != null && !search.trim().isEmpty()) {
                // Recherche avec pagination
                planPage = planRepository.findAllByCompanyIdAndTitleContainingIgnoreCase(
                        companyId,
                        search,
                        pageable
                );
            } else {
                // Tous les plans avec pagination
                planPage = planRepository.findAllByCompanyId(companyId, pageable);
            }

            // Conversion des entités en DTOs
            List<PlanDto> planDtos = planPage.getContent()
                    .stream()
                    .map(PlanUtilMethods::mapToPlanDto)
                    .collect(Collectors.toList());

            // Création de la réponse paginée
            PlanPagedResponse<PlanDto> response = new PlanPagedResponse<>(
                    planDtos,
                    planPage.getNumber(),
                    planPage.getSize(),
                    planPage.getTotalElements(),
                    planPage.getTotalPages(),
                    planPage.isLast(),
                    planPage.isFirst()
            );

            log.debug("Récupération réussie de {} plan(s) sur {} pour l'entreprise {}",
                    planDtos.size(),
                    planPage.getTotalElements(),
                    companyId
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erreur lors de la récupération des plans pour l'entreprise: {}",
                    e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<?> addPlan(AddPlanDto addPlanDto) {
        log.info("Adding new plan");
        if (addPlanDto == null) {
            log.warn("PlanDto null");
            return ResponseEntity.badRequest().build();
        }

        // Correction : comparaison avec "true" au lieu de "Oui"
        boolean isCSFPlan = addPlanDto.getCsf() != null && addPlanDto.getCsf().equals("true");

        Plan plan = Plan.builder()
                .companyId(SecurityUtils.getCurrentCompanyId())
                .title(addPlanDto.getTitle())
                .startDate(addPlanDto.getStartDate())
                .endDate(addPlanDto.getEndDate())
                .year(LocalDate.now().getYear())
                .estimatedBudget(addPlanDto.getEstimatedBudget())
                .status(PlanStatusEnum.NOT_PLANNED)
                .isCSFPlan(isCSFPlan)
                .isOFPPTValidation(false)
                .build();

        planRepository.save(plan);
        log.info("Finished adding new plan");
        return ResponseEntity.ok().build();
    }

    @Override
    @Transactional
    public ResponseEntity<?> addThemeToPlan(AddThemeToPlanDto addThemeToPlanDto) {
        log.info("Transforming needs to training and adding to plan");

        if (addThemeToPlanDto == null || addThemeToPlanDto.getSelectedNeedIds().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Vérifier que le titre du plan est fourni
        if (addThemeToPlanDto.getPlanId() == null) {
            log.error("Plan title is required");
            return ResponseEntity.badRequest().body("Plan title is required");
        }

        // Récupérer le plan par son titre
        Optional<Plan> planOptional = planRepository.findById(addThemeToPlanDto.getPlanId());
        if (planOptional.isEmpty()) {
            log.error("Plan not found with title: {}", addThemeToPlanDto.getPlanId());
            return ResponseEntity.notFound().build();
        }
        Plan plan = planOptional.get();

        List<Need> needsToAdd = needRepository.findAllById(addThemeToPlanDto.getSelectedNeedIds());

        if (needsToAdd.isEmpty() || needsToAdd.size() != addThemeToPlanDto.getSelectedNeedIds().size()) {
            return ResponseEntity.noContent().build();
        }

        try {
            // D'abord, sauvegarder tous les trainers uniques
            Set<TrainerForTrainingGroupe> trainersToSave = new HashSet<>();
            for (Need need : needsToAdd) {
                for (Groupe groupe : need.getGroupes()) {
                    if (groupe.getTrainer() != null) {
                        TrainerForTrainingGroupe trainerForTrainingGroupe = convertTrainer(groupe.getTrainer());
                        if (trainerForTrainingGroupe != null) {
                            trainersToSave.add(trainerForTrainingGroupe);
                        }
                    }
                }
            }

            // Sauvegarder les trainers et créer une map pour les réutiliser
            Map<String, TrainerForTrainingGroupe> savedTrainersMap = new HashMap<>();
            for (TrainerForTrainingGroupe trainer : trainersToSave) {
                // Vérifier si le trainer existe déjà en base
                TrainerForTrainingGroupe existingTrainer = trainerForTrainingGroupeRepository
                        .findByNameAndEmail(trainer.getName(), trainer.getEmail())
                        .orElse(null);

                if (existingTrainer != null) {
                    savedTrainersMap.put(trainer.getName() + "_" + trainer.getEmail(), existingTrainer);
                } else {
                    TrainerForTrainingGroupe savedTrainer = trainerForTrainingGroupeRepository.save(trainer);
                    savedTrainersMap.put(trainer.getName() + "_" + trainer.getEmail(), savedTrainer);
                }
            }

            // Ensuite, convertir les needs en trainings en utilisant les trainers sauvegardés
            List<Training> trainings = needsToAdd.stream()
                    .map(need -> convertNeedToTraining(need, plan, savedTrainersMap))
                    .collect(Collectors.toList());

            // Sauvegarder les trainings (ils seront automatiquement associés au plan)
            List<Training> savedTrainings = trainingRepository.saveAll(trainings);

            // NOUVEAU : Création des invitations pour tous les groupes de formation
            createInvitationsForTrainings(savedTrainings);

            // Supprimer les needs
            needRepository.deleteAll(needsToAdd);

            log.info("Successfully created {} trainings and added them to plan '{}'", trainings.size(), plan.getTitle());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error creating training(s) or deleting needs: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Convertit un Need en Training et l'associe au Plan fourni
     */
    private Training convertNeedToTraining(Need need, Plan plan, Map<String, TrainerForTrainingGroupe> savedTrainersMap) {
        Training training = Training.builder()
                .companyId(need.getCompanyId())
                .strategicAxeId(need.getStrategicAxeId())
                .strategicAxeName(need.getStrategicAxeName())
                .siteIds(need.getSiteIds())
                .siteNames(need.getSiteNames())
                .departmentIds(need.getDepartmentIds())
                .departmentNames(need.getDepartmentNames())
                .domainId(need.getDomainId())
                .domainName(need.getDomainName())
                .qualificationId(need.getQualificationId())
                .qualificationName(need.getQualificationName())
                .theme(need.getTheme())
                .numberOfDay(need.getNumberOfDay())
                .type(need.getType())
                .numberOfGroup(need.getNumberOfGroup())
                .objective(need.getObjective())
                .content(need.getContent())
                .csf(need.getCsf())
                .csfPlanifie(need.getCsfPlanifie())
                .creationDate(need.getCreationDate())
                .source(need.getSource())
                .status(TrainingStatusEnum.NOT_PLANNED)
                .year(need.getYear())
                .wishDate(need.getWishDate())
                .requesterId(need.getRequesterId())
                .requesterName(need.getRequesterName())
                .approverId(need.getApproverId())
                .learningMode(need.getLearningMode())
                .questionnaire(need.getQuestionnaire())
                .plan(plan)  // Association avec le Plan
                .isAllFieldsFilled(need.getIsAllFieldsFilled())
                .build();

        List<TrainingGroupe> trainingGroupes = need.getGroupes().stream()
                .map(groupe -> convertGroupeToTrainingGroupe(groupe, training, savedTrainersMap))
                .collect(Collectors.toList());

        training.setGroupes(trainingGroupes); // Associer les TrainingGroupes au Training

        return training;
    }

    /**
     * Convertit un Groupe en TrainingGroupe
     */
    private TrainingGroupe convertGroupeToTrainingGroupe(Groupe groupe, Training training,
                                                         Map<String, TrainerForTrainingGroupe> savedTrainersMap) {

        // Récupérer le trainer sauvegardé de la map
        TrainerForTrainingGroupe savedTrainer = null;
        if (groupe.getTrainer() != null) {
            String key = groupe.getTrainer().getName() + "_" + groupe.getTrainer().getEmail();
            savedTrainer = savedTrainersMap.get(key);
        }

        return TrainingGroupe.builder()
                .training(training)
                .ocf(groupe.getOcf())
                .companyId(groupe.getCompanyId())
                .name(groupe.getName())
                .startDate(groupe.getStartDate())
                .endDate(groupe.getEndDate())
                .participantCount(groupe.getParticipantCount())
                .dayCount(groupe.getDayCount())
                .price(groupe.getPrice())
                .trainingType(groupe.getTrainingType())
                .trainingProvider(groupe.getTrainingProvider())
                .internalTrainerId(groupe.getInternalTrainerId())
                .trainerName(groupe.getTrainerName())
                .siteIds(groupe.getSiteIds())
                .departmentIds(groupe.getDepartmentIds())
                .location(groupe.getLocation())
                .city(groupe.getCity())
                .dates(groupe.getDates())
                .morningStartTime(groupe.getMorningStartTime())
                .morningEndTime(groupe.getMorningEndTime())
                .afternoonStartTime(groupe.getAfternoonStartTime())
                .afternoonEndTime(groupe.getAfternoonEndTime())
                .userGroupIds(groupe.getUserGroupIds())
                .targetAudience(groupe.getTargetAudience())
                .managerCount(groupe.getManagerCount())
                .employeeCount(groupe.getEmployeeCount())
                .workerCount(groupe.getWorkerCount())
                .temporaryWorkerCount(groupe.getTemporaryWorkerCount())
                .comment(groupe.getComment())
                .status(
                        "APPROVED".equals(groupe.getStatus().name())
                                ? GroupeStatusEnums.PLANNED
                                : groupe.getStatus()
                )
                .trainer(savedTrainer)  // Utiliser le trainer sauvegardé
                .isAllFieldsFilled(groupe.getIsAllFieldsFilled())
                .build();
    }

    private TrainerForTrainingGroupe convertTrainer(Trainer trainer) {
        if (trainer == null) return null;

        return TrainerForTrainingGroupe.builder()
                .name(trainer.getName())
                .email(trainer.getEmail())
                .build();
    }

    private void createInvitationsForTrainings(List<Training> trainings) {
        log.info("Creating invitations for {} trainings", trainings.size());

        int totalInvitationsCreated = 0;

        for (Training training : trainings) {
            for (TrainingGroupe groupe : training.getGroupes()) {
                try {
                    // Vérifier si le groupe a des participants définis
                    if (groupe.getUserGroupIds() != null && !groupe.getUserGroupIds().isEmpty()) {
                        log.debug("Creating invitations for training group: {} with {} user groups",
                                groupe.getName(), groupe.getUserGroupIds().size());

                        // Appel du service d'invitation existant
                        trainingInvitationService.createTrainingInvitation(groupe, groupe.getUserGroupIds());
                        totalInvitationsCreated++;

                        log.debug("Invitations created successfully for training group: {}", groupe.getName());
                    } else {
                        log.debug("No user groups defined for training group: {}, skipping invitation creation",
                                groupe.getName());
                    }
                } catch (Exception e) {
                    log.error("Error creating invitations for training group {} (Training: {}): {}",
                            groupe.getName(), training.getTheme(), e.getMessage(), e);
                    // Continue avec les autres groupes même en cas d'erreur
                }
            }
        }

        log.info("Invitations creation completed. {} training groups processed", totalInvitationsCreated);
    }

    // 4. MÉTHODE UTILITAIRE : Validation des groupes pour les invitations
    private boolean isGroupReadyForInvitations(TrainingGroupe groupe) {
        return groupe.getUserGroupIds() != null &&
                !groupe.getUserGroupIds().isEmpty() &&
                groupe.getName() != null &&
                groupe.getTraining() != null &&
                groupe.getTraining().getTheme() != null;
    }

    @Override
    public ResponseEntity<?> updateStatus(UpdatePlanStatusRequestDto updateStatusRequestDto) {
        log.info("Updating status of plan.");
        Plan plan = planRepository.findById(updateStatusRequestDto.getId()).orElseThrow(() -> new PlanNotFoundException("Plan not found", null));
        plan.setStatus(PlanStatusEnum.valueOf(updateStatusRequestDto.getStatus()));
        log.info("Successfully updated status of plan.");
        return ResponseEntity.ok(planRepository.save(plan));
    }

    /*
     *
     * */

    /**
     * Retire un training d'un plan et le convertit en need
     *
     * @param trainingId L'identifiant du training à retirer
     * @return ResponseEntity avec le résultat de l'opération
     */
    @Transactional
    @Override
    public ResponseEntity<?> removeTrainingFromPlan(UUID trainingId) {
        log.info("Removing training from plan and converting back to need. TrainingId: {}", trainingId);

        // Validation des entrées
        if (trainingId == null) {
            log.warn("Training ID is null");
            return ResponseEntity.badRequest().body("Training ID is required");
        }

        try {
            // Récupération du training
            Training training = findTrainingById(trainingId);

            // Validation métier
            validateTrainingForRemoval(training);

            // Conversion et sauvegarde
            Need convertedNeed = convertAndSaveTrainingToNeed(training);

            // Suppression du training
            deleteTraining(training);

            log.info("Successfully converted training '{}' (ID: {}) back to need (ID: {})",
                    training.getTheme(), trainingId, convertedNeed.getId());

            return ResponseEntity.ok().build();

        } catch (TrainingNotFoundException e) {
            log.warn("Training not found with ID: {}", trainingId);
            return ResponseEntity.notFound().build();
        } catch (InvalidTrainingStateException e) {
            log.warn("Invalid training state for removal: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while removing training from plan. TrainingId: {}", trainingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing the request");
        }
    }

    /**
     * Récupère un training par son ID
     *
     * @param trainingId L'identifiant du training
     * @return Le training trouvé
     * @throws TrainingNotFoundException si le training n'existe pas
     */
    private Training findTrainingById(UUID trainingId) {
        return trainingRepository.findById(trainingId)
                .orElseThrow(() -> new TrainingNotFoundException("Training not found with ID: " + trainingId));
    }

    /**
     * Valide qu'un training peut être retiré du plan
     *
     * @param training Le training à valider
     * @throws InvalidTrainingStateException si le training ne peut pas être retiré
     */
    private void validateTrainingForRemoval(Training training) {
        if (training.getPlan() == null) {
            throw new InvalidTrainingStateException("Training is not associated with any plan");
        }

        // Ajouter d'autres validations métier si nécessaire
        // Par exemple : vérifier le statut, les dates, etc.
    }

    /**
     * Convertit un training en need et le sauvegarde
     *
     * @param training Le training à convertir
     * @return Le need créé
     */
    private Need convertAndSaveTrainingToNeed(Training training) {
        // Gestion des trainers
        Map<String, Trainer> savedTrainersMap = processTrainers(training);

        // Conversion et sauvegarde
        Need need = convertTrainingToNeed(training, savedTrainersMap);
        return needRepository.save(need);
    }

    /**
     * Traite et sauvegarde les trainers nécessaires
     *
     * @param training Le training source
     * @return Map des trainers sauvegardés indexés par clé unique
     */
    private Map<String, Trainer> processTrainers(Training training) {
        Set<TrainerForTrainingGroupe> uniqueTrainers = extractUniqueTrainers(training);
        return saveAndMapTrainers(uniqueTrainers);
    }

    /**
     * Extrait les trainers uniques d'un training
     *
     * @param training Le training source
     * @return Set des trainers uniques
     */
    private Set<TrainerForTrainingGroupe> extractUniqueTrainers(Training training) {
        return training.getGroupes().stream()
                .map(TrainingGroupe::getTrainer)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    /**
     * Sauvegarde les trainers et crée une map pour réutilisation
     *
     * @param trainersToProcess Set des trainers à traiter
     * @return Map des trainers sauvegardés
     */
    private Map<String, Trainer> saveAndMapTrainers(Set<TrainerForTrainingGroupe> trainersToProcess) {
        Map<String, Trainer> savedTrainersMap = new HashMap<>();

        for (TrainerForTrainingGroupe trainerForTrainingGroupe : trainersToProcess) {
            Trainer trainer = convertTrainerForTrainingGroupe(trainerForTrainingGroupe);
            if (trainer != null) {
                String key = createTrainerKey(trainer.getName(), trainer.getEmail());
                Trainer savedTrainer = findOrCreateTrainer(trainer);
                savedTrainersMap.put(key, savedTrainer);
            }
        }

        return savedTrainersMap;
    }

    /**
     * Trouve un trainer existant ou en crée un nouveau
     *
     * @param trainer Le trainer à rechercher/créer
     * @return Le trainer sauvegardé
     */
    private Trainer findOrCreateTrainer(Trainer trainer) {
        return trainerRepository.findByNameAndEmail(trainer.getName(), trainer.getEmail())
                .orElseGet(() -> trainerRepository.save(trainer));
    }

    /**
     * Crée une clé unique pour un trainer
     *
     * @param name  Nom du trainer
     * @param email Email du trainer
     * @return Clé unique
     */
    private String createTrainerKey(String name, String email) {
        return name + "_" + email;
    }

    /**
     * Convertit un Training en Need
     *
     * @param training         Le training à convertir
     * @param savedTrainersMap Map des trainers sauvegardés
     * @return Le need créé
     */
    private Need convertTrainingToNeed(Training training, Map<String, Trainer> savedTrainersMap) {
        Need need = Need.builder()
                .companyId(training.getCompanyId())
                .strategicAxeId(training.getStrategicAxeId())
                .strategicAxeName(training.getStrategicAxeName())
                .siteIds(training.getSiteIds())
                .siteNames(training.getSiteNames())
                .departmentIds(training.getDepartmentIds())
                .departmentNames(training.getDepartmentNames())
                .domainId(training.getDomainId())
                .domainName(training.getDomainName())
                .qualificationId(training.getQualificationId())
                .qualificationName(training.getQualificationName())
                .theme(training.getTheme())
                .numberOfDay(training.getNumberOfDay())
                .type(training.getType())
                .numberOfGroup(training.getNumberOfGroup())
                .objective(training.getObjective())
                .content(training.getContent())
                .csf(training.getCsf())
                .csfPlanifie(training.getCsfPlanifie())
                .creationDate(training.getCreationDate())
                .source(training.getSource())
                .status(determineNeedStatus(training))
                .year(training.getYear())
                .wishDate(training.getWishDate())
                .requesterId(training.getRequesterId())
                .requesterName(training.getRequesterName())
                .approverId(training.getApproverId())
                .learningMode(training.getLearningMode())
                .questionnaire(training.getQuestionnaire())
                .isAllFieldsFilled(training.getIsAllFieldsFilled())
                .build();

        List<Groupe> groupes = convertTrainingGroupes(training.getGroupes(), need, savedTrainersMap);
        need.setGroupes(groupes);

        return need;
    }

    /**
     * Détermine le statut approprié pour le need basé sur le training
     *
     * @param training Le training source
     * @return Le statut du need
     */
    private NeedStatusEnums determineNeedStatus(Training training) {
        // Logique métier pour déterminer le statut approprié
        return switch (training.getStatus()) {
            case NOT_PLANNED -> NeedStatusEnums.APPROVED;
            case PLANNED -> NeedStatusEnums.APPROVED;
            case IN_PROGRESS -> NeedStatusEnums.APPROVED;
            default -> NeedStatusEnums.APPROVED;
        };
    }

    /**
     * Convertit une liste de TrainingGroupe en Groupe
     *
     * @param trainingGroupes  Liste des training groupes
     * @param need             Le need parent
     * @param savedTrainersMap Map des trainers sauvegardés
     * @return Liste des groupes convertis
     */
    private List<Groupe> convertTrainingGroupes(List<TrainingGroupe> trainingGroupes, Need need,
                                                Map<String, Trainer> savedTrainersMap) {
        return trainingGroupes.stream()
                .map(trainingGroupe -> convertTrainingGroupeToGroupe(trainingGroupe, need, savedTrainersMap))
                .collect(Collectors.toList());
    }

    /**
     * Convertit un TrainingGroupe en Groupe
     *
     * @param trainingGroupe   Le training groupe à convertir
     * @param need             Le need parent
     * @param savedTrainersMap Map des trainers sauvegardés
     * @return Le groupe converti
     */
    private Groupe convertTrainingGroupeToGroupe(TrainingGroupe trainingGroupe, Need need,
                                                 Map<String, Trainer> savedTrainersMap) {
        Trainer savedTrainer = findSavedTrainer(trainingGroupe.getTrainer(), savedTrainersMap);

        return Groupe.builder()
                .need(need)
                .ocf(trainingGroupe.getOcf())
                .companyId(trainingGroupe.getCompanyId())
                .name(trainingGroupe.getName())
                .startDate(trainingGroupe.getStartDate())
                .endDate(trainingGroupe.getEndDate())
                .participantCount(trainingGroupe.getParticipantCount())
                .dayCount(trainingGroupe.getDayCount())
                .price(trainingGroupe.getPrice())
                .trainingType(trainingGroupe.getTrainingType())
                .trainingProvider(trainingGroupe.getTrainingProvider())
                .trainingId(trainingGroupe.getId())
                .internalTrainerId(trainingGroupe.getInternalTrainerId())
                .trainerName(trainingGroupe.getTrainerName())
                .siteIds(trainingGroupe.getSiteIds())
                .departmentIds(trainingGroupe.getDepartmentIds())
                .location(trainingGroupe.getLocation())
                .city(trainingGroupe.getCity())
                .dates(trainingGroupe.getDates())
                .morningStartTime(trainingGroupe.getMorningStartTime())
                .morningEndTime(trainingGroupe.getMorningEndTime())
                .afternoonStartTime(trainingGroupe.getAfternoonStartTime())
                .afternoonEndTime(trainingGroupe.getAfternoonEndTime())
                .userGroupIds(trainingGroupe.getUserGroupIds())
                .targetAudience(trainingGroupe.getTargetAudience())
                .managerCount(trainingGroupe.getManagerCount())
                .employeeCount(trainingGroupe.getEmployeeCount())
                .workerCount(trainingGroupe.getWorkerCount())
                .temporaryWorkerCount(trainingGroupe.getTemporaryWorkerCount())
                .comment(trainingGroupe.getComment())
                .status(trainingGroupe.getStatus())
                .trainer(savedTrainer)
                .isAllFieldsFilled(trainingGroupe.getIsAllFieldsFilled())
                .build();
    }

    /**
     * Trouve le trainer sauvegardé correspondant
     *
     * @param trainerForTrainingGroupe Le trainer source
     * @param savedTrainersMap         Map des trainers sauvegardés
     * @return Le trainer sauvegardé ou null
     */
    private Trainer findSavedTrainer(TrainerForTrainingGroupe trainerForTrainingGroupe,
                                     Map<String, Trainer> savedTrainersMap) {
        if (trainerForTrainingGroupe == null) {
            return null;
        }

        String key = createTrainerKey(trainerForTrainingGroupe.getName(), trainerForTrainingGroupe.getEmail());
        return savedTrainersMap.get(key);
    }

    /**
     * Convertit un TrainerForTrainingGroupe en Trainer
     *
     * @param trainerForTrainingGroupe Le trainer à convertir
     * @return Le trainer converti ou null
     */
    private Trainer convertTrainerForTrainingGroupe(TrainerForTrainingGroupe trainerForTrainingGroupe) {
        if (trainerForTrainingGroupe == null) {
            return null;
        }

        return Trainer.builder()
                .name(trainerForTrainingGroupe.getName())
                .email(trainerForTrainingGroupe.getEmail())
                .build();
    }

    /**
     * Supprime un training
     *
     * @param training Le training à supprimer
     */
    private void deleteTraining(Training training) {
        trainingRepository.delete(training);
    }

    // Exceptions personnalisées
    public static class TrainingNotFoundException extends RuntimeException {
        public TrainingNotFoundException(String message) {
            super(message);
        }
    }

    public static class InvalidTrainingStateException extends RuntimeException {
        public InvalidTrainingStateException(String message) {
            super(message);
        }
    }

}