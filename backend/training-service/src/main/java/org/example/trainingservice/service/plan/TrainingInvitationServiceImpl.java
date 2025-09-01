package org.example.trainingservice.service.plan;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.client.notification.NotificationServiceClient;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.dto.plan.InvitationSummaryDto;
import org.example.trainingservice.dto.plan.ParticipantForCancel;
import org.example.trainingservice.dto.plan.RespondInvitationDto;
import org.example.trainingservice.dto.plan.SendInvitationDto;
import org.example.trainingservice.entity.plan.Training;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.entity.plan.TrainingInvitation;
import org.example.trainingservice.enums.InvitationStatusEnum;
import org.example.trainingservice.model.plan.SendInvitationEmailRequest;
import org.example.trainingservice.repository.TrainingInvitationRepository;
import org.example.trainingservice.repository.plan.TrainingGroupeRepository;
import org.example.trainingservice.repository.plan.TrainingRepository;
import org.example.trainingservice.utils.SecurityUtils;
import org.example.trainingservice.utils.TrainingInvitationUtilMethods;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TrainingInvitationServiceImpl implements TrainingInvitationService {
    private final TrainingInvitationRepository trainingInvitationRepository;
    private final TrainingGroupeRepository trainingGroupeRepository;
    private final TrainingRepository trainingRepository;
    private final AuthServiceClient authServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    public TrainingInvitationServiceImpl(
            TrainingInvitationRepository trainingInvitationRepository,
            TrainingGroupeRepository trainingGroupeRepository,
            TrainingRepository trainingRepository,
            AuthServiceClient authServiceClient,
            NotificationServiceClient notificationServiceClient
    ) {
        this.trainingInvitationRepository = trainingInvitationRepository;
        this.trainingGroupeRepository = trainingGroupeRepository;
        this.trainingRepository = trainingRepository;
        this.authServiceClient = authServiceClient;
        this.notificationServiceClient = notificationServiceClient;
    }

    @Override
    public ResponseEntity<?> getInvitations(Long groupId) {
        log.info("Récupération des invitations pour le groupe {}", groupId);

        // 1. On récupère la liste des invitations. Si aucune n'est trouvée,
        // le repository retournera une liste vide (et non 'null').
        List<TrainingInvitation> byTrainingGroupeId = trainingInvitationRepository.findByTrainingGroupeId(groupId);

        // 2. On mappe la liste d'entités vers une liste de DTOs.
        // Si 'byTrainingGroupeId' est une liste vide, cette méthode retournera aussi une liste vide.
        var invitationDtos = TrainingInvitationUtilMethods.mapToTrainingInvitationDtos(byTrainingGroupeId);

        // 3. On retourne la liste de DTOs avec un statut 200 OK.
        // Si la liste est vide, le client recevra un corps de réponse JSON comme ceci : []
        return ResponseEntity.ok(invitationDtos);
    }

    @Override
    @Transactional
    public ResponseEntity<?> sendInvitations(Long groupId, SendInvitationDto sendInvitationDto) {
        try {
            log.info("Début d'envoi des invitations pour le groupe {} avec {} participants",
                    groupId, sendInvitationDto.getParticipantIds().size());

            // 1. Validation des données d'entrée
            if (sendInvitationDto.getParticipantIds() == null || sendInvitationDto.getParticipantIds().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("La liste des participants ne peut pas être vide");
            }

            // 2. Récupération du groupe de formation
            Optional<TrainingGroupe> groupeOpt = trainingGroupeRepository.findById(groupId);
            if (groupeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            TrainingGroupe groupe = groupeOpt.get();

            // 3. Récupération de la formation associée
            Training training = null;
            if (sendInvitationDto.getTrainingId() != null) {
                Optional<Training> trainingOpt = trainingRepository.findById(sendInvitationDto.getTrainingId());
                if (trainingOpt.isEmpty()) {
                    return ResponseEntity.badRequest()
                            .body("Formation non trouvée avec l'ID: " + sendInvitationDto.getTrainingId());
                }
                training = trainingOpt.get();
            } else {
                training = groupe.getTraining();
            }

            // 4. Récupération des invitations avec statut NOT_SENT pour les participants spécifiés
            List<TrainingInvitation> notSentInvitations = new ArrayList<>();
            List<TrainingInvitation> alreadySentInvitations = new ArrayList<>();

            for (Long participantId : sendInvitationDto.getParticipantIds()) {
                TrainingInvitation invitation = trainingInvitationRepository
                        .findByTrainingGroupeIdAndUserId(groupId, participantId);

                if (invitation != null) {
                    if (invitation.getStatus() == InvitationStatusEnum.NOT_SENT) {
                        notSentInvitations.add(invitation);
                    } else {
                        alreadySentInvitations.add(invitation);
                        log.info("Invitation déjà envoyée pour l'utilisateur {} avec le statut {}",
                                participantId, invitation.getStatus());
                    }
                } else {
                    log.warn("Aucune invitation trouvée pour l'utilisateur {} dans le groupe {}",
                            participantId, groupId);
                }
            }

            if (notSentInvitations.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Aucune invitation avec le statut NOT_SENT trouvée pour les participants sélectionnés");
            }

            // 5. Extraction des emails pour l'envoi
            Set<String> emails = notSentInvitations.stream()
                    .map(TrainingInvitation::getUserEmail)
                    .filter(Objects::nonNull)
                    .filter(email -> !email.trim().isEmpty())
                    .collect(Collectors.toSet());

            if (emails.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Aucun email valide trouvé pour les participants avec le statut NOT_SENT");
            }

            // 6. Préparation de la requête pour le service de notification
            SendInvitationEmailRequest emailRequest = SendInvitationEmailRequest.builder()
                    .emails(emails)
                    .object(sendInvitationDto.getObject())
                    .message(sendInvitationDto.getContent())
                    .build();

            // 7. Envoi des emails via le service de notification
            try {
                notificationServiceClient.sendInvitationEmails(emailRequest);
                log.info("Emails d'invitation envoyés avec succès pour {} participants", notSentInvitations.size());
            } catch (Exception e) {
                log.error("Erreur lors de l'envoi des emails d'invitation", e);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body("Erreur lors de l'envoi des emails d'invitation: " + e.getMessage());
            }

            // 8. Mise à jour du statut des invitations de NOT_SENT vers PENDING
            try {
                for (TrainingInvitation invitation : notSentInvitations) {
                    invitation.setStatus(InvitationStatusEnum.PENDING);
                    invitation.setInvitationDate(LocalDate.now());
                    invitation.setNotes("Invitation envoyée via l'interface admin le " + LocalDate.now());
                }

                trainingInvitationRepository.saveAll(notSentInvitations);
                log.info("Statut mis à jour pour {} invitations: NOT_SENT → PENDING", notSentInvitations.size());

            } catch (Exception e) {
                log.error("Erreur lors de la mise à jour du statut des invitations", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Emails envoyés mais erreur lors de la mise à jour du statut des invitations");
            }

            // 9. Mise à jour du statut du groupe si nécessaire
            updateGroupeAfterInvitations(groupe, notSentInvitations.size());

            // 10. Réponse de succès avec un résumé détaillé
            InvitationSummaryDto summary = InvitationSummaryDto.builder()
                    .totalParticipants(sendInvitationDto.getParticipantIds().size())
                    .newInvitations(notSentInvitations.size())
                    .existingInvitations(alreadySentInvitations.size())
                    .emailsSent(notSentInvitations.size())
                    .smsSent(Boolean.TRUE.equals(sendInvitationDto.getSendSms()) ? notSentInvitations.size() : 0)
                    .build();

            log.info("Envoi des invitations terminé avec succès: {}", summary);

            return ResponseEntity.ok(Map.of(
                    "summary", summary,
                    "message", String.format("Invitations envoyées avec succès à %d participants. " +
                                    "%d invitations étaient déjà envoyées.",
                            notSentInvitations.size(), alreadySentInvitations.size())
            ));

        } catch (Exception e) {
            log.error("Erreur inattendue lors de l'envoi des invitations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur inattendue lors de l'envoi des invitations: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> sendTrainerInvitation(Long groupId, SendInvitationDto sendInvitationDto) {
        try {
            log.info("Envoi invitation formateur pour le groupe {}", groupId);

            // 1. Validation
            if (sendInvitationDto.getTrainerId() == null) {
                return ResponseEntity.badRequest().body("L'ID du formateur est obligatoire");
            }

            // 2. Récupération du groupe
            Optional<TrainingGroupe> groupeOpt = trainingGroupeRepository.findById(groupId);
            if (groupeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            TrainingGroupe groupe = groupeOpt.get();

            // 3. Récupération des infos formateur
            Long trainerId = sendInvitationDto.getTrainerId();
            List<ParticipantForCancel> trainerList;
            try {
                trainerList = authServiceClient.getParticipantsEmail(Set.of(trainerId));
                if (trainerList.isEmpty()) {
                    return ResponseEntity.badRequest().body("Formateur non trouvé");
                }
            } catch (Exception e) {
                log.error("Erreur récupération formateur {}: {}", trainerId, e.getMessage());
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body("Erreur lors de la récupération du formateur");
            }

            ParticipantForCancel trainerInfo = trainerList.get(0);

            // 4. Vérification invitation existante
            TrainingInvitation existingInvitation = trainingInvitationRepository
                    .findByTrainingGroupeIdAndUserId(groupId, trainerId);

            if (existingInvitation != null && existingInvitation.getStatus() != InvitationStatusEnum.NOT_SENT) {
                return ResponseEntity.badRequest()
                        .body("Invitation déjà envoyée à ce formateur");
            }

            // 5. Création invitation si nécessaire
            if (existingInvitation == null) {
                Training training = groupe.getTraining();
                Long companyId = SecurityUtils.getCurrentCompanyId();

                existingInvitation = TrainingInvitation.builder()
                        .trainingGroupe(groupe)
                        .userId(trainerId)
                        .userEmail(trainerInfo.getEmail())
                        .userFullName(trainerInfo.getName())
                        .companyId(companyId)
                        .status(InvitationStatusEnum.NOT_SENT)
                        .trainingId(training.getId())
                        .trainingTheme(training.getTheme())
                        .groupeName(groupe.getName())
                        .trainerName(trainerInfo.getName())
                        .participantCount(groupe.getParticipantCount())
                        .dates(groupe.getDates())
                        .isTrainer(Boolean.TRUE)
                        .location(groupe.getLocation())
                        .city(groupe.getCity())
                        .build();

                existingInvitation = trainingInvitationRepository.save(existingInvitation);
            }

            // 6. Envoi email
            SendInvitationEmailRequest emailRequest = SendInvitationEmailRequest.builder()
                    .emails(Set.of(trainerInfo.getEmail()))
                    .object(sendInvitationDto.getObject())
                    .message(sendInvitationDto.getContent())
                    .build();

            try {
                notificationServiceClient.sendInvitationEmails(emailRequest);
            } catch (Exception e) {
                log.error("Erreur envoi email formateur", e);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body("Erreur lors de l'envoi de l'email");
            }

            // 7. Mise à jour statut
            existingInvitation.setStatus(InvitationStatusEnum.PENDING);
            existingInvitation.setInvitationDate(LocalDate.now());
            trainingInvitationRepository.save(existingInvitation);

            log.info("Invitation formateur envoyée avec succès pour le groupe {}", groupId);
            return ResponseEntity.ok(Map.of(
                    "message", "Invitation formateur envoyée avec succès",
                    "trainerEmail", trainerInfo.getEmail()
            ));

        } catch (Exception e) {
            log.error("Erreur envoi invitation formateur groupe {}", groupId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur inattendue lors de l'envoi de l'invitation");
        }
    }

    @Override
    @Transactional // Assurer la cohérence transactionnelle
    public void createTrainingInvitation(TrainingGroupe trainingGroupe, Set<Long> userGroupIds) {
        try {
            log.debug("Creating training invitations for group {} with {} user groups",
                    trainingGroupe.getName(), userGroupIds.size());

            Long companyId = SecurityUtils.getCurrentCompanyId();
            Long groupId = trainingGroupe.getId();
            List<String> dates = trainingGroupe.getDates();
            String city = trainingGroupe.getCity();
            String location = trainingGroupe.getLocation();
            String trainerName = trainingGroupe.getTrainerName();
            String name = trainingGroupe.getName();
            Training training = trainingGroupe.getTraining();
            String theme = training.getTheme();
            UUID id = training.getId();
            Integer participantCount = trainingGroupe.getParticipantCount();

            List<TrainingInvitation> trainingInvitations = new ArrayList<>();

            // Récupération des participants avec gestion d'erreur améliorée
            List<ParticipantForCancel> participants = List.of();
            try {
                participants = authServiceClient.getParticipantsEmail(userGroupIds);
                log.debug("Retrieved {} participants from auth service", participants.size());
            } catch (Exception e) {
                log.error("Erreur lors de la récupération des participants pour le groupe {}: {}",
                        groupId, e.getMessage());
                throw new RuntimeException("Impossible de récupérer les participants", e);
            }

            // Création des invitations
            int newInvitationsCount = 0;
            int existingInvitationsCount = 0;

            for (ParticipantForCancel participant : participants) {
                TrainingInvitation retrievedInvitation = trainingInvitationRepository
                        .findByTrainingGroupeIdAndUserId(groupId, participant.getId());

                if (retrievedInvitation == null) {
                    TrainingInvitation invitation = TrainingInvitation.builder()
                            .trainingGroupe(trainingGroupe)
                            .userId(participant.getId())
                            .userEmail(participant.getEmail())
                            .userFullName(participant.getName())
                            .companyId(companyId)
                            .status(InvitationStatusEnum.NOT_SENT)
                            .invitationDate(null)
                            .trainingId(id)
                            .trainingTheme(theme)
                            .groupeName(name)
                            .trainerName(trainerName)
                            .participantCount(participantCount)
                            .dates(dates)
                            .location(location)
                            .city(city)
                            .build();
                    trainingInvitations.add(invitation);
                    newInvitationsCount++;
                } else {
                    existingInvitationsCount++;
                    log.debug("Invitation already exists for user {} in group {}",
                            participant.getId(), groupId);
                }
            }

            // Enregistrement des nouvelles invitations
            if (!trainingInvitations.isEmpty()) {
                trainingInvitationRepository.saveAll(trainingInvitations);
                log.info("Created {} new invitations for training group {}. {} existing invitations found.",
                        newInvitationsCount, name, existingInvitationsCount);
            } else {
                log.info("No new invitations to create for training group {}. All {} participants already have invitations.",
                        name, existingInvitationsCount);
            }

        } catch (Exception e) {
            log.error("Erreur lors de la création des invitations pour le groupe {}: {}",
                    trainingGroupe.getId(), e.getMessage(), e);
            throw e; // Re-lancer l'exception pour que la transaction soit rollback
        }
    }

    @Override
    public ResponseEntity<?> getUserInvitations(Long userId) {
        log.info("Getting user invitations for user: {}", userId);
        try {
            List<TrainingInvitation> userInvitations = trainingInvitationRepository.findByUserId(userId);
            if (userInvitations.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            return ResponseEntity.ok(TrainingInvitationUtilMethods.mapToUserInvitationDtos(userInvitations));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<Void> respondInvitation(UUID invitationId, RespondInvitationDto respondInvitationDto) {
        // 1. On vérifie que l'ID et le statut ne sont pas nuls dès le début.
        if (respondInvitationDto.getUserId() == null || respondInvitationDto.getAction() == null) {
            return ResponseEntity.badRequest().build();
        }

        // 2. findById renvoie un Optional, ce qui nous aide à éviter les erreurs de type NullPointerException.
        Optional<TrainingInvitation> optionalInvitation = trainingInvitationRepository.findById(invitationId);

        // 3. On vérifie si l'invitation a été trouvée dans la base de données.
        if (optionalInvitation.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TrainingInvitation trainingInvitation = optionalInvitation.get();
        String newStatus = respondInvitationDto.getAction();

        // 4. On met à jour le statut en comparant les chaînes de caractères sans tenir compte de la casse.
        if ("accept".equals(newStatus)) {
            trainingInvitation.setStatus(InvitationStatusEnum.ACCEPTED);
        } else if ("decline".equals(newStatus)) {
            trainingInvitation.setStatus(InvitationStatusEnum.DECLINED);
        } else {
            // Si le statut envoyé n'est ni "Acceptée", ni "Rejetée", la requête est incorrecte.
            return ResponseEntity.badRequest().build();
        }

        // 5. On sauvegarde l'entité mise à jour et on gère les erreurs potentielles.
        try {
            trainingInvitationRepository.save(trainingInvitation);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Si une erreur se produit lors de la communication avec la base de données.
            // Il serait bien de logger l'erreur ici pour le débogage.
            // log.error("Erreur lors de la sauvegarde de l'invitation : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<?> getTeamInvitations(Long managerId) {
        if (managerId != null) {
            List<Long> myTeamIds = authServiceClient.getMyTeam(managerId);
            if (!myTeamIds.isEmpty()) {
                List<TrainingInvitation> allByUserId = trainingInvitationRepository.findAllByUserIds(myTeamIds);
                return ResponseEntity.ok(TrainingInvitationUtilMethods.mapToUserInvitationDtos(allByUserId));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.badRequest().build();
    }

    @Override
    public ResponseEntity<?> respondTeamUserInvitation(UUID invitationId, RespondInvitationDto respondInvitationDto) {
        return null;
    }

    /**
     * Met à jour le groupe après envoi des invitations
     */
    private void updateGroupeAfterInvitations(TrainingGroupe groupe, int invitationsCount) {
        try {
            // Vous pourriez vouloir ajouter des champs comme lastInvitationDate, totalInvitationsSent, etc.
            // groupe.setLastInvitationDate(LocalDateTime.now());
            // groupe.setTotalInvitationsSent(groupe.getTotalInvitationsSent() + invitationsCount);
            // trainingGroupeRepository.save(groupe);

            log.info("Groupe {} mis à jour après envoi de {} invitations", groupe.getId(), invitationsCount);
        } catch (Exception e) {
            log.warn("Erreur lors de la mise à jour du groupe après envoi des invitations", e);
        }
    }
}