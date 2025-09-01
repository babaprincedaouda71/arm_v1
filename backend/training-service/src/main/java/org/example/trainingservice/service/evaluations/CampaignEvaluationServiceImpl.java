package org.example.trainingservice.service.evaluations;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.client.company.CompanyServiceClient;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.dto.evaluation.*;
import org.example.trainingservice.dto.need.DepartmentDto;
import org.example.trainingservice.dto.need.SiteDto;
import org.example.trainingservice.entity.campaign.CampaignEvaluation;
import org.example.trainingservice.entity.campaign.Questionnaire;
import org.example.trainingservice.entity.campaign.UserResponse;
import org.example.trainingservice.repository.evaluation.CampaignEvaluationRepository;
import org.example.trainingservice.repository.evaluation.QuestionnaireRepository;
import org.example.trainingservice.repository.evaluation.UserResponseRepository;
import org.example.trainingservice.utils.EvaluationUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class CampaignEvaluationServiceImpl implements CampaignEvaluationService {
    private final CampaignEvaluationRepository campaignEvaluationRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final CompanyServiceClient companyServiceClient;
    private final UserResponseRepository userResponseRepository;
    private final AuthServiceClient authServiceClient;

    public CampaignEvaluationServiceImpl(
            CampaignEvaluationRepository campaignEvaluationRepository,
            QuestionnaireRepository questionnaireRepository,
            CompanyServiceClient companyServiceClient,
            UserResponseRepository userResponseRepository,
            AuthServiceClient authServiceClient) {
        this.campaignEvaluationRepository = campaignEvaluationRepository;
        this.questionnaireRepository = questionnaireRepository;
        this.companyServiceClient = companyServiceClient;
        this.userResponseRepository = userResponseRepository;
        this.authServiceClient = authServiceClient;
    }

    @Override
    public ResponseEntity<?> addCampaignEvaluation(AddCampaignEvaluationDto dto) {
        log.info("Adding campaign evaluation with title {}.", dto.getTitle());
        List<Questionnaire> questionnaires = questionnaireRepository.findAllById(dto.getQuestionnaireIds());
        CampaignEvaluation campaignEvaluation = CampaignEvaluation.builder()
                .title(dto.getTitle())
                .siteIds(dto.getSiteIds())
                .departmentIds(dto.getDepartmentIds())
                .participantIds(dto.getParticipantIds())
                .questionnaires(questionnaires)
                .creationDate(LocalDate.now())
                .instructions(dto.getInstructions())
                .status("Brouillon")
                .build();

        log.info("Saving campaign evaluation with title {}.", dto.getTitle());
        CampaignEvaluation save = campaignEvaluationRepository.save(campaignEvaluation);
        return ResponseEntity.ok().body(save);
    }

    @Override
    public ResponseEntity<?> getAllCampaignEvaluation() {
        log.info("Fetching all campaign evaluations.");
        Set<GetAllCampaignEvaluationDto> getAllCampaignEvaluationDtos = new HashSet<>();

        campaignEvaluationRepository.findAll().forEach(campaignEvaluation -> {
            List<String> siteNames = companyServiceClient.getSitesByIds(campaignEvaluation.getSiteIds()).stream().map(SiteDto::getLabel).toList();
            List<String> departmentNames = companyServiceClient.getDepartmentsByIds(campaignEvaluation.getDepartmentIds()).stream().map(DepartmentDto::getName).toList();
            List<String> questionnaireNames = campaignEvaluation.getQuestionnaires().stream().map(Questionnaire::getTitle).toList();

            /*******************/
            // Mappage initial vers le DTO
            // 1. Récupérer les IDs des participants
            List<Long> participantIds = campaignEvaluation.getParticipantIds();
            int numParticipants = (participantIds != null) ? participantIds.size() : 0;

            // 2. Calculer le nombre total de questions uniques et récupérer les IDs des questionnaires
            List<Questionnaire> questionnaires = campaignEvaluation.getQuestionnaires();
            int totalUniqueQuestionsInCampaign = 0;
            List<UUID> questionnaireIdsForCampaign = new ArrayList<>();

            if (questionnaires != null) {
                for (Questionnaire questionnaire : questionnaires) {
                    if (questionnaire != null) {
                        questionnaireIdsForCampaign.add(questionnaire.getId());
                        // Assurez-vous que questionnaire.getQuestions() retourne la liste des questions de l'entité Questionnaire
                        if (questionnaire.getQuestions() != null) {
                            totalUniqueQuestionsInCampaign += questionnaire.getQuestions().size();
                        }
                    }
                }
            }

            int progress = 0;

            // Si aucun participant ou aucune question, la progression est de 0.
            if (numParticipants == 0 || totalUniqueQuestionsInCampaign == 0) {
                progress = 0;
            } else {
                // 3. Calculer le nombre total de réponses attendues
                long totalExpectedQuestionInstancesToAnswer = (long) numParticipants * totalUniqueQuestionsInCampaign;

                int numberOfValidResponses = 0;

                // S'assurer qu'il y a des participants et des IDs de questionnaire avant de requêter
                if (!questionnaireIdsForCampaign.isEmpty()) {
                    // 4. Récupérer les réponses des utilisateurs pour cette campagne
                    List<UserResponse> relevantUserResponses = userResponseRepository.findByQuestionnaireIdInAndUserIdIn(questionnaireIdsForCampaign, participantIds);

                    if (relevantUserResponses != null) {
                        // 5. Compter les réponses complétées
                        for (UserResponse userResponse : relevantUserResponses) {
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
                    }
                }

                // 6. Calculer le pourcentage de progression
                if (totalExpectedQuestionInstancesToAnswer > 0) {
                    progress = (int) ((numberOfValidResponses * 100L) / totalExpectedQuestionInstancesToAnswer);
                }
            }
            /*******************/


            GetAllCampaignEvaluationDto getAllCampaignEvaluationDto = EvaluationUtilMethods.mapToAllCampaignEvaluationDto(campaignEvaluation);
            getAllCampaignEvaluationDto.setSite(!siteNames.isEmpty() ? String.join(",", siteNames) : null);
            getAllCampaignEvaluationDto.setDepartment(!departmentNames.isEmpty() ? String.join(",", departmentNames) : null);
            getAllCampaignEvaluationDto.setQuestionnaire(!questionnaireNames.isEmpty() ? String.join(",", questionnaireNames) : null);
            getAllCampaignEvaluationDto.setProgress(progress);
            getAllCampaignEvaluationDtos.add(getAllCampaignEvaluationDto);
        });

        log.info("Returning {} campaign evaluations.", getAllCampaignEvaluationDtos.size());
        return ResponseEntity.ok().body(getAllCampaignEvaluationDtos);
    }

    @Override
    public ResponseEntity<?> getCampaignEvaluationEditDetails(UUID id) {
        CampaignEvaluation campaignEvaluation = campaignEvaluationRepository.findById(id).orElseThrow(RuntimeException::new);
        List<UUID> questionnaireIds = campaignEvaluation.getQuestionnaires().stream().map(Questionnaire::getId).toList();
        return ResponseEntity.ok().body(EvaluationUtilMethods.mapToGetCampaignEvaluationEditDetailsDto(campaignEvaluation, questionnaireIds));
    }

    @Override
    public ResponseEntity<?> updateCampaignEvaluation(UUID id, UpdateCampaignEvaluationDto updateCampaignEvaluationDto) {
        CampaignEvaluation campaignEvaluation = campaignEvaluationRepository.findById(id).orElseThrow(RuntimeException::new);
        campaignEvaluation.setTitle(updateCampaignEvaluationDto.getTitle());
        campaignEvaluation.setSiteIds(updateCampaignEvaluationDto.getSiteIds());
        campaignEvaluation.setDepartmentIds(updateCampaignEvaluationDto.getDepartmentIds());
        campaignEvaluation.setParticipantIds(updateCampaignEvaluationDto.getParticipantIds());
        campaignEvaluation.setModificationDate(LocalDate.now());
        campaignEvaluation.setInstructions(updateCampaignEvaluationDto.getInstructions());
        CampaignEvaluation save = campaignEvaluationRepository.save(campaignEvaluation);
        return ResponseEntity.ok().body(save);
    }

    @Override
    public ResponseEntity<?> deleteCampaignEvaluation(UUID id) {
        CampaignEvaluation campaignEvaluation = campaignEvaluationRepository.findById(id).orElseThrow(RuntimeException::new);
        campaignEvaluationRepository.delete(campaignEvaluation);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> publishCampaign(PublishCampaignDto publishCampaignDto) {
        CampaignEvaluation campaignEvaluation = campaignEvaluationRepository.findById(publishCampaignDto.getId()).orElseThrow(RuntimeException::new);
        campaignEvaluation.setStatus(publishCampaignDto.getStatus());
        campaignEvaluationRepository.save(campaignEvaluation);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> getCampaignEvaluationDetails(UUID id) {
        List<CampaignEvaluationDetailsDto> campaignEvaluationDetailDtos = new ArrayList<>();

        log.error("Fetching campaign evaluation with ID {}.", id);
        CampaignEvaluation campaignEvaluation = campaignEvaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign evaluation not found with ID: " + id));

        // Récupérer les ids des participants
        List<Long> participantIds = campaignEvaluation.getParticipantIds();
        log.error("Fetching participants with IDs {}.", participantIds);

        // pour chaque id de participants, récupérer son nom, prenom, groupe, manager
        List<Participant> participants = authServiceClient.getParticipants(participantIds);
        if (participants == null) {
            log.debug("Data empty for participants with IDs {}.", participantIds);
            participants = new ArrayList<>(); // Gérer le cas où le service renvoie null
        }

        // les ids des questionnaires dans la campagne
        List<UUID> questionnaireIds = campaignEvaluation.getQuestionnaires().stream()
                .map(Questionnaire::getId)
                .toList();

        // Récuperer la liste des réponses des utilisateurs envoyées par le manager
        List<UserResponse> userResponses = userResponseRepository.findByQuestionnaireIdInAndUserIdInAndIsSentToAdmin(questionnaireIds, participantIds, true);

        /*
         * pour chaque participant, déterminer son statut pour chaque questionnaire :
         * si pour un questionnaire donné, dans les userResponses filtrées, on a au moins une réponse avec isSentToAdmin = true,
         * alors le statut c'est "Terminée" sinon c'est "Brouillon".
         * On récupérera aussi la date de dernière modification si le statut est "Terminée".
         */
        participants.forEach(participant -> {
            questionnaireIds.forEach(questionnaireId -> {
                // Filtrer les réponses pour ce participant et ce questionnaire spécifique qui sont envoyées à l'admin
                List<UserResponse> relevantUserResponses = userResponses.stream()
                        .filter(response -> participant.getId().equals(response.getUserId()) && questionnaireId.equals(response.getQuestionnaireId()))
                        .toList();

                String status;
                LocalDate responseDate = null;

                if (!relevantUserResponses.isEmpty()) {
                    // Si des réponses envoyées à l'admin existent pour cette combinaison, le statut est "Terminée";
                    status = "Terminée";
                    // Trouver la date de dernière modification la plus récente parmi ces réponses
                    responseDate = relevantUserResponses.stream()
                            .map(UserResponse::getLastModifiedDate)
                            .filter(Objects::nonNull) // Filtrer les dates non nulles
                            .max(LocalDate::compareTo) // Trouver la date la plus récente
                            .orElse(null); // Si aucune date trouvée (devrait pas arriver si relevantUserResponses n'est pas vide et les dates sont présentes), mettre null
                } else {
                    // Aucune réponse envoyée à l'admin pour cette combinaison, le statut est "Brouillon"
                    status = "Brouillon";
                    // responseDate reste null
                }

                // Créer le DTO pour cette combinaison participant/questionnaire
                CampaignEvaluationDetailsDto dto = CampaignEvaluationDetailsDto.builder()
                        .id(id)
                        .participantId(participant.getId())
                        .site(participant.getSite())
                        .department(participant.getDepartment())
                        .lastName(participant.getLastName())
                        .firstName(participant.getFirstName())
                        .groupe(participant.getGroupe())
                        .status(status) // Le statut déterminé
                        .manager(participant.getManager())
                        // Formater la date si elle existe, sinon laisser null ou chaîne vide selon votre besoin
                        .responseDate(responseDate != null ? responseDate.toString() : null)
                        .questionnaireId(questionnaireId) // L'ID du questionnaire
                        .build();

                // Ajouter le DTO à la liste
                campaignEvaluationDetailDtos.add(dto);
            });
        });

        // Retourner la liste des DTOs dans un ResponseEntity OK
        return ResponseEntity.ok(campaignEvaluationDetailDtos);
    }

    @Override
    public ResponseEntity<?> deleteUserResponse(Long participantId, UUID questionnaireId) {
        List<UserResponse> byUserIdAndQuestionnaireId = userResponseRepository.findByUserIdAndQuestionnaireId(participantId, questionnaireId);
        userResponseRepository.deleteAll(byUserIdAndQuestionnaireId);
        return ResponseEntity.ok().build();
    }
}