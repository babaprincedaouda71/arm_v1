package org.example.trainingservice.repository.evaluation;

import org.example.trainingservice.entity.campaign.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, UUID> {
    @Query("SELECT qs.id, qs.type, qs.title, qs.defaultQuestionnaire FROM Questionnaire qs WHERE qs.companyId = :currentCompanyId ORDER BY qs.type")
    List<Object[]> findAllByTypeAndCompanyId(Long currentCompanyId);

    Optional<Questionnaire> findByCompanyIdAndId(Long companyId, UUID id);

    boolean existsByCompanyIdAndDefaultQuestionnaireTrueAndType(Long companyId, String type);

    /**
     * Trouve le questionnaire par défaut actuel pour une entreprise donnée.
     *
     * @param companyId L'ID de l'entreprise.
     * @return Un Optional contenant le questionnaire par défaut s'il existe.
     */
    Optional<Questionnaire> findByTypeAndCompanyIdAndDefaultQuestionnaireTrue(String type, Long companyId);

    /**
     * Met à false le drapeau defaultQuestionnaire pour tous les questionnaires d'une entreprise.
     * Utile pour s'assurer qu'un seul est actif.
     *
     * @Modifying indique que cette requête modifie l'état de la base de données.
     */
    @Modifying
    @Query("UPDATE Questionnaire q SET q.defaultQuestionnaire = false WHERE q.companyId = :companyId AND q.defaultQuestionnaire = true")
    void unsetDefaultForCompany(Long companyId);

    // 🆕 NOUVELLE MÉTHODE pour charger avec les questions
    /**
     * Trouve un questionnaire par son ID et companyId en chargeant également ses questions.
     * Utilise LEFT JOIN FETCH pour éviter les requêtes N+1.
     *
     * @param companyId L'ID de l'entreprise
     * @param id L'UUID du questionnaire
     * @return Un Optional contenant le questionnaire avec ses questions chargées
     */
    @Query("SELECT q FROM Questionnaire q LEFT JOIN FETCH q.questions WHERE q.companyId = :companyId AND q.id = :id")
    Optional<Questionnaire> findByCompanyIdAndIdWithQuestions(Long companyId, UUID id);
}