package org.example.trainingservice.repository.plan.evaluation;

import org.example.trainingservice.entity.plan.evaluation.GroupeEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupeEvaluationRepo extends JpaRepository<GroupeEvaluation, UUID> {
    List<GroupeEvaluation> findAllByTrainingIdAndGroupeId(UUID trainingId, Long groupeId);

}