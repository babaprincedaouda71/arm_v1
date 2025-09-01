package org.example.trainingservice.service.evaluations;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.dto.evaluation.*;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.entity.campaign.CampaignEvaluation;
import org.example.trainingservice.entity.campaign.Question;
import org.example.trainingservice.entity.campaign.Questionnaire;
import org.example.trainingservice.entity.campaign.UserResponse;
import org.example.trainingservice.entity.plan.evaluation.GroupeEvaluation;
import org.example.trainingservice.enums.EvaluationSource;
import org.example.trainingservice.enums.GroupeEvaluationStatusEnums;
import org.example.trainingservice.enums.NeedSource;
import org.example.trainingservice.enums.NeedStatusEnums;
import org.example.trainingservice.helper.plan.evaluation.EvaluationContext;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.repository.evaluation.CampaignEvaluationRepository;
import org.example.trainingservice.repository.evaluation.QuestionRepository;
import org.example.trainingservice.repository.evaluation.QuestionnaireRepository;
import org.example.trainingservice.repository.evaluation.UserResponseRepository;
import org.example.trainingservice.repository.plan.evaluation.GroupeEvaluationRepo;
import org.example.trainingservice.utils.EvaluationUtilMethods;
import org.example.trainingservice.utils.SecurityUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MyEvaluationsServiceImpl implements MyEvaluationsService {
    private final QuestionnaireRepository questionnaireRepository;
    private final CampaignEvaluationRepository campaignEvaluationRepository;
    private final UserResponseRepository userResponseRepository;
    private final QuestionRepository questionRepository;
    private final AuthServiceClient authServiceClient;
    private final NeedRepository needRepository;
    private final GroupeEvaluationRepo groupeEvaluationRepo;

    public MyEvaluationsServiceImpl(QuestionnaireRepository questionnaireRepository, CampaignEvaluationRepository campaignEvaluationRepository, UserResponseRepository userResponseRepository, QuestionRepository questionRepository, AuthServiceClient authServiceClient, NeedRepository needRepository, GroupeEvaluationRepo groupeEvaluationRepo) {
        this.questionnaireRepository = questionnaireRepository;
        this.campaignEvaluationRepository = campaignEvaluationRepository;
        this.userResponseRepository = userResponseRepository;
        this.questionRepository = questionRepository;
        this.authServiceClient = authServiceClient;
        this.needRepository = needRepository;
        this.groupeEvaluationRepo = groupeEvaluationRepo;
    }

//    @Override
//    public ResponseEntity<?> getMyEvaluations(Long userId) {
//        // liste des campagnes auxquelles appartient l'utilisateur
//        log.info("Fetching campaign evaluations for user with ID {}.", userId);
//        List<CampaignEvaluation> campaignEvaluations = campaignEvaluationRepository.findByParticipantIdsContainsAndStatus(userId, "Publiée");
//
//        // liste des questionnaires associés aux campagnes
//        log.info("Fetching questionnaires for campaign evaluations.");
//        List<Questionnaire> questionnaires = new ArrayList<>();
//        campaignEvaluations.forEach(campaignEvaluation -> {
//            questionnaires.addAll(campaignEvaluation.getQuestionnaires());
//        });
//
//        // Liste des evaluations du user
//        log.info("Fetching evaluations for user with ID {}.", userId);
//        List<MyEvaluationsDto> myEvaluationsDtos = new ArrayList<>();
//
//        questionnaires.forEach(questionnaire -> {
//            // Récupérer toutes les réponses de l'utilisateur pour ce questionnaire
//            List<UserResponse> userResponsesForQuestionnaireAndUser =
//                    userResponseRepository.findByUserIdAndQuestionnaireId(userId, questionnaire.getId());
//
//            // Récupérer le nombre total de questions du questionnaire
//            int totalQuestions = questionnaire.getQuestions().size();
//            int numberOfValidResponses = 0;
//
//            // Compter le nombre de réponses valides
//            for (UserResponse userResponse : userResponsesForQuestionnaireAndUser) {
//                switch (userResponse.getResponseType()) {
//                    case "Score":
//                        if (userResponse.getScoreResponse() != null) {
//                            numberOfValidResponses++;
//                        }
//                        break;
//                    case "Notation":
//                        if (userResponse.getRatingResponse() != null) {
//                            numberOfValidResponses++;
//                        }
//                        break;
//                    case "Texte":
//                        if (userResponse.getTextResponse() != null) {
//                            numberOfValidResponses++;
//                        }
//                        break;
//                    case "Commentaire":
//                        if (userResponse.getCommentResponse() != null) {
//                            numberOfValidResponses++;
//                        }
//                        break;
//                    case "Réponse multiple":
//                        if (userResponse.getMultipleChoiceResponse() != null && !userResponse.getMultipleChoiceResponse().isEmpty()) {
//                            numberOfValidResponses++;
//                        }
//                        break;
//                    case "Réponse unique":
//                        if (userResponse.getSingleChoiceResponse() != null) {
//                            numberOfValidResponses++;
//                        }
//                        break;
//                    case "Evaluation":
//                        if (userResponse.getSingleLevelChoiceResponse() != null) {
//                            numberOfValidResponses++;
//                        }
//                        // Nous traiterons ce cas plus tard
//                        break;
//                    default:
//                        log.warn("Type de réponse non géré : {}", userResponse.getResponseType());
//                        break;
//                }
//            }
//
//            // Calculer la progression
//            int progression = 0;
//            if (totalQuestions > 0) {
//                progression = (numberOfValidResponses * 100) / totalQuestions;
//            }
//
//            log.error("Progression: {}.", progression);
//
//            // Déterminer le statut
//            String status = "En attente";
//            LocalDate startDate = null;
//            if (progression > 0 && progression < 100) {
//                status = "En cours";
//                // On prend la date de la première réponse (valide ou non) comme date de début
//                if (!userResponsesForQuestionnaireAndUser.isEmpty()) {
//                    startDate = userResponsesForQuestionnaireAndUser.get(0).getStartDate();
//                }
//            } else if (progression == 100) {
//                status = "Terminée";
//                log.error("Status {}.", status);
//                if (!userResponsesForQuestionnaireAndUser.isEmpty()) {
//                    startDate = userResponsesForQuestionnaireAndUser.get(0).getStartDate();
//                }
//            }
//
//            // Nouvelle liste de questions pour chaque questionnaire
//            List<QuestionDto> questionDtos = new ArrayList<>();
//            questionnaire.getQuestions().forEach(question -> {
//                questionDtos.add(EvaluationUtilMethods.mapToQuestionDto(question));
//            });
//
//            MyEvaluationsDto myEvaluationsDto = MyEvaluationsDto.builder()
//                    .id(questionnaire.getId())
//                    .title(questionnaire.getTitle())
//                    .type(questionnaire.getType())
//                    .progress(progression)
//                    .status(status)
//                    .questions(questionDtos)
//                    .startDate(startDate != null ? startDate.toString() : "Pas encore")
//                    .build();
//
//            myEvaluationsDtos.add(myEvaluationsDto);
//        });
//        log.info("Returning {} evaluations for user with ID {}.", myEvaluationsDtos.size(), userId);
//        return ResponseEntity.ok().body(myEvaluationsDtos);
//    }

    @Override
    public ResponseEntity<?> getMyEvaluations(Long userId) {
        log.info("Fetching all evaluations (campaigns + groupe evaluations) for user with ID {}.", userId);

        List<MyEvaluationsDto> myEvaluationsDtos = new ArrayList<>();

        // 1. RÉCUPÉRER LES ÉVALUATIONS DES CAMPAGNES (logique existante)
        List<MyEvaluationsDto> campaignEvaluations = getCampaignEvaluations(userId);
        myEvaluationsDtos.addAll(campaignEvaluations);

        // 2. RÉCUPÉRER LES ÉVALUATIONS DES GROUPES (nouvelle logique)
        List<MyEvaluationsDto> groupeEvaluations = getGroupeEvaluations(userId);
        myEvaluationsDtos.addAll(groupeEvaluations);

        log.info("Returning {} total evaluations for user with ID {}.", myEvaluationsDtos.size(), userId);
        return ResponseEntity.ok().body(myEvaluationsDtos);
    }

    // MÉTHODE PRIVÉE pour les évaluations de campagne (logique existante refactorisée)
    private List<MyEvaluationsDto> getCampaignEvaluations(Long userId) {
        List<MyEvaluationsDto> campaignEvaluationDtos = new ArrayList<>();

        // Récupérer les campagnes auxquelles l'utilisateur participe
        List<CampaignEvaluation> campaignEvaluations = campaignEvaluationRepository
                .findByParticipantIdsContainsAndStatus(userId, "Publiée");

        // Récupérer tous les questionnaires des campagnes
        List<Questionnaire> questionnaires = new ArrayList<>();
        campaignEvaluations.forEach(campaignEvaluation -> {
            questionnaires.addAll(campaignEvaluation.getQuestionnaires());
        });

        // Traiter chaque questionnaire
        questionnaires.forEach(questionnaire -> {
            MyEvaluationsDto dto = processQuestionnaireForUser(userId, questionnaire, EvaluationSource.CAMPAIGN);
            if (dto != null) {
                dto.setCategory("Campagne"); // Identifier la source
                campaignEvaluationDtos.add(dto);
            }
        });

        return campaignEvaluationDtos;
    }

    // NOUVELLE MÉTHODE pour les évaluations de groupe
    private List<MyEvaluationsDto> getGroupeEvaluations(Long userId) {
        List<MyEvaluationsDto> groupeEvaluationDtos = new ArrayList<>();

        // Récupérer toutes les GroupeEvaluation où l'utilisateur est participant
        List<GroupeEvaluation> groupeEvaluations = groupeEvaluationRepo.findAll().stream()
                .filter(ge -> ge.getParticipantIds() != null && ge.getParticipantIds().contains(userId))
                .filter(ge -> ge.getStatus() == GroupeEvaluationStatusEnums.PUBLISHED) // Seulement les publiées
                .toList();

        // Traiter chaque GroupeEvaluation
        groupeEvaluations.forEach(groupeEvaluation -> {
            Questionnaire questionnaire = groupeEvaluation.getQuestionnaire();
            if (questionnaire != null) {
                MyEvaluationsDto dto = processQuestionnaireForUser(userId, questionnaire, EvaluationSource.GROUPE_EVALUATION);
                if (dto != null) {
                    dto.setCategory("Formation"); // Identifier la source
                    // Peut-être ajouter des infos spécifiques au groupe
                    dto.setTitle(groupeEvaluation.getLabel() + " - " + questionnaire.getTitle());
                    groupeEvaluationDtos.add(dto);
                }
            }
        });

        return groupeEvaluationDtos;
    }

    // MÉTHODE UTILITAIRE pour traiter un questionnaire pour un utilisateur (VERSION AVANCÉE)
    private MyEvaluationsDto processQuestionnaireForUser(Long userId, Questionnaire questionnaire, EvaluationSource source) {
        // Récupérer les réponses selon la source
        List<UserResponse> userResponses = userResponseRepository
                .findByUserIdAndQuestionnaireIdAndEvaluationSource(userId, questionnaire.getId(), source);

        // Calculer la progression et le statut (logique existante)
        int totalQuestions = questionnaire.getQuestions().size();
        int numberOfValidResponses = calculateValidResponses(userResponses);

        int progression = totalQuestions > 0 ? (numberOfValidResponses * 100) / totalQuestions : 0;

        String status = "En attente";
        LocalDate startDate = null;
        Boolean isEvaluationSent = false;

        if (progression > 0 && progression < 100) {
            status = "En cours";
            if (!userResponses.isEmpty()) {
                startDate = userResponses.get(0).getStartDate();
                isEvaluationSent = determineIfEvaluationIsSent(userResponses.get(0), userId);
            }
        } else if (progression == 100) {
            status = "Terminée";
            if (!userResponses.isEmpty()) {
                startDate = userResponses.get(0).getStartDate();
                isEvaluationSent = determineIfEvaluationIsSent(userResponses.get(0), userId);
            }
        }

        // Créer la liste des questions
        List<QuestionDto> questionDtos = new ArrayList<>();
        questionnaire.getQuestions().forEach(question -> {
            questionDtos.add(EvaluationUtilMethods.mapToQuestionDto(question));
        });

        return MyEvaluationsDto.builder()
                .id(questionnaire.getId())
                .title(questionnaire.getTitle())
                .type(questionnaire.getType())
                .progress(progression)
                .status(status)
                .questions(questionDtos)
                .startDate(startDate != null ? startDate.toString() : "Pas encore")
                .description(questionnaire.getDescription())
                .isSentToManager(isEvaluationSent) // Utiliser le statut calculé
                .build();
    }

    // NOUVELLE MÉTHODE pour déterminer si l'évaluation a été envoyée selon le rôle
    private Boolean determineIfEvaluationIsSent(UserResponse userResponse, Long userId) {
        try {
            // Récupérer le rôle de l'utilisateur
            UserDto userDto = authServiceClient.getUserById(userId);
            if (userDto == null) {
                log.warn("Utilisateur non trouvé avec l'ID: {}. Impossible de déterminer le statut d'envoi.", userId);
                return false;
            }

            String userRole = userDto.getRole();

            // Retourner le bon statut selon le rôle
            if ("Collaborateur".equals(userRole)) {
                return userResponse.getIsSentToManager() != null ? userResponse.getIsSentToManager() : false;
            } else if ("Manager".equals(userRole)) {
                return userResponse.getIsSentToAdmin() != null ? userResponse.getIsSentToAdmin() : false;
            } else {
                log.warn("Rôle utilisateur '{}' non géré pour l'utilisateur {}.", userRole, userId);
                return false;
            }
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du rôle pour l'utilisateur {}: {}", userId, e.getMessage());
            return false;
        }
    }

    // MÉTHODE UTILITAIRE pour calculer les réponses valides (logique existante extraite)
    private int calculateValidResponses(List<UserResponse> userResponses) {
        int numberOfValidResponses = 0;

        for (UserResponse userResponse : userResponses) {
            switch (userResponse.getResponseType()) {
                case "Score":
                    if (userResponse.getScoreResponse() != null) numberOfValidResponses++;
                    break;
                case "Notation":
                    if (userResponse.getRatingResponse() != null) numberOfValidResponses++;
                    break;
                case "Texte":
                    if (userResponse.getTextResponse() != null) numberOfValidResponses++;
                    break;
                case "Commentaire":
                    if (userResponse.getCommentResponse() != null) numberOfValidResponses++;
                    break;
                case "Réponse multiple":
                    if (userResponse.getMultipleChoiceResponse() != null && !userResponse.getMultipleChoiceResponse().isEmpty()) {
                        numberOfValidResponses++;
                    }
                    break;
                case "Réponse unique":
                    if (userResponse.getSingleChoiceResponse() != null) numberOfValidResponses++;
                    break;
                case "Evaluation":
                    if (userResponse.getSingleLevelChoiceResponse() != null) numberOfValidResponses++;
                    break;
                default:
                    log.warn("Type de réponse non géré : {}", userResponse.getResponseType());
                    break;
            }
        }

        return numberOfValidResponses;
    }

    @Override
    public ResponseEntity<?> addUserResponse(UUID questionnaireId, List<AddUserResponseDto> addUserResponseDtos) {
        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
                .orElseThrow(() -> new RuntimeException("Questionnaire non trouvé"));

        // ÉTAPE CRITIQUE : Déterminer la source ET l'ID de l'évaluation
        EvaluationContext evaluationContext = determineEvaluationContext(questionnaireId, addUserResponseDtos.get(0).getUserId());

        List<UserResponse> responsesToSave = new ArrayList<>();
        int numberOfQuestions = questionnaire.getQuestions().size();
        int numberOfValidResponses = 0;

        log.info("Processing responses for questionnaire {} with source {} and context {}",
                questionnaireId, evaluationContext.getSource(), evaluationContext.getEvaluationId());

        for (AddUserResponseDto addUserResponseDto : addUserResponseDtos) {
            boolean hasValidResponse = validateResponse(addUserResponseDto);
            if (hasValidResponse) {
                numberOfValidResponses++;
            }

            // Vérifier si une réponse existe déjà
            UserResponse existingResponse = findExistingUserResponse(
                    addUserResponseDto.getUserId(),
                    questionnaireId,
                    addUserResponseDto.getQuestionId(),
                    evaluationContext);

            int progression = (numberOfQuestions > 0) ? (numberOfValidResponses * 100) / numberOfQuestions : 0;

            UserResponse.UserResponseBuilder builder;
            if (existingResponse != null) {
                builder = existingResponse.toBuilder()
                        .lastModifiedDate(LocalDate.now())
                        .progression(progression);
            } else {
                builder = UserResponse.builder()
                        .userId(addUserResponseDto.getUserId())
                        .isSentToManager(false)
                        .isSentToAdmin(false)
                        .companyId(SecurityUtils.getCurrentCompanyId())
                        .questionnaireId(questionnaireId)
                        .questionId(addUserResponseDto.getQuestionId())
                        .startDate(LocalDate.now())
                        .progression(progression)
                        .responseType(addUserResponseDto.getResponseType())
                        .evaluationSource(evaluationContext.getSource()); // CRITIQUE

                // CRITIQUE : Définir les IDs selon la source
                if (evaluationContext.getSource() == EvaluationSource.CAMPAIGN) {
                    builder.campaignEvaluationId(evaluationContext.getEvaluationId());
                } else {
                    builder.groupeEvaluationId(evaluationContext.getEvaluationId());
                }
            }

            // Définir les valeurs de réponse selon le type
            setResponseValues(builder, addUserResponseDto);

            // Définir le statut
            if (progression == 100) {
                builder.status("Terminée");
            } else if (progression < 100 && progression > 0) {
                builder.status("En cours");
            } else {
                builder.status(existingResponse != null ? existingResponse.getStatus() : "En attente");
            }

            responsesToSave.add(builder.build());
        }

        userResponseRepository.saveAll(responsesToSave);
        log.info("Saved {} responses for evaluation context {}", responsesToSave.size(), evaluationContext);

        return ResponseEntity.ok("Réponses utilisateur enregistrées avec succès.");
    }

    // MÉTHODE UTILITAIRE pour déterminer la source d'évaluation
    private EvaluationContext determineEvaluationContext(UUID questionnaireId, Long userId) {
        // 1. Vérifier les campagnes d'abord
        List<CampaignEvaluation> campaigns = campaignEvaluationRepository.findByParticipantIdsContains(userId);
        for (CampaignEvaluation campaign : campaigns) {
            boolean questionnaireFound = campaign.getQuestionnaires().stream()
                    .anyMatch(q -> q.getId().equals(questionnaireId));
            if (questionnaireFound) {
                log.info("Found campaign evaluation {} for user {} and questionnaire {}",
                        campaign.getId(), userId, questionnaireId);
                return new EvaluationContext(EvaluationSource.CAMPAIGN, campaign.getId());
            }
        }

        // 2. Vérifier les GroupeEvaluation
        List<GroupeEvaluation> groupeEvaluations = groupeEvaluationRepo.findAll().stream()
                .filter(ge -> ge.getParticipantIds() != null && ge.getParticipantIds().contains(userId))
                .filter(ge -> ge.getQuestionnaire() != null && ge.getQuestionnaire().getId().equals(questionnaireId))
                .collect(Collectors.toList());

        if (!groupeEvaluations.isEmpty()) {
            GroupeEvaluation groupeEvaluation = groupeEvaluations.get(0); // Prendre le premier
            log.info("Found groupe evaluation {} for user {} and questionnaire {}",
                    groupeEvaluation.getId(), userId, questionnaireId);
            return new EvaluationContext(EvaluationSource.GROUPE_EVALUATION, groupeEvaluation.getId());
        }

        // 3. Par défaut, considérer comme campagne (pour compatibilité)
        log.warn("No specific evaluation found for user {} and questionnaire {}. Defaulting to CAMPAIGN.",
                userId, questionnaireId);
        return new EvaluationContext(EvaluationSource.CAMPAIGN, null);
    }


    private UserResponse findExistingUserResponse(Long userId, UUID questionnaireId, UUID questionId, EvaluationContext context) {
        // Chercher d'abord par la méthode existante
        Optional<UserResponse> existing = userResponseRepository.findByUserIdAndQuestionnaireIdAndQuestionId(
                userId, questionnaireId, questionId);

        if (existing.isPresent()) {
            UserResponse response = existing.get();
            // Vérifier si elle correspond au contexte
            if (context.getSource() == EvaluationSource.CAMPAIGN &&
                    (response.getCampaignEvaluationId() != null || response.getEvaluationSource() == EvaluationSource.CAMPAIGN)) {
                return response;
            } else if (context.getSource() == EvaluationSource.GROUPE_EVALUATION &&
                    (response.getGroupeEvaluationId() != null || response.getEvaluationSource() == EvaluationSource.GROUPE_EVALUATION)) {
                return response;
            }
        }

        return null;
    }

    // MÉTHODES UTILITAIRES pour la validation et l'assignation des valeurs
    private boolean validateResponse(AddUserResponseDto dto) {
        switch (dto.getResponseType()) {
            case "Score": return dto.getScoreResponse() != null;
            case "Notation": return dto.getRatingResponse() != null;
            case "Texte": return dto.getTextResponse() != null;
            case "Commentaire": return dto.getCommentResponse() != null;
            case "Réponse multiple": return dto.getMultipleChoiceResponse() != null && !dto.getMultipleChoiceResponse().isEmpty();
            case "Réponse unique": return dto.getSingleChoiceResponse() != null;
            default: return false;
        }
    }

    private void setResponseValues(UserResponse.UserResponseBuilder builder, AddUserResponseDto dto) {
        switch (dto.getResponseType()) {
            case "Score": builder.scoreResponse(dto.getScoreResponse()); break;
            case "Notation": builder.ratingResponse(dto.getRatingResponse()); break;
            case "Texte": builder.textResponse(dto.getTextResponse()); break;
            case "Commentaire": builder.commentResponse(dto.getCommentResponse()); break;
            case "Réponse multiple": builder.multipleChoiceResponse(dto.getMultipleChoiceResponse()); break;
            case "Réponse unique": builder.singleChoiceResponse(dto.getSingleChoiceResponse()); break;
        }
    }

    @Override
    public ResponseEntity<?> getAllUserResponses(Long userId, UUID questionnaireId) {
        List<GetUserResponsesDto> getUserResponsesDtos = new ArrayList<>();
        List<UserResponse> userResponses = userResponseRepository.findByUserIdAndQuestionnaireId(userId, questionnaireId);
        userResponses.forEach(userResponse -> {
            getUserResponsesDtos.add(EvaluationUtilMethods.mapToGetUserResponsesDto(userResponse));
        });
        return ResponseEntity.ok().body(getUserResponsesDtos);
    }

//    @Override
//    public ResponseEntity<?> sendEvaluation(UUID id, SendEvaluationDto sendEvaluationDto) {
//        // Récupérer les réponses de l'utilisateur
//        List<UserResponse> userResponses = userResponseRepository.findByUserIdAndQuestionnaireId(
//                sendEvaluationDto.getUserId(),
//                id
//        );
//
//        if (userResponses.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        // Récupérer les informations de l'utilisateur via Feign
//        UserDto user = authServiceClient.getUserById(sendEvaluationDto.getUserId());
//
//        // Vérifier le rôle et mettre à jour les champs correspondants
//        userResponses.forEach(userResponse -> {
//            if ("Collaborateur".equals(user.getRole())) {
//                userResponse.setIsSentToManager(true);
//            } else if ("Manager".equals(user.getRole())) {
//                userResponse.setIsSentToAdmin(true);
//            }
//            // Vous pourriez ajouter un else pour gérer d'autres rôles si nécessaire
//        });
//
//        // Sauvegarder les modifications
//        userResponseRepository.saveAll(userResponses);
//
//        return ResponseEntity.ok().build();
//    }

    @Override
    public ResponseEntity<?> sendEvaluation(UUID questionnaireUuid, SendEvaluationDto sendEvaluationDto) {
        Long userId = sendEvaluationDto.getUserId();

        // Étape 1: Récupérer les réponses de l'utilisateur pour le questionnaire donné
        List<UserResponse> userResponses = userResponseRepository.findByUserIdAndQuestionnaireId(
                userId,
                questionnaireUuid
        );

        if (userResponses.isEmpty()) {
            // log.warn("Aucune réponse utilisateur trouvée pour l'utilisateur {} et le questionnaire {}", userId, questionnaireUuid);
            System.out.println("Aucune réponse utilisateur trouvée pour l'utilisateur " + userId +
                    " et le questionnaire " + questionnaireUuid);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune réponse utilisateur trouvée pour cet utilisateur et ce questionnaire.");
        }

        // Étape 2: Récupérer les informations de l'utilisateur (notamment son rôle)
        UserDto userDto = authServiceClient.getUserById(userId);
        if (userDto == null) {
            // log.error("Utilisateur non trouvé avec l'ID: {}. Impossible de traiter l'envoi de l'évaluation.", userId);
            System.err.println("Utilisateur non trouvé avec l'ID: " + userId + ". Impossible de traiter l'envoi de l'évaluation.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
        }
        String userRole = userDto.getRole();

        // Étape 3: Mettre à jour les UserResponses en fonction du rôle
        boolean requiresSave = false;
        final LocalDate nowDate = LocalDate.now(); // Pour la cohérence de la date de modification

        if ("Collaborateur".equals(userRole)) {
            for (UserResponse ur : userResponses) {
                if (!Boolean.TRUE.equals(ur.getIsSentToManager())) {
                    ur.setIsSentToManager(true);
                    ur.setLastModifiedDate(nowDate);
                    requiresSave = true;
                }
            }
        } else if ("Manager".equals(userRole)) {
            for (UserResponse ur : userResponses) {
                if (!Boolean.TRUE.equals(ur.getIsSentToAdmin())) {
                    ur.setIsSentToAdmin(true);
                    ur.setLastModifiedDate(nowDate);
                    requiresSave = true;
                }
            }
        } else {
            // log.warn("Rôle utilisateur '{}' non géré pour l'utilisateur {}. Aucune action d'envoi spécifique effectuée.", userRole, userId);
            System.out.println("Rôle utilisateur '" + userRole + "' non géré pour l'utilisateur " + userId + ". Aucune action d'envoi spécifique effectuée.");
            // Selon votre logique, vous pourriez retourner une erreur ici ou simplement ne rien faire de plus.
        }

        if (requiresSave) {
            userResponseRepository.saveAll(userResponses);
            // log.info("UserResponses mises à jour pour l'utilisateur {} et le questionnaire {}", userId, questionnaireUuid);
            System.out.println("UserResponses mises à jour pour l'utilisateur " + userId + " et le questionnaire " + questionnaireUuid);
        }

        // Étape 4: Si l'utilisateur est "Manager", tenter de créer un "Besoin" (Need)
        String operationStatusMessage = "Évaluation envoyée.";

        if ("Manager".equals(userRole)) {
            // log.info("L'utilisateur {} est un Manager. Tentative de création de Besoin pour le questionnaire {}.", userId, questionnaireUuid);
            System.out.println("L'utilisateur " + userId + " est un Manager. Tentative de création de Besoin pour le questionnaire " + questionnaireUuid + ".");

            Optional<Questionnaire> questionnaireOpt = questionnaireRepository.findById(questionnaireUuid);

            if (questionnaireOpt.isEmpty()) {
                // log.warn("Questionnaire non trouvé avec l'ID: {}. La création de Besoin est annulée pour l'utilisateur {}.", questionnaireUuid, userId);
                System.err.println("Questionnaire non trouvé avec l'ID: " + questionnaireUuid + ". La création de Besoin est annulée pour l'utilisateur " + userId + ".");
                // Ne pas retourner une erreur ici, car la mise à jour de UserResponse a pu réussir.
                // Le message de retour final indiquera le succès partiel.
                operationStatusMessage += " Cependant, le questionnaire n'a pas été trouvé pour la création de Besoin.";
            } else {
                Questionnaire questionnaire = questionnaireOpt.get();
                if ("Récensement des besoins de formation".equals(questionnaire.getType())) {
                    // log.info("Le questionnaire '{}' est de type 'Récensement des besoins de formation'. Recherche de la question 'Thème'.", questionnaire.getTitle());
                    System.out.println("Le questionnaire '" + questionnaire.getTitle() + "' est de type 'Récensement des besoins de formation'. Recherche de la question 'Thème'.");

                    Question themeQuestionDefinition = questionnaire.getQuestions().stream()
                            .filter(q -> "Thème".equals(q.getText())) // Sensible à la casse et au texte exact
                            .findFirst()
                            .orElse(null);

                    if (themeQuestionDefinition == null) {
                        // log.warn("Question 'Thème' non trouvée dans le questionnaire '{}' (ID: {}). Création de Besoin annulée pour l'utilisateur {}.", questionnaire.getTitle(), questionnaireUuid, userId);
                        System.out.println("Attention: La question 'Thème' n'a pas été trouvée dans le questionnaire '" +
                                questionnaire.getTitle() + "'. Impossible de créer des Besoins pour l'utilisateur " + userId);
                        operationStatusMessage += " La question 'Thème' est introuvable dans le questionnaire, le Besoin n'a pas été créé.";
                    } else {
                        UUID themeQuestionId = themeQuestionDefinition.getId();
                        String themeQuestionType = themeQuestionDefinition.getType();
                        // log.debug("Question 'Thème' trouvée (ID: {}, Type: {}). Recherche de la réponse de l'utilisateur {}.", themeQuestionId, themeQuestionType, userId);
                        System.out.println("Question 'Thème' trouvée (ID: " + themeQuestionId + ", Type: " + themeQuestionType + "). Recherche de la réponse de l'utilisateur " + userId + ".");


                        // Les `userResponses` contiennent toutes les réponses de l'utilisateur pour ce questionnaire.
                        // Filtrons pour trouver la réponse à la question "Thème".
                        UserResponse themeUserResponse = userResponses.stream()
                                .filter(ur -> themeQuestionId.equals(ur.getQuestionId()))
                                .findFirst()
                                .orElse(null);

                        String themeValue = null;
                        if (themeUserResponse != null) {
                            // log.debug("Réponse à la question 'Thème' trouvée pour l'utilisateur {}. Extraction de la valeur.", userId);
                            System.out.println("Réponse à la question 'Thème' trouvée pour l'utilisateur " + userId + ". Extraction de la valeur.");
                            switch (themeQuestionType) {
                                case "Texte":
                                    themeValue = themeUserResponse.getTextResponse();
                                    break;
                                case "Réponse unique":
                                    themeValue = themeUserResponse.getSingleChoiceResponse();
                                    break;
                                case "Réponse multiple":
                                    if (themeUserResponse.getMultipleChoiceResponse() != null && !themeUserResponse.getMultipleChoiceResponse().isEmpty()) {
                                        themeValue = String.join(", ", themeUserResponse.getMultipleChoiceResponse());
                                    }
                                    break;
                                default:
                                    // log.warn("Type de question non géré ('{}') pour la question 'Thème' (ID: {}). Tentative d'extraction depuis les champs communs pour l'utilisateur {}.", themeQuestionType, themeQuestionId, userId);
                                    System.out.println("Attention: Type de question non géré ('" + themeQuestionType +
                                            "') pour la question 'Thème'. Tentative d'extraction depuis les champs communs pour l'utilisateur " + userId);
                                    if (themeUserResponse.getTextResponse() != null && !themeUserResponse.getTextResponse().isEmpty()) {
                                        themeValue = themeUserResponse.getTextResponse();
                                    } else if (themeUserResponse.getSingleChoiceResponse() != null && !themeUserResponse.getSingleChoiceResponse().isEmpty()) {
                                        themeValue = themeUserResponse.getSingleChoiceResponse();
                                    }
                                    break;
                            }
                            if (themeValue != null) themeValue = themeValue.trim();
                        }

                        if (themeValue == null || themeValue.isEmpty()) {
                            // log.warn("Réponse au 'Thème' non trouvée ou vide pour l'utilisateur {} et la question {} (ID: {}). Création de Besoin annulée.", userId, themeQuestionDefinition.getText(), themeQuestionId);
                            System.out.println("Attention: Réponse au 'Thème' non trouvée ou vide pour l'utilisateur " + userId +
                                    " et la question " + themeQuestionId + ". Création de Besoin annulée.");
                            operationStatusMessage += " La réponse à la question 'Thème' est vide ou non trouvée, le Besoin n'a pas été créé.";
                        } else {
                            // log.info("Réponse au 'Thème' ('{}') trouvée pour l'utilisateur {}. Création du Besoin.", themeValue, userId);
                            System.out.println("Réponse au 'Thème' ('" + themeValue + "') trouvée pour l'utilisateur " + userId + ". Création du Besoin.");

                            String requesterName = userDto.getName(); // Assurez-vous que UserDto a une méthode getName() ou un champ équivalent
                            Long approverId = userDto.getManagerId();   // Assurez-vous que UserDto a une méthode getManagerId() ou un champ équivalent
                            Long companyId = questionnaire.getCompanyId(); // Ou themeUserResponse.getCompanyId() si pertinent

                            Need need = Need.builder()
                                    .requesterId(userId)
                                    .requesterName(requesterName)
                                    .approverId(approverId)
                                    .source(NeedSource.Evaluation) // Assurez-vous que cet enum existe et est correctement importé
                                    .creationDate(DateTimeFormatter.ISO_LOCAL_DATE.format(nowDate)) // Format "YYYY-MM-DD"
                                    .type("Evaluation") // Ou un autre type si nécessaire
                                    .theme(themeValue)
                                    .questionnaire(questionnaire.getTitle())
                                    .companyId(companyId)
                                    .status(NeedStatusEnums.DRAFT) // Assurez-vous que cet enum existe et est correctement importé
                                    // Initialisez les autres champs requis de "Need" avec des valeurs par défaut ou null si permis
                                    .build();

                            needRepository.save(need);
                            // log.info("Besoin (Need) créé avec succès pour l'utilisateur {} avec le thème: {}. ID du Besoin: {}", userId, themeValue, need.getId());
                            System.out.println("Besoin (Need) créé pour l'utilisateur " + userId + " avec le thème: " + themeValue);
                            operationStatusMessage += " Un Besoin a été créé avec succès.";
                        }
                    }
                } else {
                    // log.info("Le questionnaire '{}' (ID: {}) n'est pas de type 'Récensement des besoins de formation'. Aucune création de Besoin.", questionnaire.getTitle(), questionnaireUuid);
                    System.out.println("Le questionnaire '" + questionnaire.getTitle() + "' n'est pas de type 'Récensement des besoins de formation'. Aucune création de Besoin.");
                    operationStatusMessage += " Le questionnaire n'est pas du type requis pour la création de Besoin.";
                }
            }
        }

        return ResponseEntity.ok().body(operationStatusMessage);
    }

    @Override
    public ResponseEntity<?> getAllUserQuestionsResponses(Long userId, UUID questionnaireId) {
        UserQuestionsResponsesDto userQuestionsResponsesDtos = new UserQuestionsResponsesDto();


        List<GetUserResponsesDto> getUserResponsesDtos = new ArrayList<>();

        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId).get();


        List<Question> questions = questionnaire.getQuestions();

        List<QuestionDto> questionDtos = new ArrayList<>();

        questions.forEach(question -> {
            questionDtos.add(EvaluationUtilMethods.mapToQuestionDto(question));
        });

        List<UserResponse> userResponses = userResponseRepository.findByUserIdAndQuestionnaireId(userId, questionnaireId);
        userResponses.forEach(userResponse -> {
            getUserResponsesDtos.add(EvaluationUtilMethods.mapToGetUserResponsesDto(userResponse));
        });

        // Récupérer le nombre total de questions du questionnaire
        int totalQuestions = questionnaire.getQuestions().size();
        int numberOfValidResponses = 0;

        // Compter le nombre de réponses valides
        for (UserResponse userResponse : userResponses) {
            switch (userResponse.getResponseType()) {
                case "Score":
                    if (userResponse.getScoreResponse() != null) {
                        numberOfValidResponses++;
                    }
                    break;
                case "Notation":
                    if (userResponse.getRatingResponse() != null) {
                        numberOfValidResponses++;
                    }
                    break;
                case "Texte":
                    if (userResponse.getTextResponse() != null) {
                        numberOfValidResponses++;
                    }
                    break;
                case "Commentaire":
                    if (userResponse.getCommentResponse() != null) {
                        numberOfValidResponses++;
                    }
                    break;
                case "Réponse multiple":
                    if (userResponse.getMultipleChoiceResponse() != null && !userResponse.getMultipleChoiceResponse().isEmpty()) {
                        numberOfValidResponses++;
                    }
                    break;
                case "Réponse unique":
                    if (userResponse.getSingleChoiceResponse() != null) {
                        numberOfValidResponses++;
                    }
                    break;
                case "Evaluation":
                    if (userResponse.getSingleLevelChoiceResponse() != null) {
                        numberOfValidResponses++;
                    }
                    // Nous traiterons ce cas plus tard
                    break;
                default:
                    log.warn("Type de réponse non géré : {}", userResponse.getResponseType());
                    break;
            }
        }

        // Calculer la progression
        int progression = 0;
        if (totalQuestions > 0) {
            progression = (numberOfValidResponses * 100) / totalQuestions;
        }

        userQuestionsResponsesDtos.setId(questionnaireId);
        userQuestionsResponsesDtos.setTitle(questionnaire.getTitle());
        userQuestionsResponsesDtos.setType(questionnaire.getType());
        userQuestionsResponsesDtos.setDescription(questionnaire.getDescription() != null ? questionnaire.getDescription() : "");
        userQuestionsResponsesDtos.setQuestions(questionDtos);
        userQuestionsResponsesDtos.setResponses(getUserResponsesDtos);
        userQuestionsResponsesDtos.setCreationDate(questionnaire.getCreationDate().toString());
        userQuestionsResponsesDtos.setProgress(progression);
        return ResponseEntity.ok().body(userQuestionsResponsesDtos);
    }
}