package org.example.trainingservice.service.evaluations;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.evaluation.*;
import org.example.trainingservice.entity.campaign.Question;
import org.example.trainingservice.entity.campaign.Questionnaire;
import org.example.trainingservice.repository.evaluation.QuestionRepository;
import org.example.trainingservice.repository.evaluation.QuestionnaireRepository;
import org.example.trainingservice.utils.EvaluationUtilMethods;
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
public class QuestionnaireServiceImpl implements QuestionnaireService {
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionRepository questionRepository;

    public QuestionnaireServiceImpl(QuestionnaireRepository questionnaireRepository, QuestionRepository questionRepository) {
        this.questionnaireRepository = questionnaireRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public ResponseEntity<?> getAllQuestionnaire() {
        List<QuestionnaireForCampaignDto> all = questionnaireRepository.findAll()
                .stream()
                .map(
                        EvaluationUtilMethods::mapToQuestionnaireForCampaignDto
                ).toList();
        return ResponseEntity.ok().body(all);
    }

    @Override
    public ResponseEntity<?> addQuestionnaire(AddQuestionnaireDto questionnaireDto) {
        Long currentCompanyId = SecurityUtils.getCurrentCompanyId();

        // "le premier à être ajouté sera default"
        boolean isToBeDefault = !questionnaireRepository.existsByCompanyIdAndDefaultQuestionnaireTrueAndType(currentCompanyId, questionnaireDto.getQuestionnaireType());

        // Création du Questionnaire
        Questionnaire questionnaireToSave = Questionnaire.builder()
                .title(questionnaireDto.getTitle())
                .companyId(currentCompanyId)
                .type(questionnaireDto.getQuestionnaireType())
                .description(questionnaireDto.getDescription())
                .creationDate(LocalDate.now())
                .defaultQuestionnaire(isToBeDefault)
                .questions(new ArrayList<>()) // Initialisation de la liste des questions
                .build();

        // Sauvegarde du Questionnaire en premier pour obtenir un ID
        Questionnaire savedQuestionnaire = questionnaireRepository.save(questionnaireToSave);

        // Récupération de la liste des DTO de questions
        List<AddQuestionDto> questionsDtoList = questionnaireDto.getQuestions();
        List<Question> questionsToSave = new ArrayList<>();

        if (questionsDtoList != null && !questionsDtoList.isEmpty()) {
            buildQuestions(currentCompanyId, savedQuestionnaire, questionsDtoList, questionsToSave);
            // Sauvegarde de toutes les questions
            questionRepository.saveAll(questionsToSave);

            // Mise à jour du questionnaire sauvegardé avec la liste des questions
            savedQuestionnaire.setQuestions(questionsToSave);
            return ResponseEntity.ok().build();
        } else {
            // Si pas de questions, on sauvegarde juste le questionnaire
            savedQuestionnaire.setQuestions(new ArrayList<>()); // Pour être explicite
            return ResponseEntity.ok().build();
        }

    }

    @Override
    public ResponseEntity<?> getAllByType() {
        List<Object[]> allByTypeAndCompanyId = questionnaireRepository.findAllByTypeAndCompanyId(SecurityUtils.getCurrentCompanyId());
        log.error("Evaluation by type : {}.", allByTypeAndCompanyId.size());
        Map<String, Map<String, Object>> groupedData = new HashMap<>();

        for (Object[] objects : allByTypeAndCompanyId) {
            UUID questionnaireId = (UUID) objects[0];
            String type = (String) objects[1];
            String title = (String) objects[2];
            Boolean isDefault = (Boolean) objects[3];

            groupedData.computeIfAbsent(type, k -> {
                Map<String, Object> typeData = new HashMap<>();
                typeData.put("type", type);
                typeData.put("questionnaires", new ArrayList<Map<String, Object>>());
                return typeData;
            });

            Map<String, Object> typeData = groupedData.get(type);
            ((List<Map<String, Object>>) typeData.get("questionnaires")).add(Map.of("id", questionnaireId, "type", type, "title", title, "isDefault", isDefault));
        }

        return ResponseEntity.ok((new ArrayList<>(groupedData.values())));
    }


    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> getQuestionnaireById(UUID questionnaireId) {
        Long currentCompanyId = SecurityUtils.getCurrentCompanyId();

        if (currentCompanyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Company ID non trouvé pour l'utilisateur courant.");
        }

        // 🔧 UTILISATION de la nouvelle méthode optimisée
        Optional<Questionnaire> questionnaireOpt = questionnaireRepository.findByCompanyIdAndIdWithQuestions(currentCompanyId, questionnaireId);

        if (questionnaireOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Questionnaire non trouvé avec l'ID : " + questionnaireId);
        }

        Questionnaire questionnaire = questionnaireOpt.get();

        // Vérification de sécurité : le questionnaire appartient-il à l'entreprise de l'utilisateur ?
        if (!questionnaire.getCompanyId().equals(currentCompanyId)) {
            log.warn("Tentative d'accès non autorisé au questionnaire {} par l'entreprise {}", questionnaireId, currentCompanyId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès non autorisé à ce questionnaire.");
        }

        // Mapper l'entité Questionnaire en GetQuestionnaireDto
        GetQuestionnaireDto questionnaireDto = EvaluationUtilMethods.convertToGetQuestionnaireDto(questionnaire);

        log.debug("Questionnaire {} récupéré avec succès pour l'entreprise {}. Nombre de questions: {}",
                questionnaireId, currentCompanyId, questionnaire.getQuestions() != null ? questionnaire.getQuestions().size() : 0);

        return ResponseEntity.ok(questionnaireDto);
    }

    /**
     * Met à jour un questionnaire existant.
     *
     * @param questionnaireId  L'ID (UUID) du questionnaire à mettre à jour.
     * @param questionnaireDto Les données de mise à jour du questionnaire.
     * @return ResponseEntity indiquant le succès ou l'échec de l'opération.
     */
    @Transactional
    @Override
    public ResponseEntity<?> updateQuestionnaire(UUID questionnaireId, AddQuestionnaireDto questionnaireDto) {
        Long currentCompanyId = SecurityUtils.getCurrentCompanyId();
        if (currentCompanyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Company ID non trouvé pour l'utilisateur courant.");
        }

        Optional<Questionnaire> optionalQuestionnaire = questionnaireRepository.findById(questionnaireId);
        if (optionalQuestionnaire.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Questionnaire non trouvé avec l'ID : " + questionnaireId);
        }

        Questionnaire questionnaireToUpdate = optionalQuestionnaire.get();

        questionnaireToUpdate.setTitle(questionnaireDto.getTitle());
        questionnaireToUpdate.setType(questionnaireDto.getQuestionnaireType());
        questionnaireToUpdate.setDescription(questionnaireDto.getDescription());
        questionnaireToUpdate.setModificationDate(LocalDate.now()); // Mettre à jour la date de modification

        // Gérer les questions associées (Stratégie : Supprimer les anciennes, ajouter les nouvelles)
        // 1. Supprimer les anciennes questions explicitement car pas d'orphanRemoval=true
        questionRepository.deleteByQuestionnaireId(questionnaireToUpdate.getId());

        // 2. Nettoyer la collection dans l'entité en mémoire
        questionnaireToUpdate.getQuestions().clear(); // Important pour la cohérence de l'objet en mémoire

        // 3. Créer et ajouter les nouvelles questions à partir du DTO
        List<AddQuestionDto> questionsDtoList = questionnaireDto.getQuestions();
        List<Question> newQuestions = new ArrayList<>();

        if (questionsDtoList != null && !questionsDtoList.isEmpty()) {
            buildQuestions(currentCompanyId, questionnaireToUpdate, questionsDtoList, newQuestions);
            List<Question> savedNewQuestions = questionRepository.saveAll(newQuestions);
            questionnaireToUpdate.setQuestions(savedNewQuestions);
        }
        // Si questionsDtoList est null ou vide, la liste des questions du questionnaire sera vide.

        questionnaireRepository.save(questionnaireToUpdate);

        return ResponseEntity.ok().body("Questionnaire mis à jour avec succès. ID: " + questionnaireToUpdate.getId());
    }

    @Transactional
    @Override
    public ResponseEntity<?> updateStatus(UUID id, UpdateQuestionnaireStatusDto updateQuestionnaireStatusDto) {
        Long currentCompanyId = SecurityUtils.getCurrentCompanyId();
        String questionnaireType = updateQuestionnaireStatusDto.getQuestionnaireType();
        Optional<Questionnaire> byTypeAndCompanyIdAndDefaultQuestionnaireTrue = questionnaireRepository.findByTypeAndCompanyIdAndDefaultQuestionnaireTrue(questionnaireType, currentCompanyId);
        Questionnaire questionnaireToUpdate = byTypeAndCompanyIdAndDefaultQuestionnaireTrue.get();
        questionnaireToUpdate.setDefaultQuestionnaire(false);

        questionnaireRepository.save(questionnaireToUpdate);

        Questionnaire questionnaire = questionnaireRepository.findById(id).get();
        questionnaire.setDefaultQuestionnaire(true);
        questionnaireRepository.save(questionnaire);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> deleteQuestionnaire(UUID id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id).orElseThrow(RuntimeException::new);
        questionnaireRepository.delete(questionnaire);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> getQuestionnaireWithQuestions(UUID questionnaireId) {
        log.info("Récupération du questionnaire complet: {}", questionnaireId);

        try {
            // Utiliser la méthode existante qui charge les questions
            Optional<Questionnaire> questionnaireOpt = questionnaireRepository
                    .findByCompanyIdAndIdWithQuestions(SecurityUtils.getCurrentCompanyId(), questionnaireId);

            if (questionnaireOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Questionnaire questionnaire = questionnaireOpt.get();

            // Convertir en DTO
            Map<String, Object> response = new HashMap<>();
            response.put("id", questionnaire.getId());
            response.put("title", questionnaire.getTitle());
            response.put("description", questionnaire.getDescription());
            response.put("type", questionnaire.getType());

            // Convertir les questions
            List<Map<String, Object>> questionDtos = questionnaire.getQuestions().stream()
                    .map(question -> {
                        Map<String, Object> dto = new HashMap<>();
                        dto.put("id", question.getId());
                        dto.put("type", question.getType());
                        dto.put("text", question.getText());
                        dto.put("comment", question.getComment());
                        dto.put("options", question.getOptions());
                        dto.put("levels", question.getLevels());
                        dto.put("required", true); // Toutes les questions sont obligatoires
                        return dto;
                    })
                    .collect(Collectors.toList());

            response.put("questions", questionDtos);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erreur lors de la récupération du questionnaire: {}", questionnaireId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur interne du serveur"));
        }
    }

    private void buildQuestions(Long currentCompanyId, Questionnaire questionnaireToUpdate, List<AddQuestionDto> questionsDtoList, List<Question> newQuestions) {
        for (AddQuestionDto questionDto : questionsDtoList) {
            Question question = Question.builder()
                    .type(questionDto.getType())
                    .companyId(currentCompanyId)
                    .text(questionDto.getText())
                    .comment(questionDto.getComment())
                    .options(questionDto.getOptions())
                    .scoreValue(questionDto.getScoreValue())
                    .levels(questionDto.getLevels())
                    .ratingValue(questionDto.getRatingValue())
                    .questionnaire(questionnaireToUpdate) // Lier à l'entité Questionnaire mise à jour
                    .build();
            // L'ID UUID de la question sera auto-généré
            newQuestions.add(question);
        }
    }
}