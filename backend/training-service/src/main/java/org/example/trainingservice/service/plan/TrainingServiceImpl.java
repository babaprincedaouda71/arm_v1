package org.example.trainingservice.service.plan;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.example.trainingservice.client.notification.NotificationServiceClient;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.dto.PlanErrorResponse;
import org.example.trainingservice.dto.plan.*;
import org.example.trainingservice.entity.plan.Training;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.enums.TrainingStatusEnum;
import org.example.trainingservice.enums.TrainingType;
import org.example.trainingservice.exceptions.TrainingGroupeNotFoundException;
import org.example.trainingservice.exceptions.TrainingNotFoundException;
import org.example.trainingservice.exceptions.plan.NotificationException;
import org.example.trainingservice.exceptions.plan.ValidationException;
import org.example.trainingservice.model.plan.CancelTrainingEmailRequest;
import org.example.trainingservice.repository.plan.TrainingRepository;
import org.example.trainingservice.utils.SecurityUtils;
import org.example.trainingservice.utils.TrainingUtilMethods;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TrainingServiceImpl implements TrainingService {
    private final TrainingRepository trainingRepository;
    private final TrainingCompletionService trainingCompletionService;
    private final AuthServiceClient authServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    public TrainingServiceImpl(
            TrainingRepository trainingRepository,
            TrainingCompletionService trainingCompletionService,
            AuthServiceClient authServiceClient, AuthServiceClient authServiceClient1, NotificationServiceClient notificationServiceClient) {
        this.trainingRepository = trainingRepository;
        this.trainingCompletionService = trainingCompletionService;
        this.authServiceClient = authServiceClient1;
        this.notificationServiceClient = notificationServiceClient;
    }

    @Override
    public ResponseEntity<?> getAllTrainings(UUID planId) {
        log.info("Getting all trainings for plan: {}", planId);

        // Utilisation de la requête optimisée avec fetch join
        List<Training> trainings = trainingRepository.findByPlanIdWithGroupes(planId);

        log.info("Finished getting all trainings for plan: {}", trainings.size());

        List<GetAllTrainingDto> getAllTrainingDtos = trainings.stream()
                .map(TrainingUtilMethods::mapToGetAllTrainingsDto)
                .toList();

        log.info("Finished mapping {} trainings with group dates", getAllTrainingDtos.size());
        return ResponseEntity.ok(getAllTrainingDtos);
    }

    @Override
    public ResponseEntity<?> getTrainingDetails(UUID trainingId) {
        log.info("Getting training details for id: {}", trainingId);
        Training training = trainingRepository.findById(trainingId).orElseThrow(() -> new RuntimeException("Training not found with id: " + trainingId));

        TrainingDetailsDto getTrainingDetailsDto = TrainingUtilMethods.convertToTrainingDto(training);

        log.info("Finished getting training details for id: {}", trainingId);
        return new ResponseEntity<>(getTrainingDetailsDto, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getTrainingForAddGroup(UUID id) {
        Training training = trainingRepository.findById(id).orElseThrow(() -> new RuntimeException("Training not found with id: " + id));

        TrainingForAddGroupDto trainingForAddGroupDto = TrainingUtilMethods.convertToTrainingForAddGroupDto(training);
        return new ResponseEntity<>(trainingForAddGroupDto, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getTrainingToEditById(UUID id) {
        log.info("Fetching strategic axes need by ID: {}", id);
        Training training = trainingRepository.findByIdAndCompanyId(id, SecurityUtils.getCurrentCompanyId())
                .orElseThrow(() -> new TrainingNotFoundException("Formation non trouvée avec l'ID : " + id, null));

        GetTrainingToEditDto getTrainingToEditDto = TrainingUtilMethods.convertToGetTrainingToEditDto(training);

        log.info("Successfully fetched strategic axes need with ID: {}", id);
        return new ResponseEntity<>(getTrainingToEditDto, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> editTraining(UUID id, EditTrainingDto editTrainingDto) {
        log.info("Editing training with ID: {} and data: {}", id, editTrainingDto);

        Long companyId = SecurityUtils.getCurrentCompanyId();

        Training existingTraining = trainingRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new TrainingNotFoundException("Formation non trouvée avec l'ID : " + id, null));

        // Récupérer le nombre de groupes associés au besoin existant
        int existingGroupCount = existingTraining.getGroupes() != null ? existingTraining.getGroupes().size() : 0;
        int requestedGroupCount = editTrainingDto.getNbrGroup();

        // Créer de nouveaux groupes si le nombre demandé est supérieur au nombre actuel
        if (requestedGroupCount > existingGroupCount) {
            int numberOfGroupsToCreate = requestedGroupCount - existingGroupCount;
            List<TrainingGroupe> newGroups = new ArrayList<>();
            for (int i = 1; i <= numberOfGroupsToCreate; i++) {
                TrainingGroupe groupe = TrainingGroupe.builder()
                        .training(existingTraining) // Association du groupe au besoin existant
                        .companyId(companyId)
                        .name("Groupe " + (existingGroupCount + i)) // Nommer les nouveaux groupes en conséquence
                        .status(GroupeStatusEnums.DRAFT)
                        .build();
                newGroups.add(groupe);
            }
            // Ajouter les nouveaux groupes à la liste existante (si elle existe) ou en créer une nouvelle
            if (existingTraining.getGroupes() == null) {
                existingTraining.setGroupes(newGroups);
            } else {
                existingTraining.getGroupes().addAll(newGroups);
            }
        }

        TrainingUtilMethods.updateTrainingFromTrainingToEditDto(existingTraining, editTrainingDto);

        Training trainingWithUpdatedStatus = trainingCompletionService.updateCompletionStatus(existingTraining);

        Training updatedTraining = trainingRepository.save(trainingWithUpdatedStatus);


        log.info("Successfully updated strategic axes need with ID: {}", updatedTraining.getId());
        return new ResponseEntity<>(updatedTraining, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> trainingDetailForCancel(UUID id) {
        log.info("Getting training details for cancel id: {}", id);
        Training training = trainingRepository.findById(id).orElseThrow(() -> new RuntimeException("Training not found with id: " + id));

        TrainingDetailsForCancelDto getTrainingDetailsDto = TrainingUtilMethods.convertToTrainingDetailsForCancelDto(training);

        log.info("Finished getting training details cancel for id: {}", id);
        return new ResponseEntity<>(getTrainingDetailsDto, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> trainingDetailForInvitation(UUID trainingId, Long groupId) {
        log.info("Getting training details for invitation - trainingId: {}, groupId: {}", trainingId, groupId);

        try {
            // 1. Récupération de la formation avec vérification d'existence
            Training training = trainingRepository.findById(trainingId)
                    .orElseThrow(() -> new TrainingNotFoundException("Training not found with id: " + trainingId, null));

            // 2. Récupération du groupe spécifique
            TrainingGroupe targetGroup = training.getGroupes().stream()
                    .filter(groupe -> groupe.getId().equals(groupId))
                    .findFirst()
                    .orElseThrow(() -> new TrainingGroupeNotFoundException(
                            "Training group not found with id: " + groupId + " for training: " + trainingId, null));

            // 3. Détermination de la startDate à partir des dates du groupe
            String startDate = determineStartDate(targetGroup);

            // 4. Construction du DTO de réponse
            TrainingDetailsForInvitationDto trainingDetailsDto = TrainingDetailsForInvitationDto.builder()
                    .id(training.getId())
                    .theme(training.getTheme())
                    .csfPlanifie(training.getCsfPlanifie())
                    .startDate(startDate)
                    .location(targetGroup.getLocation())
                    .build();

            log.info("Successfully retrieved training details for invitation - trainingId: {}, groupId: {}",
                    trainingId, groupId);

            return ResponseEntity.ok(trainingDetailsDto);

        } catch (TrainingNotFoundException | TrainingGroupeNotFoundException e) {
            log.error("Entity not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error getting training details for invitation - trainingId: {}, groupId: {}: {}",
                    trainingId, groupId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving training details: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getParticipantsForTrainingCancellation(UUID id) {
        log.info("Getting participants for training cancellation, training id: {}", id);

        try {
            // 1. Récupération optimisée du training avec fetch join pour éviter N+1
            Training training = trainingRepository.findByIdWithGroupes(id)
                    .orElseThrow(() -> new TrainingNotFoundException("Training not found with id: " + id, null));

            // 2. Collecte efficace des IDs participants avec validation
            Set<Long> participantIds = training.getGroupes().stream()
                    .filter(Objects::nonNull) // Protection contre les groupes null
                    .map(TrainingGroupe::getUserGroupIds)
                    .filter(Objects::nonNull) // Protection contre les userGroupIds null
                    .flatMap(Set::stream) // Aplatir tous les sets d'IDs
                    .collect(Collectors.toSet());

            // 3. Vérification early return si aucun participant
            if (participantIds.isEmpty()) {
                log.info("No participants found for training id: {}", id);
                return ResponseEntity.ok(Collections.emptyList());
            }

            // 4. Traitement par batch pour les gros volumes
            List<ParticipantForCancel> allParticipants = new ArrayList<>();
            int batchSize = 1000; // Configurable selon vos besoins

            List<Long> participantIdsList = new ArrayList<>(participantIds);
            for (int i = 0; i < participantIdsList.size(); i += batchSize) {
                int endIndex = Math.min(i + batchSize, participantIdsList.size());
                Set<Long> batch = new HashSet<>(participantIdsList.subList(i, endIndex));

                try {
                    List<ParticipantForCancel> batchParticipants = authServiceClient.getParticipantsNames(batch);
                    if (batchParticipants != null) {
                        allParticipants.addAll(batchParticipants);
                    }
                } catch (Exception e) {
                    log.error("Error fetching participants batch {}-{} for training {}: {}",
                            i, endIndex, id, e.getMessage());
                    // Continuer avec les autres batches plutôt que de tout arrêter
                }
            }

            log.info("Successfully retrieved {} participants for training id: {}",
                    allParticipants.size(), id);

            return ResponseEntity.ok(allParticipants);

        } catch (TrainingNotFoundException e) {
            log.error("Training not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error getting participants for training {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving participants: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> cancelTraining(CancelTrainingDto cancelTrainingDto) {
        try {
            // Validation des données d'entrée
            validateCancelTrainingRequest(cancelTrainingDto);

            Long companyId = SecurityUtils.getCurrentCompanyId();
            UUID trainingId = cancelTrainingDto.getTrainingId();
            Set<Long> participantIds = cancelTrainingDto.getParticipantIds();

            // Récupération et mise à jour de la formation avec verrouillage optimiste
            Training training = getTrainingForCancellation(trainingId, companyId);

            // Construction des emails de notification en batch
            Set<String> notificationEmails = buildNotificationEmails(training, participantIds, cancelTrainingDto);

            // Mise à jour du statut de la formation
            updateTrainingStatus(training);

            // Envoi des notifications par batch
            sendCancellationNotifications(notificationEmails, cancelTrainingDto);

            log.info("Training cancelled successfully - ID: {}, Company: {}, Participants: {}",
                    trainingId, companyId, participantIds.size());

            return ResponseEntity.ok(CancelTrainingResponse.builder()
                    .trainingId(trainingId)
                    .status("CANCELLED")
                    .notifiedParticipants(notificationEmails.size())
                    .build());

        } catch (TrainingNotFoundException e) {
            log.error("Training not found for cancellation - ID: {}", cancelTrainingDto.getTrainingId(), e);
            return ResponseEntity.notFound().build();
        } catch (ValidationException e) {
            log.error("Invalid cancellation request: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(PlanErrorResponse.builder()
                    .message(e.getMessage())
                    .code("VALIDATION_ERROR")
                    .build());
        } catch (NotificationException e) {
            log.error("Failed to send cancellation notifications", e);
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .body(PlanErrorResponse.builder()
                            .message("Formation annulée mais échec d'envoi des notifications")
                            .code("NOTIFICATION_ERROR")
                            .build());
        } catch (Exception e) {
            log.error("Unexpected error during training cancellation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(PlanErrorResponse.builder()
                            .message("Erreur interne lors de l'annulation")
                            .code("INTERNAL_ERROR")
                            .build());
        }
    }

    /**
     * Détermine la date de début à partir de la liste des dates du groupe
     * Retourne la première date chronologique ou null si aucune date n'est disponible
     */
    private String determineStartDate(TrainingGroupe group) {
        return TrainingUtilMethods.getEarliestDate(group.getDates());
    }

    /**
     * Valide les données d'entrée pour l'annulation de formation
     */
    private void validateCancelTrainingRequest(CancelTrainingDto cancelTrainingDto) {
        if (cancelTrainingDto == null) {
            throw new ValidationException("Les données d'annulation sont requises");
        }

        if (cancelTrainingDto.getTrainingId() == null) {
            throw new ValidationException("L'ID de la formation est requis");
        }

        if (cancelTrainingDto.getParticipantIds() == null || cancelTrainingDto.getParticipantIds().isEmpty()) {
            throw new ValidationException("Au moins un participant doit être spécifié");
        }

        if (cancelTrainingDto.getParticipantIds().size() > MAX_PARTICIPANTS_PER_BATCH) {
            throw new ValidationException("Trop de participants pour une annulation en lot (max: " + MAX_PARTICIPANTS_PER_BATCH + ")");
        }

        if (StringUtils.isBlank(cancelTrainingDto.getContent())) {
            throw new ValidationException("Le message d'annulation est requis");
        }
    }

    /**
     * Récupère la formation avec verrouillage pour éviter les modifications concurrentes
     */
    private Training getTrainingForCancellation(UUID trainingId, Long companyId) {
        return trainingRepository.findByIdAndCompanyId(trainingId, companyId)
                .filter(training -> !TrainingStatusEnum.CANCELLED.equals(training.getStatus()))
                .orElseThrow(() -> new TrainingNotFoundException(
                        "Formation non trouvée ou déjà annulée",
                        Map.of("trainingId", trainingId.toString(), "companyId", companyId.toString()).toString()
                ));
    }

    /**
     * Construction efficace des emails de notification par batch
     */
    private Set<String> buildNotificationEmails(Training training, Set<Long> participantIds, CancelTrainingDto cancelTrainingDto) {
        Set<String> emails = new HashSet<>();

        // Ajout de l'email du formateur externe si applicable
        addTrainerEmail(training, emails);

        // Ajout de l'email de l'organisme de formation
        if (cancelTrainingDto.getIncludeOcf()) {
            addOCFEmail(training, emails);
        }

        // Ajout de l'ID du formateur interne aux participants si nécessaire
        Set<Long> allParticipantIds = new HashSet<>(participantIds);
        if (cancelTrainingDto.getIncludeInternalTrainer()) {
            addInternalTrainerToParticipants(training, allParticipantIds, cancelTrainingDto);
        }

        // Récupération des emails des participants par batch pour optimiser les performances
        addParticipantEmails(allParticipantIds, emails);

        return emails;
    }

    /**
     * Ajoute l'email du formateur externe si applicable
     */
    private void addTrainerEmail(Training training, Set<String> emails) {
        if (training.getGroupes() != null && !training.getGroupes().isEmpty()) {
            TrainingGroupe firstGroup = training.getGroupes().get(0);

            if (TrainingType.EXTERNAL.equals(firstGroup.getTrainingType())
                    && firstGroup.getTrainer() != null
                    && StringUtils.isNotBlank(firstGroup.getTrainer().getEmail())) {
                emails.add(firstGroup.getTrainer().getEmail());
            }
        }
    }

    /**
     * Ajoute l'email du OCF
     */
    private void addOCFEmail(Training training, Set<String> emails) {
        if (training.getGroupes() != null && !training.getGroupes().isEmpty()) {
            TrainingGroupe firstGroup = training.getGroupes().get(0);

            if (TrainingType.EXTERNAL.equals(firstGroup.getTrainingType())
                    && firstGroup.getOcf() != null
                    && StringUtils.isNotBlank(firstGroup.getOcf().getEmailMainContact())) {
                emails.add(firstGroup.getOcf().getEmailMainContact());
            }
        }
    }

    /**
     * Ajoute l'ID du formateur interne aux participants si nécessaire
     */
    private void addInternalTrainerToParticipants(Training training, Set<Long> participantIds, CancelTrainingDto cancelTrainingDto) {
        if (Boolean.TRUE.equals(cancelTrainingDto.getIncludeInternalTrainer())
                && training.getGroupes() != null
                && !training.getGroupes().isEmpty()) {

            TrainingGroupe firstGroup = training.getGroupes().get(0);
            if (TrainingType.INTERNAL.equals(firstGroup.getTrainingType())
                    && firstGroup.getInternalTrainerId() != null) {
                participantIds.add(firstGroup.getInternalTrainerId());
            }
        }
    }

    /**
     * Récupération optimisée des emails des participants par batch
     */
    private void addParticipantEmails(Set<Long> participantIds, Set<String> emails) {
        if (participantIds.isEmpty()) {
            return;
        }

        try {
            // Conversion en liste pour le traitement par batch
            List<Long> participantList = new ArrayList<>(participantIds);

            // Traitement par batch pour éviter les timeouts sur de gros volumes
            for (int i = 0; i < participantList.size(); i += PARTICIPANTS_BATCH_SIZE) {
                int endIndex = Math.min(i + PARTICIPANTS_BATCH_SIZE, participantList.size());
                List<Long> batch = participantList.subList(i, endIndex);

                List<ParticipantForCancel> participants = authServiceClient.getParticipantsEmail(new HashSet<>(batch));

                if (participants != null) {
                    participants.stream()
                            .filter(participant -> participant.getEmail() != null && !participant.getEmail().trim().isEmpty())
                            .forEach(participant -> emails.add(participant.getEmail()));
                }

                // Pause entre les batches pour éviter la surcharge du service auth
                if (i + PARTICIPANTS_BATCH_SIZE < participantList.size()) {
                    Thread.sleep(BATCH_PROCESSING_DELAY_MS);
                }
            }

            int batchCount = (int) Math.ceil((double) participantIds.size() / PARTICIPANTS_BATCH_SIZE);
            log.info("Retrieved emails for {} participants in {} batches", participantIds.size(), batchCount);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interruption lors de la récupération des emails", e);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des emails des participants: {}", participantIds, e);
            throw new NotificationException("Impossible de récupérer les emails des participants", e);
        }
    }

    /**
     * Met à jour le statut de la formation
     */
    @Transactional
    void updateTrainingStatus(Training training) {
        training.setStatus(TrainingStatusEnum.CANCELLED);
        trainingRepository.save(training);
        log.debug("Training status updated to CANCELLED for ID: {}", training.getId());
    }

    /**
     * Envoi des notifications d'annulation avec gestion d'erreur robuste
     */
    private void sendCancellationNotifications(Set<String> emails, CancelTrainingDto cancelTrainingDto) {
        if (emails.isEmpty()) {
            log.warn("Aucun email à notifier pour l'annulation de formation");
            return;
        }

        try {
            CancelTrainingEmailRequest emailRequest = CancelTrainingEmailRequest.builder()
                    .emails(emails)
                    .object(cancelTrainingDto.getObject())
                    .message(cancelTrainingDto.getContent())
                    .build();

            notificationServiceClient.sendCancellationEmails(emailRequest);

            log.info("Cancellation notifications sent to {} recipients", emails.size());

        } catch (Exception e) {
            log.error("Failed to send cancellation notifications to {} recipients", emails.size(), e);
            throw new NotificationException("Échec de l'envoi des notifications d'annulation", e);
        }
    }

    // Constantes pour la gestion des performances
    private static final int MAX_PARTICIPANTS_PER_BATCH = 1000;
    private static final int PARTICIPANTS_BATCH_SIZE = 100;
    private static final long BATCH_PROCESSING_DELAY_MS = 50;
}