package org.example.trainingservice.web.evaluations;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.evaluation.*;
import org.example.trainingservice.service.evaluations.CampaignEvaluationService;
import org.example.trainingservice.service.evaluations.MyEvaluationsService;
import org.example.trainingservice.service.evaluations.QuestionnaireService;
import org.example.trainingservice.service.evaluations.TeamEvaluationsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {
    private final QuestionnaireService questionnaireService;
    private final CampaignEvaluationService campaignEvaluationService;
    private final TeamEvaluationsService teamEvaluationsService;
    private final MyEvaluationsService myEvaluationsService;

    public EvaluationController(
            QuestionnaireService questionnaireService,
            CampaignEvaluationService campaignEvaluationService,
            TeamEvaluationsService teamEvaluationsService,
            MyEvaluationsService myEvaluationsService
    ) {
        this.questionnaireService = questionnaireService;
        this.campaignEvaluationService = campaignEvaluationService;
        this.teamEvaluationsService = teamEvaluationsService;
        this.myEvaluationsService = myEvaluationsService;
    }

    /*
     * Questionnaire api
     * */
    @GetMapping("/questionnaire-evaluation/get/all/by-type")
    public ResponseEntity<?> getAllQuestionnairesByType() {
        return questionnaireService.getAllByType();
    }

    @GetMapping("/questionnaire-evaluation/get/all")
    public ResponseEntity<?> getAllQuestionnaire() {
        return questionnaireService.getAllQuestionnaire();
    }

    @PostMapping("/questionnaire-evaluation/add")
    public ResponseEntity<?> addQuestionnaire(@RequestBody AddQuestionnaireDto questionnaire) {
        return questionnaireService.addQuestionnaire(questionnaire);
    }

    @GetMapping("/questionnaire-evaluation/get/questionnaire/{id}")
    public ResponseEntity<?> getQuestionnaireById(@PathVariable UUID id) {
        return questionnaireService.getQuestionnaireById(id);
    }

    @PutMapping("/questionnaire-evaluation/update/questionnaire/{id}")
    public ResponseEntity<?> updateQuestionnaire(@PathVariable UUID id, @RequestBody AddQuestionnaireDto questionnaire) {
        return questionnaireService.updateQuestionnaire(id, questionnaire);
    }

    @PutMapping("/questionnaire-evaluation/update/questionnaire/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable UUID id, @RequestBody UpdateQuestionnaireStatusDto updateQuestionnaireStatusDto) {
        return questionnaireService.updateStatus(id, updateQuestionnaireStatusDto);
    }

    @DeleteMapping("/questionnaire-evaluation/delete/questionnaire/{id}")
    public ResponseEntity<?> deleteQuestionnaire(@PathVariable UUID id) {
        return questionnaireService.deleteQuestionnaire(id);
    }

    /**
     * Récupérer un questionnaire complet avec ses questions
     */
    @GetMapping("/questionnaire/{questionnaireId}")
    public ResponseEntity<?> getQuestionnaireWithQuestions(
            @PathVariable UUID questionnaireId) {
        return questionnaireService.getQuestionnaireWithQuestions(questionnaireId);
    }

    /*
     * Campaign api
     * */
    @PostMapping("/campaign-evaluation/add")
    public ResponseEntity<?> addCampaignEvaluation(@RequestBody AddCampaignEvaluationDto addCampaignEvaluationDto) {
        return campaignEvaluationService.addCampaignEvaluation(addCampaignEvaluationDto);
    }

    @GetMapping("/campaign-evaluation/get/all")
    public ResponseEntity<?> getAllCampaignEvaluation() {
        return campaignEvaluationService.getAllCampaignEvaluation();
    }

    @GetMapping("/campaign-evaluation/get/details/{id}")
    public ResponseEntity<?> getCampaignEvaluationEditDetails(@PathVariable UUID id) {
        return campaignEvaluationService.getCampaignEvaluationEditDetails(id);
    }

    @GetMapping("/campaign-evaluation/details/{id}")
    public ResponseEntity<?> getCampaignEvaluationDetails(@PathVariable UUID id) {
        return campaignEvaluationService.getCampaignEvaluationDetails(id);
    }

    @PutMapping("/campaign-evaluation/update/{id}")
    public ResponseEntity<?> updateCampaignEvaluation(@PathVariable UUID id, @RequestBody UpdateCampaignEvaluationDto updateCampaignEvaluationDto) {
        return campaignEvaluationService.updateCampaignEvaluation(id, updateCampaignEvaluationDto);
    }

    @DeleteMapping("/campaign-evaluation/delete/{id}")
    public ResponseEntity<?> deleteCampaignEvaluation(@PathVariable UUID id) {
        return campaignEvaluationService.deleteCampaignEvaluation(id);
    }

    @PutMapping("/campaign-evaluation/publish")
    public ResponseEntity<?> publishCampaign(@RequestBody PublishCampaignDto publishCampaignDto) {
        return campaignEvaluationService.publishCampaign(publishCampaignDto);
    }

    @DeleteMapping("/campaign-evaluation/delete/user-response/{participantId}/{questionnaireId}")
    public ResponseEntity<?> deleteUserResponse(@PathVariable Long participantId, @PathVariable UUID questionnaireId) {
        return campaignEvaluationService.deleteUserResponse(participantId, questionnaireId);
    }

    /*
     * Team evaluation
     * */
    @GetMapping("/team-evaluations/get/all/{managerId}")
    public ResponseEntity<?> getTeamEvaluations(@PathVariable Long managerId) {
        return teamEvaluationsService.getTeamEvaluations(managerId);
    }

    @GetMapping("/team-evaluations/get/details/{questionnaireId}/{managerId}")
    public ResponseEntity<?> getTeamEvaluationDetails(@PathVariable UUID questionnaireId, @PathVariable Long managerId) {
        return teamEvaluationsService.getTeamEvaluationDetails(questionnaireId, managerId);
    }

    @PutMapping("/team-evaluations/send-evaluation-to-admin/{id}")
    public ResponseEntity<?> sendEvaluationToAdmin(@PathVariable UUID id, @RequestBody SendEvaluationToAdminDto sendEvaluationToAdminDto) {
        return teamEvaluationsService.sendEvaluationToAdmin(id, sendEvaluationToAdminDto);
    }


    // TODO :
    @GetMapping("/admin/groupe-evaluation-details/{groupeEvaluationId}")
    public ResponseEntity<?> getAdminGroupeEvaluationDetails(@PathVariable UUID groupeEvaluationId) {
        log.info("Admin requesting groupe evaluation details for groupeEvaluationId {}", groupeEvaluationId);
        return teamEvaluationsService.getAdminEvaluationDetails(groupeEvaluationId);
    }

    /*
     * My evaluations
     * */
    @GetMapping("/my-evaluations/get/all/{userId}")
    public ResponseEntity<?> getMyEvaluations(@PathVariable Long userId) {
        return myEvaluationsService.getMyEvaluations(userId);
    }

    @PutMapping("/my-evaluations/send-evaluation/{id}")
    public ResponseEntity<?> sendEvaluation(@PathVariable UUID id, @RequestBody SendEvaluationDto sendEvaluationDto) {
        return myEvaluationsService.sendEvaluation(id, sendEvaluationDto);
    }

    /*
     * Questions api
     * */
    @GetMapping("/questions/get/all")
    public ResponseEntity<?> getAllQuestions() {
        return null;
    }


    /*
     * User Response
     * */
    @PostMapping("/user-response/send-user-response/{questionnaireId}")
    public ResponseEntity<?> addUserResponse(@PathVariable UUID questionnaireId, @RequestBody List<AddUserResponseDto> addUserResponseDtos) {
        System.out.println(addUserResponseDtos.toString());
        return myEvaluationsService.addUserResponse(questionnaireId, addUserResponseDtos);
    }

    @GetMapping("/user-response/get/all/{userId}/{questionnaireId}")
    public ResponseEntity<?> getAllUserResponses(@PathVariable Long userId, @PathVariable UUID questionnaireId) {
        log.warn("I'm getting all user responses for user {} and questionnaire {}.", userId, questionnaireId);
        return myEvaluationsService.getAllUserResponses(userId, questionnaireId);
    }

    @GetMapping("/user-response/get/{userId}/{questionnaireId}")
    public ResponseEntity<?> getAllUserQuestionsResponses(@PathVariable Long userId, @PathVariable UUID questionnaireId) {
        log.warn("I'm getting all user questions responses for user {} and questionnaire {}.", userId, questionnaireId);
        return myEvaluationsService.getAllUserQuestionsResponses(userId, questionnaireId);
    }
}