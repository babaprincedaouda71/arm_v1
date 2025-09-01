package org.example.trainingservice.service.evaluations;

import org.example.trainingservice.dto.evaluation.AddQuestionnaireDto;
import org.example.trainingservice.dto.evaluation.UpdateQuestionnaireStatusDto;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public interface QuestionnaireService {
    ResponseEntity<?> getAllQuestionnaire();

    ResponseEntity<?> addQuestionnaire(AddQuestionnaireDto questionnaire);

    ResponseEntity<?> getAllByType();

    ResponseEntity<?> getQuestionnaireById(UUID id);

    @Transactional
    ResponseEntity<?> updateQuestionnaire(UUID questionnaireId, AddQuestionnaireDto questionnaireDto);

    ResponseEntity<?> updateStatus(UUID id, UpdateQuestionnaireStatusDto updateQuestionnaireStatusDto);

    ResponseEntity<?> deleteQuestionnaire(UUID id);

    ResponseEntity<?> getQuestionnaireWithQuestions(UUID questionnaireId);
}