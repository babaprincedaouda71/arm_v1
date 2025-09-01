package org.example.trainingservice.service.plan.evaluation;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.dto.evaluation.Participant;
import org.example.trainingservice.dto.plan.evaluation.*;
import org.example.trainingservice.entity.campaign.Question;
import org.example.trainingservice.entity.campaign.Questionnaire;
import org.example.trainingservice.entity.campaign.UserResponse;
import org.example.trainingservice.entity.plan.Training;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.entity.plan.evaluation.GroupeEvaluation;
import org.example.trainingservice.entity.plan.f4.EvaluationQRToken;
import org.example.trainingservice.enums.GroupeEvaluationStatusEnums;
import org.example.trainingservice.repository.evaluation.QuestionnaireRepository;
import org.example.trainingservice.repository.evaluation.UserResponseRepository;
import org.example.trainingservice.repository.plan.TrainingGroupeRepository;
import org.example.trainingservice.repository.plan.TrainingRepository;
import org.example.trainingservice.repository.plan.evaluation.GroupeEvaluationRepo;
import org.example.trainingservice.repository.plan.f4.EvaluationQRTokenRepository;
import org.example.trainingservice.service.plan.f4.PublicEvaluationService;
import org.example.trainingservice.utils.GroupeEvaluationUtilMethods;
import org.example.trainingservice.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GroupeEvaluationServiceImpl implements GroupeEvaluationService {
    private final GroupeEvaluationRepo groupeEvaluationRepo;
    private final TrainingGroupeRepository trainingGroupeRepository;
    private final AuthServiceClient authServiceClient;
    private final QuestionnaireRepository questionnaireRepository;
    private final TrainingRepository trainingRepository;
    private final PublicEvaluationService publicEvaluationService;
    private final EvaluationQRTokenRepository qrTokenRepository;
    private final UserResponseRepository userResponseRepository;

    public GroupeEvaluationServiceImpl(GroupeEvaluationRepo groupeEvaluationRepo, TrainingGroupeRepository trainingGroupeRepository, AuthServiceClient authServiceClient, QuestionnaireRepository questionnaireRepository, TrainingRepository trainingRepository, PublicEvaluationService publicEvaluationService, EvaluationQRTokenRepository qrTokenRepository, UserResponseRepository userResponseRepository) {
        this.groupeEvaluationRepo = groupeEvaluationRepo;
        this.trainingGroupeRepository = trainingGroupeRepository;
        this.authServiceClient = authServiceClient;
        this.questionnaireRepository = questionnaireRepository;
        this.trainingRepository = trainingRepository;
        this.publicEvaluationService = publicEvaluationService;
        this.qrTokenRepository = qrTokenRepository;
        this.userResponseRepository = userResponseRepository;
    }

    @Override
    public List<GroupeEvaluationDto> getAllGroupeEvaluations(UUID trainingId, Long groupId) {
        log.info("getAllGroupeEvaluations trainingId : {}, groupId : {}", trainingId, groupId);

        log.info("Fetching groupe evaluations");
        List<GroupeEvaluation> allByTrainingIdAndGroupeId = groupeEvaluationRepo.findAllByTrainingIdAndGroupeId(trainingId, groupId);

        if (allByTrainingIdAndGroupeId != null && !allByTrainingIdAndGroupeId.isEmpty()) {
            List<GroupeEvaluationDto> groupeEvaluationDtos = GroupeEvaluationUtilMethods.mapToGroupeEvaluationDtos(allByTrainingIdAndGroupeId);
            log.info("Finished fetching groupe evaluations");
            return groupeEvaluationDtos;
        }
        return Collections.emptyList();
    }

    @Override
    public List<Participant> fetchParticipants(UUID trainingId, Long groupId) {
        log.info("fetchParticipants trainingId : {}, groupId : {}", trainingId, groupId);
        Optional<TrainingGroupe> byId = trainingGroupeRepository.findById(groupId);
        if (byId.isPresent()) {
            TrainingGroupe trainingGroupe = byId.get();

            Set<Long> userGroupIds = trainingGroupe.getUserGroupIds();

            try {
                List<Participant> participants = authServiceClient.getParticipants(new ArrayList<>(userGroupIds));
                log.info("Finished fetching participants");
                return participants;
            } catch (Exception e) {
                log.error("Error fetching participants", e);
                return List.of();
            }
        }
        return List.of();
    }

    @Override
    public void addGroupeEvaluation(UUID trainingId, Long groupId, AddGroupeEvaluationDto addGroupeEvaluationDto) {
        log.info("addGroupeEvaluation groupId : {}", groupId);
        UUID questionnaireId = addGroupeEvaluationDto.getQuestionnaireId();
        Optional<Training> byIdAndCompanyId = trainingRepository.findByIdAndCompanyId(trainingId, SecurityUtils.getCurrentCompanyId());
        Optional<TrainingGroupe> byId = trainingGroupeRepository.findById(groupId);
        Optional<Questionnaire> byId1 = questionnaireRepository.findById(questionnaireId);
        if (byIdAndCompanyId.isPresent() && byId.isPresent() && byId1.isPresent()) {
            Questionnaire questionnaire = byId1.get();

            GroupeEvaluation groupeEvaluation = GroupeEvaluation.builder()
                    .groupeId(groupId)
                    .label(addGroupeEvaluationDto.getLabel())
                    .type(addGroupeEvaluationDto.getType())
                    .companyId(SecurityUtils.getCurrentCompanyId())
                    .creationDate(LocalDate.now())
                    .trainingId(trainingId)
                    .questionnaire(questionnaire)
                    .participantIds(addGroupeEvaluationDto.getParticipantIds())
                    .status(GroupeEvaluationStatusEnums.DRAFT)
                    .build();

            groupeEvaluationRepo.save(groupeEvaluation);
            log.info("Finished adding groupe evaluation");
        }
    }

    @Override
    public void updateStatus(UpdateGroupeEvaluationStatusDto dto) {
        log.info("updateStatus dto : {}", dto);
        UUID evaluationId = dto.getId();
        String statusString = dto.getStatus();
        if (evaluationId != null && statusString != null && !statusString.trim().isEmpty()) {
            Optional<GroupeEvaluation> byId = groupeEvaluationRepo.findById(evaluationId);

            if (byId.isPresent()) {
                GroupeEvaluation groupeEvaluation = byId.get();
                groupeEvaluation.setStatus(GroupeEvaluationStatusEnums.fromDescription(statusString));
                groupeEvaluationRepo.save(groupeEvaluation);

                if (Objects.equals(groupeEvaluation.getType(), "Formulaire F4")) {
                    try {
                        log.info("Generating QR tokens for published evaluation: {}", evaluationId);
                        publicEvaluationService.generateQRTokensForEvaluation(evaluationId);
                        log.info("QR tokens generated successfully for evaluation: {}", evaluationId);
                    } catch (Exception e) {
                        log.error("Error generating QR tokens for evaluation: {}", evaluationId, e);
                        // On peut choisir de relancer l'exception ou juste logger l'erreur
                        // selon les besoins métier
                    }
                }
                log.info("Finished updating groupe evaluation status");
            } else {
                log.warn("Evaluation not found with id : {}", evaluationId);
            }
        } else {
            log.warn("Evaluation id or status are null or empty");
        }
    }

    @Override
    public ResponseEntity<?> getGroupeEvaluationForQuestionnaire(UUID groupeEvaluationId) {
        log.info("Récupération des détails pour génération questionnaire: {}", groupeEvaluationId);

        try {
            Optional<GroupeEvaluation> groupeEvaluationOpt = groupeEvaluationRepo.findById(groupeEvaluationId);

            if (groupeEvaluationOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            GroupeEvaluation groupeEvaluation = groupeEvaluationOpt.get();

            // Vérifier les permissions d'accès (companyId)
            if (!groupeEvaluation.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Récupérer le thème
            UUID trainingId = groupeEvaluation.getTrainingId();
            Optional<Training> byIdAndCompanyId = trainingRepository.findByIdAndCompanyId(trainingId, SecurityUtils.getCurrentCompanyId());
            if (byIdAndCompanyId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Training training = byIdAndCompanyId.get();
            String theme = training.getTheme();

            // Récupérer les groupes
            Long groupeId = groupeEvaluation.getGroupeId();
            Optional<TrainingGroupe> byId = trainingGroupeRepository.findById(groupeId);
            if (byId.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            TrainingGroupe trainingGroupe = byId.get();
            List<String> dates = trainingGroupe.getDates();

            // Créer le DTO de réponse
            Map<String, Object> response = new HashMap<>();
            response.put("id", groupeEvaluation.getId());
            response.put("label", groupeEvaluation.getLabel());
            response.put("type", groupeEvaluation.getType());
            response.put("status", groupeEvaluation.getStatus().getDescription());
            response.put("questionnaireId", groupeEvaluation.getQuestionnaire().getId());
            response.put("theme", theme);
            response.put("dates", dates);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la GroupeEvaluation: {}", groupeEvaluationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur interne du serveur"));
        }
    }

    @Override
    public ResponseEntity<?> getQRTokensForEvaluation(UUID groupeEvaluationId) {
        log.info("Récupération des tokens QR pour l'évaluation: {}", groupeEvaluationId);

        try {
            // Vérifier que l'évaluation existe et appartient à l'entreprise
            Optional<GroupeEvaluation> groupeEvaluationOpt = groupeEvaluationRepo.findById(groupeEvaluationId);

            if (groupeEvaluationOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            GroupeEvaluation groupeEvaluation = groupeEvaluationOpt.get();

            if (!groupeEvaluation.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Vérifier que l'évaluation est publiée
            if (groupeEvaluation.getStatus() != GroupeEvaluationStatusEnums.PUBLISHED) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "L'évaluation doit être publiée avant de générer les questionnaires"));
            }

            // Récupérer les tokens QR
            List<EvaluationQRToken> qrTokens = qrTokenRepository.findByGroupeEvaluationIdOrderByCreatedDateDesc(groupeEvaluationId);

            if (qrTokens.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Aucun token QR trouvé. Veuillez republier l'évaluation."));
            }

            // Convertir en DTOs
            List<Map<String, Object>> tokenDtos = qrTokens.stream()
                    .map(token -> {
                        Map<String, Object> dto = new HashMap<>();
                        dto.put("token", token.getToken());
                        dto.put("participantId", token.getParticipantId());
                        dto.put("participantFullName", token.getParticipantFullName());
                        dto.put("isUsed", token.getIsUsed());
                        dto.put("createdDate", token.getCreatedDate());
                        return dto;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(tokenDtos);

        } catch (Exception e) {
            log.error("Erreur lors de la récupération des tokens QR: {}", groupeEvaluationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur interne du serveur"));
        }
    }


    /*
     * Méthode pour récupérer les réponses du participant
     * */
    @Override
    public ResponseEntity<?> getParticipantResponses(Long participantId, UUID groupeEvaluationId) {
        log.info("Getting participant responses for participantId: {} and groupeEvaluationId: {}",
                participantId, groupeEvaluationId);

        try {
            // Vérifier que l'évaluation existe et appartient à l'entreprise
            Optional<GroupeEvaluation> groupeEvaluationOpt = groupeEvaluationRepo.findById(groupeEvaluationId);

            if (groupeEvaluationOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            GroupeEvaluation groupeEvaluation = groupeEvaluationOpt.get();

            if (!groupeEvaluation.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Vérifier que le participant fait partie de cette évaluation
            if (!groupeEvaluation.getParticipantIds().contains(participantId)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Le participant ne fait pas partie de cette évaluation"));
            }

            // Récupérer les réponses du participant
            List<UserResponse> userResponses = userResponseRepository
                    .findByUserIdAndGroupeEvaluationId(participantId, groupeEvaluationId);

            // Récupérer les questions du questionnaire
            Questionnaire questionnaire = groupeEvaluation.getQuestionnaire();
            List<Question> questions = questionnaire.getQuestions();

            // Calculer le progrès
            int progress = calculateProgress(userResponses, questions);

            // Construire la réponse similaire à UserEvaluationProps
            Map<String, Object> evaluationData = new HashMap<>();
            evaluationData.put("id", groupeEvaluationId.toString());
            evaluationData.put("title", groupeEvaluation.getLabel());
            evaluationData.put("type", groupeEvaluation.getType());
            evaluationData.put("description", questionnaire.getDescription());
            evaluationData.put("progress", progress);
            evaluationData.put("questions", convertQuestionsToProps(questions));
            evaluationData.put("responses", userResponses);

            return ResponseEntity.ok(evaluationData);

        } catch (Exception e) {
            log.error("Error getting participant responses", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la récupération des réponses"));
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> deleteGroupeEvaluation(UUID groupeEvaluationId) {
        log.info("Tentative de suppression de l'évaluation de groupe avec l'ID : {}", groupeEvaluationId);

        try {
            // 1. Vérifier que l'évaluation existe
            Optional<GroupeEvaluation> groupeEvaluationOpt = groupeEvaluationRepo.findById(groupeEvaluationId);

            if (groupeEvaluationOpt.isEmpty()) {
                log.warn("Évaluation de groupe non trouvée avec l'ID : {}", groupeEvaluationId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Évaluation non trouvée"));
            }

            GroupeEvaluation groupeEvaluation = groupeEvaluationOpt.get();

            // 2. Vérifier les permissions (entreprise)
            if (!groupeEvaluation.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
                log.warn("Tentative de suppression non autorisée pour l'entreprise {} sur l'évaluation {}",
                        SecurityUtils.getCurrentCompanyId(), groupeEvaluationId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Accès non autorisé"));
            }

            // 3. Pas de restriction selon le statut - suppression autorisée pour tous les statuts
            log.info("Suppression autorisée pour l'évaluation {} avec le statut : {}",
                    groupeEvaluationId, groupeEvaluation.getStatus());

            // 4. Supprimer les données associées en cascade

            // 4.1 Supprimer les tokens QR associés
            try {
                qrTokenRepository.deleteByGroupeEvaluationId(groupeEvaluationId);
                log.info("Tokens QR supprimés pour l'évaluation : {}", groupeEvaluationId);
            } catch (Exception e) {
                log.error("Erreur lors de la suppression des tokens QR pour l'évaluation : {}", groupeEvaluationId, e);
                // Continuer le processus même si la suppression des tokens échoue
            }

            // 4.2 Supprimer les réponses utilisateurs associées
            try {
                List<UserResponse> userResponses = userResponseRepository.findByGroupeEvaluationId(groupeEvaluationId);
                if (!userResponses.isEmpty()) {
                    userResponseRepository.deleteAll(userResponses);
                    log.info("Réponses utilisateurs supprimées ({} réponses) pour l'évaluation : {}",
                            userResponses.size(), groupeEvaluationId);
                }
            } catch (Exception e) {
                log.error("Erreur lors de la suppression des réponses utilisateurs pour l'évaluation : {}",
                        groupeEvaluationId, e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Erreur lors de la suppression des données associées"));
            }

            // 5. Supprimer l'évaluation elle-même
            groupeEvaluationRepo.delete(groupeEvaluation);

            log.info("Évaluation de groupe supprimée avec succès : {}", groupeEvaluationId);

            return ResponseEntity.ok()
                    .body(Map.of("message", "Évaluation supprimée avec succès"));

        } catch (Exception e) {
            log.error("Erreur inattendue lors de la suppression de l'évaluation : {}", groupeEvaluationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur interne du serveur"));
        }
    }

    @Override
    public GroupeEvaluationEditDetailsDto getGroupeEvaluationEditDetails(UUID evaluationId) {
        log.info("getGroupeEvaluationEditDetails evaluationId: {}", evaluationId);

        Optional<GroupeEvaluation> evaluationOpt = groupeEvaluationRepo.findById(evaluationId);

        if (evaluationOpt.isEmpty()) {
            log.warn("GroupeEvaluation not found with id: {}", evaluationId);
            throw new RuntimeException("Évaluation non trouvée");
        }

        GroupeEvaluation evaluation = evaluationOpt.get();

        // Vérifier les permissions (companyId)
        if (!evaluation.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
            log.warn("Access denied for evaluation: {}", evaluationId);
            throw new RuntimeException("Accès refusé");
        }

        return GroupeEvaluationEditDetailsDto.builder()
                .id(evaluation.getId())
                .label(evaluation.getLabel())
                .type(evaluation.getType())
                .description(evaluation.getDescription())
                .creationDate(evaluation.getCreationDate())
                .status(evaluation.getStatus().getDescription())
                .questionnaireId(evaluation.getQuestionnaire().getId())
                .participantIds(evaluation.getParticipantIds())
                .build();
    }

    @Override
    public void updateGroupeEvaluation(UUID evaluationId, UpdateGroupeEvaluationDto updateDto) {
        log.info("updateGroupeEvaluation evaluationId: {}, updateDto: {}", evaluationId, updateDto);

        Optional<GroupeEvaluation> evaluationOpt = groupeEvaluationRepo.findById(evaluationId);

        if (evaluationOpt.isEmpty()) {
            log.warn("GroupeEvaluation not found with id: {}", evaluationId);
            throw new RuntimeException("Évaluation non trouvée");
        }

        GroupeEvaluation evaluation = evaluationOpt.get();

        // Vérifier les permissions
        if (!evaluation.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
            log.warn("Access denied for evaluation: {}", evaluationId);
            throw new RuntimeException("Accès refusé");
        }

        // Vérifier que l'évaluation est modifiable (statut = DRAFT)
        if (evaluation.getStatus() != GroupeEvaluationStatusEnums.DRAFT) {
            log.warn("Cannot update evaluation with status: {}", evaluation.getStatus());
            throw new RuntimeException("Seules les évaluations en brouillon peuvent être modifiées");
        }

        // Vérifier que le questionnaire existe
        UUID questionnaireId = updateDto.getQuestionnaireId();
        Optional<Questionnaire> questionnaireOpt = questionnaireRepository.findById(questionnaireId);
        if (questionnaireOpt.isEmpty()) {
            log.warn("Questionnaire not found with id: {}", questionnaireId);
            throw new RuntimeException("Questionnaire non trouvé");
        }

        // Mettre à jour les champs
        evaluation.setLabel(updateDto.getLabel());
        evaluation.setType(updateDto.getType());
        evaluation.setQuestionnaire(questionnaireOpt.get());
        evaluation.setParticipantIds(updateDto.getParticipantIds());
        evaluation.setModificationDate(LocalDate.now());

        groupeEvaluationRepo.save(evaluation);
        log.info("GroupeEvaluation updated successfully: {}", evaluationId);
    }

// Méthodes utilitaires

    private int calculateProgress(List<UserResponse> responses, List<Question> questions) {
        if (questions.isEmpty()) {
            return 0;
        }

        Set<UUID> answeredQuestionIds = responses.stream()
                .map(UserResponse::getQuestionId)
                .collect(Collectors.toSet());

        long answeredCount = questions.stream()
                .map(Question::getId)
                .filter(answeredQuestionIds::contains)
                .count();

        return (int) ((answeredCount * 100) / questions.size());
    }

    private List<Map<String, Object>> convertQuestionsToProps(List<Question> questions) {
        return questions.stream()
                .map(question -> {
                    Map<String, Object> questionMap = new HashMap<>();
                    questionMap.put("id", question.getId().toString());
                    questionMap.put("companyId", question.getCompanyId().intValue());
                    questionMap.put("type", question.getType());
                    questionMap.put("text", question.getText());
                    questionMap.put("options", question.getOptions());
                    questionMap.put("levels", question.getLevels());
                    questionMap.put("scoreValue", question.getScoreValue() != null ? question.getScoreValue() : 0);
                    questionMap.put("ratingValue", question.getRatingValue() != null ? question.getRatingValue() : 0);
                    return questionMap;
                })
                .collect(Collectors.toList());
    }
}