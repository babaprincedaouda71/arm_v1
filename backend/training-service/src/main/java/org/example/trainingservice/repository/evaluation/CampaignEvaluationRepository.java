package org.example.trainingservice.repository.evaluation;

import org.example.trainingservice.entity.campaign.CampaignEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface CampaignEvaluationRepository extends JpaRepository<CampaignEvaluation, UUID> {
    List<CampaignEvaluation> findByParticipantIdsContains(Long userId);

    List<CampaignEvaluation> findByParticipantIdsContainsAndStatus(Long userId, String status);

    @Query("SELECT DISTINCT ce FROM CampaignEvaluation ce JOIN ce.participantIds pid WHERE pid IN :participantIds AND ce.status = :status")
    List<CampaignEvaluation> findByAnyParticipantIdInAndStatus(@Param("participantIds") Collection<Long> participantIds, @Param("status") String status);
}