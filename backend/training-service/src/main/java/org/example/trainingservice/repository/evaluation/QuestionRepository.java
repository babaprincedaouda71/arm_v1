package org.example.trainingservice.repository.evaluation;

import org.example.trainingservice.entity.campaign.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    void deleteByQuestionnaireId(UUID id);
}