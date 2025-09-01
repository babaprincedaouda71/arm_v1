package org.example.trainingservice.utils;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.evaluation.*;
import org.example.trainingservice.entity.campaign.CampaignEvaluation;
import org.example.trainingservice.entity.campaign.Question;
import org.example.trainingservice.entity.campaign.Questionnaire;
import org.example.trainingservice.entity.campaign.UserResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
public class EvaluationUtilMethods {
    public static GetAllCampaignEvaluationDto mapToAllCampaignEvaluationDto(CampaignEvaluation campaignEvaluation) {
        return GetAllCampaignEvaluationDto.builder()
                .id(campaignEvaluation.getId())
                .title(campaignEvaluation.getTitle())
                .creationDate(campaignEvaluation.getCreationDate().toString())
                .department(campaignEvaluation.getDepartmentIds().toString())
                .status(campaignEvaluation.getStatus())
                .build();
    }

    public static GetCampaignEvaluationEditDetailsDto mapToGetCampaignEvaluationEditDetailsDto(CampaignEvaluation campaignEvaluation, List<UUID> questionnaireIds) {
        return GetCampaignEvaluationEditDetailsDto.builder()
                .id(campaignEvaluation.getId())
                .title(campaignEvaluation.getTitle())
                .siteIds(campaignEvaluation.getSiteIds())
                .departmentIds(campaignEvaluation.getDepartmentIds())
                .participantIds(campaignEvaluation.getParticipantIds())
                .questionnaireIds(questionnaireIds)
                .instructions(campaignEvaluation.getInstructions())
                .build();
    }

    public static QuestionnaireForCampaignDto mapToQuestionnaireForCampaignDto(Questionnaire questionnaire) {
        return QuestionnaireForCampaignDto.builder()
                .id(questionnaire.getId())
                .title(questionnaire.getTitle())
                .build();
    }

    public static QuestionDto mapToQuestionDto(Question question) {
        return QuestionDto.builder()
                .id(question.getId())
                .companyId(question.getCompanyId())
                .type(question.getType())
                .text(question.getText())
                .options(question.getOptions())
                .levels(question.getLevels())
                .ratingValue(question.getRatingValue())
                .scoreValue(question.getScoreValue())
                .build();
    }

    public static GetUserResponsesDto mapToGetUserResponsesDto(UserResponse userResponse) {
        String startDate = userResponse.getStartDate() != null ? userResponse.getStartDate().toString() : null;
        String lastModifiedDate = userResponse.getLastModifiedDate() != null ? userResponse.getLastModifiedDate().toString() : null;

        log.error("Rating response: {}", userResponse.getRatingResponse());

        return GetUserResponsesDto.builder()
                .id(userResponse.getId())
                .userId(userResponse.getUserId())
                .questionnaireId(userResponse.getQuestionnaireId())
                .questionId(userResponse.getQuestionId())
                .responseType(userResponse.getResponseType())
                .textResponse(userResponse.getTextResponse())
                .commentResponse(userResponse.getCommentResponse())
                .scoreResponse(userResponse.getScoreResponse())
                .ratingResponse(userResponse.getRatingResponse())
                .multipleChoiceResponse(userResponse.getMultipleChoiceResponse())
                .singleChoiceResponse(userResponse.getSingleChoiceResponse())
                .status(userResponse.getStatus())
                .isSentToManager(userResponse.getIsSentToManager())
                .startDate(startDate)
                .lastModifiedDate(lastModifiedDate)
                .companyId(userResponse.getCompanyId())
                .progress(userResponse.getProgression())
                .build();
    }

    public static GetTeamEvaluationsDto mapToGetTeamEvaluationsDto(Questionnaire questionnaire) {
        return null;
    }

    /*
     * Questionnaire
     * */

    /**
     * Convertit une entité Questionnaire en GetQuestionnaireDto.
     *
     * @param questionnaire L'entité Questionnaire à convertir.
     * @return Le GetQuestionnaireDto correspondant.
     */
    public static GetQuestionnaireDto convertToGetQuestionnaireDto(Questionnaire questionnaire) {
        List<GetQuestionDto> questionDtos;
        if (questionnaire.getQuestions() != null) {
            questionDtos = questionnaire.getQuestions().stream()
                    .map(EvaluationUtilMethods::convertToGetQuestionDto) // Appel à la méthode statique
                    .collect(Collectors.toList());
        } else {
            questionDtos = new ArrayList<>();
        }

        return GetQuestionnaireDto.builder()
                .id(questionnaire.getId())
                .title(questionnaire.getTitle())
                .questionnaireType(questionnaire.getType())
                .description(questionnaire.getDescription())
                .creationDate(questionnaire.getCreationDate())
                .questions(questionDtos)
                .isDefault(questionnaire.getDefaultQuestionnaire()) // 🆕 AJOUTÉ
                .build();
    }

    /**
     * Convertit une entité Question en GetQuestionDto.
     *
     * @param question L'entité Question à convertir.
     * @return Le GetQuestionDto correspondant.
     */
    public static GetQuestionDto convertToGetQuestionDto(Question question) {
        return GetQuestionDto.builder()
                .id(question.getId())
                .type(question.getType())
                .text(question.getText())
                .comment(question.getComment())
                .options(question.getOptions())
                .scoreValue(question.getScoreValue())
                .levels(question.getLevels())
                .ratingValue(question.getRatingValue())
                .build();
    }
}