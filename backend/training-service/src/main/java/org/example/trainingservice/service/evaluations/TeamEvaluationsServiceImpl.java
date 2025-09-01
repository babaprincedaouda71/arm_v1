package org.example.trainingservice.service.evaluations;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.cacheService.UserCacheService;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.dto.evaluation.*;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.entity.campaign.CampaignEvaluation;
import org.example.trainingservice.entity.campaign.Question;
import org.example.trainingservice.entity.campaign.Questionnaire;
import org.example.trainingservice.entity.campaign.UserResponse;
import org.example.trainingservice.entity.plan.evaluation.GroupeEvaluation;
import org.example.trainingservice.enums.*;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.repository.evaluation.CampaignEvaluationRepository;
import org.example.trainingservice.repository.evaluation.QuestionnaireRepository;
import org.example.trainingservice.repository.evaluation.UserResponseRepository;
import org.example.trainingservice.repository.plan.evaluation.GroupeEvaluationRepo;
import org.example.trainingservice.utils.EvaluationUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TeamEvaluationsServiceImpl implements TeamEvaluationsService {
    private final QuestionnaireRepository questionnaireRepository;
    private final AuthServiceClient authServiceClient;
    private final CampaignEvaluationRepository campaignEvaluationRepository;
    private final UserResponseRepository userResponseRepository;
    private final NeedRepository needRepository;
    private final UserCacheService userCacheService;
    private final GroupeEvaluationRepo groupeEvaluationRepo;

    public TeamEvaluationsServiceImpl(QuestionnaireRepository questionnaireRepository, AuthServiceClient authServiceClient, CampaignEvaluationRepository campaignEvaluationRepository, UserResponseRepository userResponseRepository, NeedRepository needRepository, UserCacheService userCacheService, GroupeEvaluationRepo groupeEvaluationRepo) {
        this.questionnaireRepository = questionnaireRepository;
        this.authServiceClient = authServiceClient;
        this.campaignEvaluationRepository = campaignEvaluationRepository;
        this.userResponseRepository = userResponseRepository;
        this.needRepository = needRepository;
        this.userCacheService = userCacheService;
        this.groupeEvaluationRepo = groupeEvaluationRepo;
    }

//    @Override
//    public ResponseEntity<List<GetTeamEvaluationsDto>> getTeamEvaluations(Long managerId) {
//        List<Long> myTeamIds = authServiceClient.getMyTeam(managerId);
//        List<GetTeamEvaluationsDto> teamEvaluationDtos = new ArrayList<>();
//
//        if (myTeamIds != null && !myTeamIds.isEmpty()) {
//            List<CampaignEvaluation> campaignEvaluations = campaignEvaluationRepository.findByAnyParticipantIdInAndStatus(myTeamIds, "Publiée");
//
//            for (CampaignEvaluation campaignEvaluation : campaignEvaluations) {
//                for (Questionnaire questionnaire : campaignEvaluation.getQuestionnaires()) {
//                    // Récupérer les réponses des membres de l'équipe pour CE QUESTIONNAIRE
//                    List<UserResponse> teamResponsesForQuestionnaire = userResponseRepository.findByQuestionnaireIdAndUserIdIn(questionnaire.getId(), myTeamIds);
//
//                    // Calculer l'état global pour ce questionnaire pour l'équipe
//                    String globalStatus = calculateGlobalStatusForTeam(teamResponsesForQuestionnaire);
//
//                    // Calculer l'avancement global moyen pour ce questionnaire pour l'équipe
//                    Integer globalProgress = calculateGlobalProgressForTeam(teamResponsesForQuestionnaire);
//
//                    GetTeamEvaluationsDto dto = GetTeamEvaluationsDto.builder()
//                            .id(questionnaire.getId())
//                            .title(questionnaire.getTitle())
//                            .status(globalStatus)
//                            .creationDate(questionnaire.getCreationDate().toString())
//                            .type(questionnaire.getType())
//                            .participants(myTeamIds.size()) // Nombre total de membres de l'équipe
//                            .progress(globalProgress)
//                            .build();
//
//                    teamEvaluationDtos.add(dto);
//                }
//            }
//        }
//
//        return ResponseEntity.ok(teamEvaluationDtos);
//    }
//
//    private String calculateGlobalStatusForTeam(List<UserResponse> userResponses) {
//        if (userResponses.isEmpty()) {
//            return "En attente";
//        }
//        boolean allTerminated = userResponses.stream().allMatch(response -> "Terminée".equalsIgnoreCase(response.getStatus()));
//        if (allTerminated) {
//            return "Terminé";
//        }
//        boolean anyInProgress = userResponses.stream().anyMatch(response -> "En cours".equalsIgnoreCase(response.getStatus()));
//        if (anyInProgress) {
//            return "En cours";
//        }
//        return "En attente";
//    }
//
//    private Integer calculateGlobalProgressForTeam(List<UserResponse> userResponses) {
//        if (userResponses.isEmpty()) {
//            return 0;
//        }
//
//        // Map pour stocker la progression maximale par utilisateur
//        Map<Long, Integer> maxProgressByUser = new HashMap<>();
//
//        // Pour chaque réponse, on garde le progrès le plus élevé par utilisateur
//        for (UserResponse response : userResponses) {
//            Long userId = response.getUserId();
//            Integer progression = response.getProgression();
//
//            if (progression != null) {
//                // Si l'utilisateur n'existe pas encore dans la map ou si sa progression actuelle est supérieure
//                if (!maxProgressByUser.containsKey(userId) || progression > maxProgressByUser.get(userId)) {
//                    maxProgressByUser.put(userId, progression);
//                }
//            }
//        }
//
//        // Calculer la moyenne des progressions maximales
//        if (maxProgressByUser.isEmpty()) {
//            return 0;
//        }
//
//        double averageProgress = maxProgressByUser.values().stream()
//                .mapToInt(Integer::intValue)
//                .average()
//                .orElse(0);
//
//        return (int) Math.round(averageProgress);
//    }
//
//
//    @Override
//    public ResponseEntity<?> getTeamEvaluationDetails(UUID questionnaireId, Long managerId) {
//        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
//                .orElseThrow(() -> new RuntimeException("Questionnaire non trouvé"));
//
//        List<Long> myTeamIds = authServiceClient.getMyTeam(managerId);
//        log.error("My team IDs : {}.", myTeamIds); // Conservez ou ajustez le logging selon vos besoins
//        List<TeamEvaluationDetailsForUserDto> participantsDetails = new ArrayList<>();
//        List<UserResponse> allTeamResponsesForQuestionnaire = userResponseRepository.findByQuestionnaireIdAndUserIdIn(questionnaireId, myTeamIds);
//
//        if (myTeamIds != null && !myTeamIds.isEmpty()) {
//            log.info("Traitement des détails d'évaluation pour le questionnaire {} pour {} participants.", questionnaireId, myTeamIds.size()); // Log amélioré
//
//            for (Long userId : myTeamIds) {
//                // Filtrer les réponses pour l'utilisateur courant
//                List<UserResponse> userResponses = allTeamResponsesForQuestionnaire.stream()
//                        .filter(response -> response.getUserId().equals(userId))
//                        .toList();
//
//                String status = "En attente"; // Statut par défaut
//                int progress = 0;             // Progression par défaut
//                int totalQuestions = questionnaire.getQuestions().size();
//                int numberOfValidResponses = 0;
//
//                // Compter le nombre de réponses valides pour cet utilisateur et ce questionnaire
//                // Cette logique est maintenant alignée avec getMyEvaluations
//                for (UserResponse userResponse : userResponses) {
//                    switch (userResponse.getResponseType()) {
//                        case "Score":
//                            if (userResponse.getScoreResponse() != null) {
//                                numberOfValidResponses++;
//                            }
//                            break;
//                        case "Notation": // Ajouté pour correspondre à getMyEvaluations
//                            if (userResponse.getRatingResponse() != null) {
//                                numberOfValidResponses++;
//                            }
//                            break;
//                        case "Texte":
//                            if (userResponse.getTextResponse() != null) {
//                                numberOfValidResponses++;
//                            }
//                            break;
//                        case "Commentaire": // Ajouté pour correspondre à getMyEvaluations
//                            if (userResponse.getCommentResponse() != null) {
//                                numberOfValidResponses++;
//                            }
//                            break;
//                        case "Réponse multiple":
//                            if (userResponse.getMultipleChoiceResponse() != null && !userResponse.getMultipleChoiceResponse().isEmpty()) {
//                                numberOfValidResponses++;
//                            }
//                            break;
//                        case "Réponse unique":
//                            if (userResponse.getSingleChoiceResponse() != null) {
//                                numberOfValidResponses++;
//                            }
//                            break;
//                        case "Evaluation": // Ajouté pour correspondre à getMyEvaluations
//                            if (userResponse.getSingleLevelChoiceResponse() != null) {
//                                numberOfValidResponses++;
//                            }
//                            break;
//                        default:
//                            log.warn("Type de réponse non géré lors du comptage pour l'utilisateur {}: {}", userId, userResponse.getResponseType());
//                            break;
//                    }
//                }
//
//                // Calculer la progression
//                if (totalQuestions > 0) {
//                    progress = (numberOfValidResponses * 100) / totalQuestions;
//                } else {
//                    progress = 0; // Ou 100 si aucune question signifie "terminé", mais 0 est cohérent avec getMyEvaluations
//                }
//
//                // Déterminer le statut basé sur la progression calculée
//                // (aligné avec la logique de getMyEvaluations)
//                if (progress == 100) {
//                    status = "Terminé"; // Utilisation de "Terminé" comme dans l'ancien getTeamEvaluationDetails
//                } else if (progress > 0) { // Couvre > 0 et < 100
//                    status = "En cours";
//                }
//                // Si progress == 0, le statut reste "En attente" (valeur par défaut)
//
//                // Récupérer les détails de l'utilisateur (nom, position) via authServiceClient
//                TeamEvaluationDetailsForUserDto userDetails = authServiceClient.getParticipant(userId);
//                if (userDetails == null) { // Bonne pratique: gérer le cas où userDetails pourrait être null
//                    log.warn("Détails non trouvés pour l'utilisateur ID: {}", userId);
//                    // Vous pourriez vouloir initialiser userDetails avec des valeurs par défaut ou sauter ce participant
//                    userDetails = TeamEvaluationDetailsForUserDto.builder()
//                            .name("Utilisateur Inconnu")
//                            .position("N/A")
//                            .build();
//                }
//
//
//                participantsDetails.add(TeamEvaluationDetailsForUserDto.builder()
//                        .id(userId)
//                        .name(userDetails.getName())
//                        .position(userDetails.getPosition())
//                        .progress(progress) // Progression calculée
//                        .status(status)     // Statut calculé
//                        .build());
//            }
//        }
//
//        // Calcul de l'état global et de la progression globale pour l'évaluation (inchangé)
//        String globalStatus = calculateGlobalStatusForTeam(allTeamResponsesForQuestionnaire);
//        Integer globalProgress = calculateGlobalProgressForTeam(allTeamResponsesForQuestionnaire);
//
//        TeamEvaluationDetailsDto detailsDto = TeamEvaluationDetailsDto.builder()
//                .id(questionnaire.getId())
//                .title(questionnaire.getTitle())
//                .status(globalStatus)
//                .creationDate(questionnaire.getCreationDate().toString())
//                .type(questionnaire.getType())
//                .participants(participantsDetails)
//                .progress(globalProgress)
//                .build();
//
//        return ResponseEntity.ok(detailsDto);
//    }


    /**/

    /**
     * Calcule la progression d'un utilisateur spécifique pour un questionnaire donné.
     * Basé sur la logique de getMyEvaluations.
     *
     * @param userId                        L'ID de l'utilisateur.
     * @param questionnaire                 Le questionnaire concerné.
     * @param userResponsesForQuestionnaire La liste des réponses de l'utilisateur pour ce questionnaire.
     * @return La progression en pourcentage (0-100).
     */
    public int calculateUserProgressForQuestionnaire(Long userId, Questionnaire questionnaire, List<UserResponse> userResponsesForQuestionnaire) {
        if (questionnaire == null || questionnaire.getQuestions() == null) {
            log.warn("Questionnaire est null ou n'a pas de questions pour le calcul de progression de l'utilisateur {}.", userId);
            return 0;
        }
        int totalQuestions = questionnaire.getQuestions().size();
        if (totalQuestions == 0) {
            return 0; // Ou 100 si aucune question signifie "terminé", mais 0 est plus prudent.
        }

        int numberOfValidResponses = 0;
        for (UserResponse userResponse : userResponsesForQuestionnaire) {
            // S'assurer que la réponse appartient bien à l'utilisateur et au questionnaire (normalement déjà filtré)
            if (!userResponse.getUserId().equals(userId) || !userResponse.getQuestionnaireId().equals(questionnaire.getId())) {
                continue;
            }
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
                    if (userResponse.getMultipleChoiceResponse() != null && !userResponse.getMultipleChoiceResponse().isEmpty())
                        numberOfValidResponses++;
                    break;
                case "Réponse unique":
                    if (userResponse.getSingleChoiceResponse() != null) numberOfValidResponses++;
                    break;
                case "Evaluation":
                    if (userResponse.getSingleLevelChoiceResponse() != null) numberOfValidResponses++;
                    break;
                default:
                    // Pas de log ici pour ne pas surcharger, sauf si c'est un type vraiment inattendu
                    break;
            }
        }

        return (numberOfValidResponses * 100) / totalQuestions;
    }

    /**
     * Calcule la progression globale pour une équipe sur un questionnaire.
     * C'est la moyenne des progressions individuelles des membres de l'équipe.
     * Chaque participant a une seule progression prise en compte.
     *
     * @param questionnaire                    Le questionnaire.
     * @param allTeamResponsesForQuestionnaire Toutes les réponses de l'équipe pour ce questionnaire.
     * @param teamMemberIds                    La liste des IDs des membres de l'équipe concernés.
     * @return La progression globale moyenne.
     */
    private Integer calculateGlobalProgressForTeam(
            Questionnaire questionnaire,
            List<UserResponse> allTeamResponsesForQuestionnaire,
            List<Long> teamMemberIds) {

        if (questionnaire == null || teamMemberIds == null || teamMemberIds.isEmpty()) {
            return 0;
        }

        List<Integer> individualProgressions = new ArrayList<>();
        for (Long userId : teamMemberIds) {
            // Filtrer les réponses pour l'utilisateur courant
            List<UserResponse> userSpecificResponses = allTeamResponsesForQuestionnaire.stream()
                    .filter(response -> response.getUserId().equals(userId))
                    .toList();

            int userProgress = calculateUserProgressForQuestionnaire(userId, questionnaire, userSpecificResponses);
            individualProgressions.add(userProgress);
        }

        if (individualProgressions.isEmpty()) {
            return 0;
        }

        double averageProgress = individualProgressions.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        return (int) Math.round(averageProgress);
    }

    /**
     * Calcule le statut global pour une équipe sur un questionnaire.
     * Basé sur les statuts individuels dérivés de la progression.
     *
     * @param questionnaire                    Le questionnaire.
     * @param allTeamResponsesForQuestionnaire Toutes les réponses de l'équipe pour ce questionnaire.
     * @param teamMemberIds                    La liste des IDs des membres de l'équipe concernés.
     * @return Le statut global ("En attente", "En cours", "Terminé").
     */
    private String calculateGlobalStatusForTeam(
            Questionnaire questionnaire,
            List<UserResponse> allTeamResponsesForQuestionnaire,
            List<Long> teamMemberIds) {

        if (questionnaire == null || teamMemberIds == null || teamMemberIds.isEmpty()) {
            return "En attente";
        }

        List<String> individualStatuses = new ArrayList<>();
        for (Long userId : teamMemberIds) {
            // Filtrer les réponses pour l'utilisateur courant
            List<UserResponse> userSpecificResponses = allTeamResponsesForQuestionnaire.stream()
                    .filter(response -> response.getUserId().equals(userId))
                    .toList();

            int progress = calculateUserProgressForQuestionnaire(userId, questionnaire, userSpecificResponses);
            String userStatus = "En attente";
            if (progress == 100) {
                userStatus = "Terminé";
            } else if (progress > 0) {
                userStatus = "En cours";
            }
            individualStatuses.add(userStatus);
        }

        if (individualStatuses.isEmpty()) {
            return "En attente";
        }

        if (individualStatuses.stream().allMatch("Terminé"::equalsIgnoreCase)) {
            return "Terminé";
        }
        if (individualStatuses.stream().anyMatch("En cours"::equalsIgnoreCase)) {
            return "En cours";
        }
        // Si certains sont "Terminé" et d'autres "En attente" (mais aucun "En cours")
        // cela pourrait aussi être considéré comme "En cours" pour l'équipe.
        // La logique ci-dessous, qui est plus simple, considère ce cas comme "En attente"
        // s'il n'y a aucun "En cours". Vous pouvez ajuster si besoin.
        // Exemple: User A "Terminé", User B "En attente" -> Global "En attente"
        // Si vous préférez "En cours" dans ce cas:
        if (individualStatuses.stream().anyMatch("Terminé"::equalsIgnoreCase) &&
                individualStatuses.stream().anyMatch("En attente"::equalsIgnoreCase)) {
            // Optionnel: traiter un mélange de "Terminé" et "En attente" comme "En cours"
            // return "En cours";
        }

        return "En attente"; // Par défaut si pas tous terminés et aucun en cours
    }

    /*
     * @param questionnaire
     * @param allTeamResponsesForQuestionnaire
     * @param teamMemberIds
     * */
    private String calculateGlobalIsSentToManager(
            Questionnaire questionnaire,
            List<UserResponse> allTeamResponsesForQuestionnaire,
            List<Long> teamMemberIds) {

        // Vérification des paramètres
        if (questionnaire == null || teamMemberIds == null || teamMemberIds.isEmpty()) {
            return "Brouillon";
        }

        // Statut par défaut
        String globalStatus = "Terminée";  // On part du principe que tout est terminé

        // Pour chaque utilisateur de l'équipe
        for (Long userId : teamMemberIds) {
            // Filtrer les réponses pour l'utilisateur courant
            List<UserResponse> userSpecificResponses = allTeamResponsesForQuestionnaire.stream()
                    .filter(response -> response.getUserId().equals(userId))
                    .toList();

            // Si l'utilisateur n'a pas de réponses, on considère que c'est un brouillon
            if (userSpecificResponses.isEmpty()) {
                return "Brouillon";
            }

            // Vérifier si toutes les réponses de l'utilisateur sont envoyées
            boolean allSent = userSpecificResponses.stream()
                    .allMatch(response -> response.getIsSentToManager() != null && response.getIsSentToManager());

            // Si au moins une réponse n'est pas envoyée, tout est considéré comme brouillon
            if (!allSent) {
                return "Brouillon";
            }
        }

        // Si on arrive ici, c'est que toutes les réponses de tous les utilisateurs sont envoyées
        return globalStatus;
    }

    private String calculateGlobalIsSentToAdmin(
            Questionnaire questionnaire,
            List<UserResponse> allTeamResponsesForQuestionnaire,
            List<Long> teamMemberIds) {

        // Vérification des paramètres
        if (questionnaire == null || teamMemberIds == null || teamMemberIds.isEmpty()) {
            return "Brouillon";
        }

        // Statut par défaut
        String globalStatus = "Terminée";  // On part du principe que tout est terminé

        // Pour chaque utilisateur de l'équipe
        for (Long userId : teamMemberIds) {
            // Filtrer les réponses pour l'utilisateur courant
            List<UserResponse> userSpecificResponses = allTeamResponsesForQuestionnaire.stream()
                    .filter(response -> response.getUserId().equals(userId))
                    .toList();

            // Si l'utilisateur n'a pas de réponses, on considère que c'est un brouillon
            if (userSpecificResponses.isEmpty()) {
                return "Brouillon";
            }

            // Vérifier si toutes les réponses de l'utilisateur sont envoyées
            boolean allSent = userSpecificResponses.stream()
                    .allMatch(response -> response.getIsSentToAdmin() != null && response.getIsSentToAdmin());

            // Si au moins une réponse n'est pas envoyée, tout est considéré comme brouillon
            if (!allSent) {
                return "Brouillon";
            }
        }

        // Si on arrive ici, c'est que toutes les réponses de tous les utilisateurs sont envoyées
        return globalStatus;
    }

    private String calculateIndividualIsSentToManager(
            Questionnaire questionnaire,
            List<UserResponse> userResponses,
            Long userId) {

        // Vérification des paramètres
        if (questionnaire == null || userResponses == null || userId == null) {
            return "Brouillon";
        }

        // Filtrer les réponses pour l'utilisateur spécifié
        List<UserResponse> userSpecificResponses = userResponses.stream()
                .filter(response -> response.getUserId().equals(userId))
                .toList();

        // Si l'utilisateur n'a pas de réponses, on considère que c'est un brouillon
        if (userSpecificResponses.isEmpty()) {
            return "Brouillon";
        }

        // Vérifier si toutes les réponses de l'utilisateur sont envoyées
        boolean allSent = userSpecificResponses.stream()
                .allMatch(response -> response.getIsSentToManager() != null && response.getIsSentToManager());

        // Si toutes les réponses sont envoyées, c'est terminé, sinon c'est un brouillon
        return allSent ? "Terminée" : "Brouillon";
    }

    private String calculateIndividualIsSentToAdmin(
            Questionnaire questionnaire,
            List<UserResponse> userResponses,
            Long userId) {

        // Vérification des paramètres
        if (questionnaire == null || userResponses == null || userId == null) {
            return "Brouillon";
        }

        // Filtrer les réponses pour l'utilisateur spécifié
        List<UserResponse> userSpecificResponses = userResponses.stream()
                .filter(response -> response.getUserId().equals(userId))
                .toList();

        // Si l'utilisateur n'a pas de réponses, on considère que c'est un brouillon
        if (userSpecificResponses.isEmpty()) {
            return "Brouillon";
        }

        // Vérifier si toutes les réponses de l'utilisateur sont envoyées
        boolean allSent = userSpecificResponses.stream()
                .allMatch(response -> response.getIsSentToAdmin() != null && response.getIsSentToAdmin());

        // Si toutes les réponses sont envoyées, c'est terminé, sinon c'est un brouillon
        return allSent ? "Terminée" : "Brouillon";
    }

    // MODIFICATION de getTeamEvaluations pour inclure GroupeEvaluation
    @Override
    public ResponseEntity<List<GetTeamEvaluationsDto>> getTeamEvaluations(Long managerId) {
        List<Long> myTeamIds = authServiceClient.getMyTeam(managerId);
        List<GetTeamEvaluationsDto> teamEvaluationDtos = new ArrayList<>();

        if (myTeamIds != null && !myTeamIds.isEmpty()) {

            // 1. ÉVALUATIONS DE CAMPAGNE (logique existante)
            List<GetTeamEvaluationsDto> campaignEvaluations = getCampaignTeamEvaluations(myTeamIds);
            teamEvaluationDtos.addAll(campaignEvaluations);

            // 2. ÉVALUATIONS DE GROUPE (nouvelle logique)
            List<GetTeamEvaluationsDto> groupeEvaluations = getGroupeTeamEvaluations(myTeamIds);
            teamEvaluationDtos.addAll(groupeEvaluations);
        }

        return ResponseEntity.ok(teamEvaluationDtos);
    }

    // NOUVELLE MÉTHODE pour les évaluations de groupe d'équipe
    private List<GetTeamEvaluationsDto> getGroupeTeamEvaluations(List<Long> myTeamIds) {
        List<GetTeamEvaluationsDto> groupeEvaluationDtos = new ArrayList<>();

        // Récupérer toutes les GroupeEvaluation où au moins un membre de l'équipe participe
        List<GroupeEvaluation> groupeEvaluations = groupeEvaluationRepo.findAll().stream()
                .filter(ge -> ge.getParticipantIds() != null &&
                        ge.getParticipantIds().stream().anyMatch(myTeamIds::contains))
                .filter(ge -> ge.getStatus() == GroupeEvaluationStatusEnums.PUBLISHED)
                .collect(Collectors.toList());

        log.info("Found {} published groupe evaluations for team", groupeEvaluations.size());

        for (GroupeEvaluation groupeEvaluation : groupeEvaluations) {
            Questionnaire questionnaire = groupeEvaluation.getQuestionnaire();
            if (questionnaire != null) {

                // Filtrer les membres d'équipe qui participent à CETTE GroupeEvaluation
                List<Long> teamParticipants = myTeamIds.stream()
                        .filter(groupeEvaluation.getParticipantIds()::contains)
                        .collect(Collectors.toList());

                log.info("Processing groupe evaluation {} with {} team participants",
                        groupeEvaluation.getId(), teamParticipants.size());

                // UTILISATION CORRECTE : Récupérer par groupeEvaluationId ET source
                List<UserResponse> teamResponsesForGroupe = userResponseRepository
                        .findByGroupeEvaluationIdAndUserIdIn(groupeEvaluation.getId(), teamParticipants);

                // SI LA MÉTHODE CI-DESSUS N'EXISTE PAS ENCORE, utiliser cette alternative :
                if (teamResponsesForGroupe.isEmpty()) {
                    teamResponsesForGroupe = userResponseRepository
                            .findByQuestionnaireIdAndUserIdIn(questionnaire.getId(), teamParticipants)
                            .stream()
                            .filter(ur -> ur.getEvaluationSource() == EvaluationSource.GROUPE_EVALUATION)
                            .filter(ur -> groupeEvaluation.getId().equals(ur.getGroupeEvaluationId()))
                            .collect(Collectors.toList());
                }

                log.info("Found {} responses for groupe evaluation {}",
                        teamResponsesForGroupe.size(), groupeEvaluation.getId());

                // Calculer progression et statut pour cette évaluation de groupe
                Integer globalProgress = calculateGlobalProgressForGroupe(
                        questionnaire, teamResponsesForGroupe, teamParticipants, groupeEvaluation.getId());
                String globalStatus = calculateGlobalStatusForGroupe(
                        questionnaire, teamResponsesForGroupe, teamParticipants, groupeEvaluation.getId());

                log.info("Groupe evaluation {} - Progress: {}%, Status: {}",
                        groupeEvaluation.getId(), globalProgress, globalStatus);

                GetTeamEvaluationsDto dto = GetTeamEvaluationsDto.builder()
                        .id(questionnaire.getId())
                        .title(groupeEvaluation.getLabel() + " - " + questionnaire.getTitle())
                        .status(globalStatus)
                        .creationDate(groupeEvaluation.getCreationDate().toString())
                        .type("Formation")
                        .participantIds(teamParticipants)
                        .participants(teamParticipants.size())
                        .progress(globalProgress)
                        .build();

                groupeEvaluationDtos.add(dto);
            }
        }

        log.info("Returning {} groupe evaluations for team", groupeEvaluationDtos.size());
        return groupeEvaluationDtos;
    }

    // MODIFICATION de getTeamEvaluationDetails pour supporter GroupeEvaluation
    @Override
    public ResponseEntity<?> getTeamEvaluationDetails(UUID questionnaireId, Long managerId) {
        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
                .orElseThrow(() -> new RuntimeException("Questionnaire non trouvé avec ID: " + questionnaireId));

        List<QuestionDto> questionDtos = new ArrayList<>();
        questionnaire.getQuestions().forEach(question -> {
            questionDtos.add(EvaluationUtilMethods.mapToQuestionDto(question));
        });

        List<Long> myTeamIds = authServiceClient.getMyTeam(managerId);

        // Déterminer si c'est une évaluation de campagne ou de groupe
        EvaluationSource evaluationSource = determineEvaluationSourceForTeam(questionnaireId, myTeamIds);

        List<TeamEvaluationDetailsForUserDto> participantsDetails = new ArrayList<>();
        List<UserResponse> allTeamResponsesForQuestionnaire;
        List<Long> teamParticipantIds;

        if (evaluationSource == EvaluationSource.CAMPAIGN) {
            // Logique existante pour les campagnes
            List<CampaignEvaluation> campaignEvaluations = campaignEvaluationRepository
                    .findByAnyParticipantIdInAndStatus(myTeamIds, "Publiée");
            teamParticipantIds = campaignEvaluations.get(0).getParticipantIds().stream()
                    .filter(myTeamIds::contains)
                    .collect(Collectors.toList());

            allTeamResponsesForQuestionnaire = userResponseRepository
                    .findByQuestionnaireIdAndUserIdIn(questionnaireId, teamParticipantIds);

        } else {
            // NOUVELLE LOGIQUE pour GroupeEvaluation
            GroupeEvaluation groupeEvaluation = findGroupeEvaluationByQuestionnaire(questionnaireId, myTeamIds);
            if (groupeEvaluation == null) {
                throw new RuntimeException("GroupeEvaluation non trouvée pour ce questionnaire");
            }

            teamParticipantIds = myTeamIds.stream()
                    .filter(groupeEvaluation.getParticipantIds()::contains)
                    .collect(Collectors.toList());

            // 🎯 ICI AUSSI ON UTILISE findByGroupeEvaluationIdAndUserIdIn
            allTeamResponsesForQuestionnaire = userResponseRepository
                    .findByGroupeEvaluationIdAndUserIdIn(groupeEvaluation.getId(), teamParticipantIds);
        }

        // Le reste de la logique reste identique...
        if (!teamParticipantIds.isEmpty()) {
            for (Long userId : teamParticipantIds) {
                List<UserResponse> userResponsesForThisUser = allTeamResponsesForQuestionnaire.stream()
                        .filter(response -> response.getUserId().equals(userId))
                        .collect(Collectors.toList());

                int progress = calculateUserProgressForQuestionnaire(userId, questionnaire, userResponsesForThisUser);
                String status = calculateIndividualIsSentToAdmin(questionnaire, userResponsesForThisUser, userId);

                TeamEvaluationDetailsForUserDto userDetailsFromAuth = authServiceClient.getParticipant(userId);
                String name = userDetailsFromAuth != null ? userDetailsFromAuth.getName() : "Utilisateur Inconnu";
                String position = userDetailsFromAuth != null ? userDetailsFromAuth.getPosition() : "N/A";
                String groupe = userDetailsFromAuth != null ? userDetailsFromAuth.getGroupe() : "N/A";

                Boolean isSentToManager = !userResponsesForThisUser.isEmpty() ?
                        userResponsesForThisUser.get(0).getIsSentToManager() : false;
                Boolean isSentToAdmin = !userResponsesForThisUser.isEmpty() ?
                        userResponsesForThisUser.get(0).getIsSentToAdmin() : false;

                participantsDetails.add(TeamEvaluationDetailsForUserDto.builder()
                        .id(userId)
                        .name(name)
                        .position(position)
                        .groupe(groupe)
                        .progress(progress)
                        .status(status)
                        .isSentToManager(isSentToManager)
                        .isSentToAdmin(isSentToAdmin)
                        .build());
            }
        }

        Integer globalProgress = calculateGlobalProgressForTeam(questionnaire, allTeamResponsesForQuestionnaire, teamParticipantIds);
        String globalStatus = calculateGlobalStatusForTeam(questionnaire, allTeamResponsesForQuestionnaire, teamParticipantIds);

        TeamEvaluationDetailsDto detailsDto = TeamEvaluationDetailsDto.builder()
                .id(questionnaire.getId())
                .title(questionnaire.getTitle())
                .status(globalStatus)
                .creationDate(questionnaire.getCreationDate().toString())
                .type(questionnaire.getType())
                .participants(participantsDetails)
                .progress(globalProgress)
                .questions(questionDtos)
                .build();

        return ResponseEntity.ok(detailsDto);
    }

    // MÉTHODES UTILITAIRES pour GroupeEvaluation

    private EvaluationSource determineEvaluationSourceForTeam(UUID questionnaireId, List<Long> teamIds) {
        // Vérifier d'abord les campagnes
        List<CampaignEvaluation> campaigns = campaignEvaluationRepository
                .findByAnyParticipantIdInAndStatus(teamIds, "Publiée");
        boolean isFromCampaign = campaigns.stream()
                .anyMatch(campaign -> campaign.getQuestionnaires().stream()
                        .anyMatch(q -> q.getId().equals(questionnaireId)));

        if (isFromCampaign) {
            return EvaluationSource.CAMPAIGN;
        }

        // Sinon, c'est probablement une GroupeEvaluation
        return EvaluationSource.GROUPE_EVALUATION;
    }

    private GroupeEvaluation findGroupeEvaluationByQuestionnaire(UUID questionnaireId, List<Long> teamIds) {
        return groupeEvaluationRepo.findAll().stream()
                .filter(ge -> ge.getQuestionnaire() != null &&
                        ge.getQuestionnaire().getId().equals(questionnaireId))
                .filter(ge -> ge.getParticipantIds() != null &&
                        ge.getParticipantIds().stream().anyMatch(teamIds::contains))
                .findFirst()
                .orElse(null);
    }

    // Méthodes de calcul adaptées pour GroupeEvaluation (similaires aux existantes)
    private Integer calculateGlobalProgressForGroupe(Questionnaire questionnaire,
                                                     List<UserResponse> responses,
                                                     List<Long> participantIds,
                                                     UUID groupeEvaluationId) {
        if (questionnaire == null || participantIds == null || participantIds.isEmpty()) {
            log.warn("Invalid parameters for progress calculation: questionnaire={}, participantIds={}",
                    questionnaire != null ? questionnaire.getId() : "null", participantIds);
            return 0;
        }

        List<Integer> individualProgressions = new ArrayList<>();

        for (Long userId : participantIds) {
            // Filtrer les réponses pour l'utilisateur courant dans cette GroupeEvaluation spécifique
            List<UserResponse> userSpecificResponses = responses.stream()
                    .filter(response -> response.getUserId().equals(userId))
                    .filter(response -> groupeEvaluationId.equals(response.getGroupeEvaluationId()) ||
                            response.getEvaluationSource() == EvaluationSource.GROUPE_EVALUATION)
                    .collect(Collectors.toList());

            int userProgress = calculateUserProgressForQuestionnaire(userId, questionnaire, userSpecificResponses);
            individualProgressions.add(userProgress);

            log.debug("User {} progress in groupe evaluation {}: {}%", userId, groupeEvaluationId, userProgress);
        }

        if (individualProgressions.isEmpty()) {
            log.warn("No individual progressions calculated for groupe evaluation {}", groupeEvaluationId);
            return 0;
        }

        double averageProgress = individualProgressions.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        int result = (int) Math.round(averageProgress);
        log.info("Global progress for groupe evaluation {}: {}%", groupeEvaluationId, result);
        return result;
    }

    private String calculateGlobalStatusForGroupe(Questionnaire questionnaire,
                                                  List<UserResponse> responses,
                                                  List<Long> participantIds,
                                                  UUID groupeEvaluationId) {
        if (questionnaire == null || participantIds == null || participantIds.isEmpty()) {
            return "En attente";
        }

        List<String> individualStatuses = new ArrayList<>();

        for (Long userId : participantIds) {
            List<UserResponse> userSpecificResponses = responses.stream()
                    .filter(response -> response.getUserId().equals(userId))
                    .filter(response -> groupeEvaluationId.equals(response.getGroupeEvaluationId()) ||
                            response.getEvaluationSource() == EvaluationSource.GROUPE_EVALUATION)
                    .collect(Collectors.toList());

            int progress = calculateUserProgressForQuestionnaire(userId, questionnaire, userSpecificResponses);
            String userStatus = "En attente";
            if (progress == 100) {
                userStatus = "Terminé";
            } else if (progress > 0) {
                userStatus = "En cours";
            }
            individualStatuses.add(userStatus);

            log.debug("User {} status in groupe evaluation {}: {}", userId, groupeEvaluationId, userStatus);
        }

        String globalStatus;
        if (individualStatuses.stream().allMatch("Terminé"::equalsIgnoreCase)) {
            globalStatus = "Terminé";
        } else if (individualStatuses.stream().anyMatch("En cours"::equalsIgnoreCase)) {
            globalStatus = "En cours";
        } else {
            globalStatus = "En attente";
        }

        log.info("Global status for groupe evaluation {}: {}", groupeEvaluationId, globalStatus);
        return globalStatus;
    }

    // MÉTHODE EXISTANTE refactorisée pour les campagnes
    private List<GetTeamEvaluationsDto> getCampaignTeamEvaluations(List<Long> myTeamIds) {
        List<GetTeamEvaluationsDto> campaignEvaluationDtos = new ArrayList<>();

        List<CampaignEvaluation> campaignEvaluations = campaignEvaluationRepository
                .findByAnyParticipantIdInAndStatus(myTeamIds, "Publiée");

        for (CampaignEvaluation campaignEvaluation : campaignEvaluations) {
            for (Questionnaire questionnaire : campaignEvaluation.getQuestionnaires()) {
                List<Long> myTeamIdsForThisQuestionnaire = myTeamIds.stream()
                        .filter(campaignEvaluation.getParticipantIds()::contains)
                        .collect(Collectors.toList());

                List<UserResponse> teamResponsesForQuestionnaire = userResponseRepository
                        .findByQuestionnaireIdAndUserIdIn(questionnaire.getId(), myTeamIds);

                Integer globalProgress = calculateGlobalProgressForTeam(
                        questionnaire, teamResponsesForQuestionnaire, myTeamIdsForThisQuestionnaire);
                String globalIsSentToManager = calculateGlobalIsSentToAdmin(
                        questionnaire, teamResponsesForQuestionnaire, myTeamIdsForThisQuestionnaire);

                GetTeamEvaluationsDto dto = GetTeamEvaluationsDto.builder()
                        .id(questionnaire.getId())
                        .title(questionnaire.getTitle())
                        .status(globalIsSentToManager)
                        .creationDate(questionnaire.getCreationDate().toString())
                        .type("Campagne") // Identifier la source
                        .participantIds(myTeamIdsForThisQuestionnaire)
                        .participants(myTeamIdsForThisQuestionnaire.size())
                        .progress(globalProgress)
                        .build();

                campaignEvaluationDtos.add(dto);
            }
        }

        return campaignEvaluationDtos;
    }

//    @Transactional
//    @Override
//    public ResponseEntity<?> sendEvaluationToAdmin(UUID id, SendEvaluationToAdminDto sendEvaluationToAdminDto) {
//        List<UserResponse> userResponses = userResponseRepository.findByQuestionnaireIdAndUserIdIn(id, sendEvaluationToAdminDto.getParticipantIds());
//        userResponses.forEach(userResponse -> {
//            userResponse.setIsSentToAdmin(true);
//        });
//        userResponseRepository.saveAll(userResponses);
//        return ResponseEntity.ok().build();
//    }

    @Transactional
    public ResponseEntity<?> sendEvaluationToAdmin(UUID questionnaireId, SendEvaluationToAdminDto sendEvaluationToAdminDto) {
        // Étape 1: Mettre à jour les UserResponses (logique existante)
        List<UserResponse> userResponsesToUpdate = userResponseRepository.findByQuestionnaireIdAndUserIdIn(
                questionnaireId, sendEvaluationToAdminDto.getParticipantIds()
        );

        if (userResponsesToUpdate.isEmpty() && !sendEvaluationToAdminDto.getParticipantIds().isEmpty()) {
            // Gérer le cas où aucun UserResponse n'est trouvé pour les participants spécifiés.
            // Vous pourriez retourner une erreur ou simplement un log.
            System.out.println("Aucune réponse utilisateur trouvée pour le questionnaire " + questionnaireId +
                    " et les participants fournis.");
            // Optionnel: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune réponse utilisateur trouvée.");
        }

        userResponsesToUpdate.forEach(userResponse -> {
            userResponse.setIsSentToAdmin(true);
            userResponse.setLastModifiedDate(LocalDate.now());
        });
        userResponseRepository.saveAll(userResponsesToUpdate);

        // Étape 2: Créer conditionnellement un "Besoin" (Need)
        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
                .orElse(null);

        if (questionnaire == null) {
            System.err.println("Questionnaire non trouvé avec l'ID: " + questionnaireId + ". La création de Besoin est annulée.");
            // Vous pouvez choisir de retourner une réponse d'erreur ici si le questionnaire est crucial.
            // Pour l'instant, on retourne OK car la première partie (mise à jour de isSentToAdmin) a réussi.
            return ResponseEntity.ok().body("Évaluations envoyées à l'admin. Questionnaire non trouvé pour la création de Besoin.");
        }

        if ("Récensement des besoins de formation".equals(questionnaire.getType())) {
            // Trouver la définition de la question "Thème" dans le questionnaire
            Question themeQuestionDefinition = questionnaire.getQuestions().stream()
                    .filter(q -> "Thème".equals(q.getText())) // Attention: sensible à la casse et au texte exact
                    .findFirst()
                    .orElse(null);

            if (themeQuestionDefinition == null) {
                System.out.println("Attention: La question 'Thème' n'a pas été trouvée dans le questionnaire '" +
                        questionnaire.getTitle() + "'. Impossible de créer des Besoins.");
            } else {
                UUID themeQuestionId = themeQuestionDefinition.getId();
                String themeQuestionType = themeQuestionDefinition.getType(); // Type de la question "Thème"

                // Regrouper toutes les réponses par userId pour faciliter la recherche
                // `userResponsesToUpdate` contient déjà les réponses pour les utilisateurs et le questionnaire concernés.
                Map<Long, List<UserResponse>> responsesByUserId = userResponsesToUpdate.stream()
                        .collect(Collectors.groupingBy(UserResponse::getUserId));

                for (Long participantId : sendEvaluationToAdminDto.getParticipantIds()) {
                    List<UserResponse> participantResponses = responsesByUserId.get(participantId);
                    if (participantResponses == null || participantResponses.isEmpty()) {
                        System.out.println("Attention: Aucune réponse trouvée pour le participant " + participantId +
                                " après le premier fetch. Création de Besoin annulée pour ce participant.");
                        continue;
                    }

                    UserResponse themeUserResponse = participantResponses.stream()
                            .filter(ur -> ur.getQuestionId().equals(themeQuestionId))
                            .findFirst()
                            .orElse(null);

                    String themeValue = null;
                    if (themeUserResponse != null) {
                        // Extraire la valeur de la réponse en fonction du type de la question "Thème"
                        switch (themeQuestionType) {
                            case "Texte": // Adaptez ces types à ceux définis dans votre application
//                            case "Text":
                                themeValue = themeUserResponse.getTextResponse();
                                break;
                            case "Réponse unique": // Type générique pour choix unique
                                // case "SINGLE_CHOICE_RADIO": // Exemple plus spécifique
                                // case "SINGLE_CHOICE_DROPDOWN": // Exemple plus spécifique
                                themeValue = themeUserResponse.getSingleChoiceResponse();
                                break;
                            case "Réponse multiple": // Type générique pour choix multiples
                                // case "MULTIPLE_CHOICE_CHECKBOX": // Exemple plus spécifique
                                if (themeUserResponse.getMultipleChoiceResponse() != null && !themeUserResponse.getMultipleChoiceResponse().isEmpty()) {
                                    themeValue = String.join(", ", themeUserResponse.getMultipleChoiceResponse());
                                }
                                break;
                            default:
                                System.out.println("Attention: Type de question non géré ('" + themeQuestionType +
                                        "') pour la question 'Thème'. Tentative d'extraction depuis les champs communs.");
                                // Tentative de secours (peut être affinée ou supprimée)
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
                        System.out.println("Attention: Réponse au 'Thème' non trouvée ou vide pour l'utilisateur " + participantId +
                                " et la question " + themeQuestionId + ". Création de Besoin annulée.");
                        continue;
                    }

                    // Récupérer le nom du demandeur (participant)
                    // Vous aurez besoin d'un service (ex: UserService) pour cela.
                    // String requesterName = userService.getUserNameById(participantId);
                    String requesterName = "Nom du demandeur pour ID " + participantId; // Placeholder

                    // Récupérer l'ID de l'approbateur (manager du participant)
                    // Vous aurez besoin d'un service (ex: UserService) pour cela.
                    // Long approverId = userService.getManagerIdForUser(participantId);
                    Long approverId = null;
                    UserDto userDto = authServiceClient.getUserById(participantId);
                    if (userDto != null) {
                        approverId = userDto.getManagerId();
                        requesterName = userDto.getName();
                    }

                    Long companyId = questionnaire.getCompanyId(); // Ou themeUserResponse.getCompanyId()

                    Need need = Need.builder()
                            .requesterId(participantId)
                            .requesterName(requesterName) // À implémenter: récupérer le nom de l'utilisateur
                            .approverId(approverId)       // À implémenter: récupérer l'ID du manager
                            .source(NeedSource.Evaluation)
                            .creationDate(DateTimeFormatter.ISO_LOCAL_DATE.format(LocalDate.now())) // Format "YYYY-MM-DD"
                            .type("Evaluation") // Comme spécifié
                            .theme(themeValue)
                            .questionnaire(questionnaire.getTitle())
                            .companyId(companyId)
                            .numberOfGroup(1)
                            // Initialiser les autres champs requis de "Need"
                            .status(NeedStatusEnums.DRAFT)
                            .build();


                    // TODO : dé commenter cette section pour ajouter un groupe par défaut au besoin issu de l'évaluation
                    Groupe groupe = Groupe.builder()
                            .need(need) // Association du groupe au besoin
                            .companyId(companyId) // Récupération de l'ID de l'entreprise
                            .name("Groupe 1")
                            .status(GroupeStatusEnums.DRAFT)
                            .build();

                    need.setGroupes(List.of(groupe));

                    needRepository.save(need);
                    System.out.println("Besoin (Need) créé pour l'utilisateur " + participantId + " avec le thème: " + themeValue);
                }
            }
        }

        return ResponseEntity.ok().body("Opération terminée. Évaluations envoyées et Besoins créés si applicable.");
    }

    /**/

    // 🔄 CHANGÉ : Méthode prend groupeEvaluationId au lieu de questionnaireId
    @Override
    public ResponseEntity<?> getAdminEvaluationDetails(UUID groupeEvaluationId) {
        log.info("Admin requesting groupe evaluation details for groupeEvaluationId {}", groupeEvaluationId);

        // 🔄 CHANGÉ : Récupérer la GroupeEvaluation directement par son ID
        GroupeEvaluation groupeEvaluation = groupeEvaluationRepo.findById(groupeEvaluationId)
                .orElseThrow(() -> new RuntimeException("GroupeEvaluation non trouvée avec ID: " + groupeEvaluationId));

        // 🔄 CHANGÉ : Récupérer le questionnaire depuis la GroupeEvaluation
        Questionnaire questionnaire = groupeEvaluation.getQuestionnaire();
        if (questionnaire == null) {
            throw new RuntimeException("Aucun questionnaire associé à la GroupeEvaluation ID: " + groupeEvaluationId);
        }

        // 🔄 CHANGÉ : Récupérer les participants de CETTE GroupeEvaluation spécifique
        List<Long> allParticipantIds = groupeEvaluation.getParticipantIds();
        if (allParticipantIds == null || allParticipantIds.isEmpty()) {
            log.warn("No participants found for groupeEvaluationId {}", groupeEvaluationId);
            return ResponseEntity.ok(new ArrayList<TeamEvaluationDetailsForUserDto>());
        }

        log.info("Found {} participants in groupe evaluation {}", allParticipantIds.size(), groupeEvaluationId);

        List<TeamEvaluationDetailsForUserDto> participantsDetails = new ArrayList<>();

        // 🔄 CHANGÉ : Récupérer les réponses de CETTE GroupeEvaluation spécifique
        List<UserResponse> allResponsesForEvaluation = getSpecificGroupeEvaluationResponses(
                groupeEvaluationId, questionnaire.getId(), allParticipantIds);

        log.info("Found {} total responses for groupe evaluation {}",
                allResponsesForEvaluation.size(), groupeEvaluationId);

        // ✅ INCHANGÉ : Traiter chaque participant
        for (Long userId : allParticipantIds) {
            // ✅ INCHANGÉ : Filtrer les réponses pour l'utilisateur courant
            List<UserResponse> userResponsesForThisUser = allResponsesForEvaluation.stream()
                    .filter(response -> response.getUserId().equals(userId))
                    .collect(Collectors.toList());

            // ✅ INCHANGÉ : Calcul de la progression individuelle
            int progress = calculateUserProgressForQuestionnaire(userId, questionnaire, userResponsesForThisUser);

            // ✅ INCHANGÉ : Déterminer le statut individuel
            String status = calculateIndividualIsSentToAdmin(questionnaire, userResponsesForThisUser, userId);

            // ✅ INCHANGÉ : Récupérer les détails de l'utilisateur
            TeamEvaluationDetailsForUserDto userDetailsFromAuth = authServiceClient.getParticipant(userId);
            String name = "Utilisateur Inconnu";
            String firstName = "Inconnu";
            String lastName = "Inconnu";
            String position = "N/A";
            String groupe = "N/A";
            String cin = "N/A";
            String cnss = "N/A";
            if (userDetailsFromAuth != null) {
                name = userDetailsFromAuth.getName();
                firstName = userDetailsFromAuth.getFirstName();
                lastName = userDetailsFromAuth.getLastName();
                cin = userDetailsFromAuth.getCin();
                cnss = userDetailsFromAuth.getCnss();
                position = userDetailsFromAuth.getPosition();
                groupe = userDetailsFromAuth.getGroupe();
            } else {
                log.warn("Détails non trouvés pour l'utilisateur ID: {}. Utilisation de valeurs par défaut.", userId);
            }

            // ✅ INCHANGÉ : Récupérer les statuts d'envoi
            Boolean isSentToManager = false;
            Boolean isSentToAdmin = false;
            if (!userResponsesForThisUser.isEmpty()) {
                UserResponse firstResponse = userResponsesForThisUser.get(0);
                isSentToManager = firstResponse.getIsSentToManager();
                isSentToAdmin = firstResponse.getIsSentToAdmin();
            } else {
                log.debug("Aucune réponse trouvée pour l'utilisateur ID: {} dans la groupe evaluation {}", userId, groupeEvaluationId);
            }

            // ✅ INCHANGÉ : Construction du DTO (exactement comme demandé)
            participantsDetails.add(TeamEvaluationDetailsForUserDto.builder()
                    .id(userId)
                    .name(name)
                    .firstName(firstName)
                    .lastName(lastName)
                    .cin(cin)
                    .cnss(cnss)
                    .position(position)
                    .groupe(groupe)
                    .progress(progress)
                    .status(status)
                    .isSentToManager(isSentToManager)
                    .isSentToAdmin(isSentToAdmin)
                    .build());

            log.debug("Processed user {}: progress={}%, status={}, isSentToAdmin={}",
                    userId, progress, status, isSentToAdmin);
        }

        log.info("Admin groupe evaluation details completed. Processed {} participants for groupeEvaluationId {}",
                participantsDetails.size(), groupeEvaluationId);

        return ResponseEntity.ok(participantsDetails);
    }

    // 🔄 CHANGÉ : Nouvelle méthode spécifique pour UNE GroupeEvaluation
    private List<UserResponse> getSpecificGroupeEvaluationResponses(UUID groupeEvaluationId, UUID questionnaireId, List<Long> participantIds) {
        if (participantIds.isEmpty()) {
            log.warn("No participants provided for groupeEvaluationId {}", groupeEvaluationId);
            return new ArrayList<>();
        }

        List<UserResponse> responses = new ArrayList<>();

        // Essayer d'abord avec findByGroupeEvaluationIdAndUserIdIn
        responses = userResponseRepository.findByGroupeEvaluationIdAndUserIdIn(groupeEvaluationId, participantIds);

        // Si la méthode ci-dessus ne fonctionne pas, utiliser le fallback
        if (responses.isEmpty()) {
            log.info("No responses found with groupeEvaluationId, trying fallback method for groupeEvaluationId {}", groupeEvaluationId);
            responses = userResponseRepository
                    .findByQuestionnaireIdAndUserIdIn(questionnaireId, participantIds)
                    .stream()
                    .filter(ur -> ur.getEvaluationSource() == EvaluationSource.GROUPE_EVALUATION)
                    .filter(ur -> groupeEvaluationId.equals(ur.getGroupeEvaluationId()))
                    .collect(Collectors.toList());
        }

        log.info("Retrieved {} responses for {} participants in groupe evaluation {}",
                responses.size(), participantIds.size(), groupeEvaluationId);

        return responses;
    }
}