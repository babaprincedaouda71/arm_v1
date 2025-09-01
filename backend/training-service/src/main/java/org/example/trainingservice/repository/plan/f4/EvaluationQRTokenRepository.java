package org.example.trainingservice.repository.plan.f4;

import org.example.trainingservice.entity.plan.f4.EvaluationQRToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EvaluationQRTokenRepository extends JpaRepository<EvaluationQRToken, UUID> {

    /**
     * Trouver un token par sa valeur
     */
    Optional<EvaluationQRToken> findByToken(@Param("token") String token);

    /**
     * Trouver un token par participant et évaluation de groupe
     */
    Optional<EvaluationQRToken> findByParticipantIdAndGroupeEvaluationId(
            @Param("participantId") Long participantId,
            @Param("groupeEvaluationId") UUID groupeEvaluationId
    );

    /**
     * Récupérer tous les tokens d'une évaluation de groupe
     */
    List<EvaluationQRToken> findByGroupeEvaluationIdOrderByCreatedDateDesc(
            @Param("groupeEvaluationId") UUID groupeEvaluationId
    );

    /**
     * Vérifier si un token existe déjà pour un participant et une évaluation
     */
    @Query("SELECT COUNT(t) > 0 FROM EvaluationQRToken t " +
            "WHERE t.participantId = :participantId " +
            "AND t.groupeEvaluationId = :groupeEvaluationId")
    boolean existsByParticipantAndEvaluation(
            @Param("participantId") Long participantId,
            @Param("groupeEvaluationId") UUID groupeEvaluationId
    );

    /**
     * Compter les tokens utilisés pour une évaluation
     */
    @Query("SELECT COUNT(t) FROM EvaluationQRToken t " +
            "WHERE t.groupeEvaluationId = :groupeEvaluationId " +
            "AND t.isUsed = true")
    Long countUsedTokensByEvaluation(@Param("groupeEvaluationId") UUID groupeEvaluationId);

    /**
     * Compter les tokens totaux pour une évaluation
     */
    Long countByGroupeEvaluationId(@Param("groupeEvaluationId") UUID groupeEvaluationId);

    /**
     * Récupérer les tokens expirés (pour nettoyage)
     */
    @Query("SELECT t FROM EvaluationQRToken t WHERE t.expiryDate < :now")
    List<EvaluationQRToken> findExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Supprimer les tokens d'une évaluation de groupe
     */
    void deleteByGroupeEvaluationId(@Param("groupeEvaluationId") UUID groupeEvaluationId);
}