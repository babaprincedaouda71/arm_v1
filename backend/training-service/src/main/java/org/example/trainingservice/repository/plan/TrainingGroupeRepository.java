package org.example.trainingservice.repository.plan;

import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingGroupeRepository extends JpaRepository<TrainingGroupe, Long> {
    // À ajouter dans TrainingGroupeRepository.java

    /**
     * Requête native PostgreSQL optimisée pour les arrays bigint[]
     * Retourne directement les entités avec mapping automatique
     */
    @Query(value = "SELECT tg.* FROM training_groupe tg " +
            "WHERE tg.company_id = :companyId " +
            "AND tg.user_group_ids IS NOT NULL " +
            "AND :userId = ANY(tg.user_group_ids) " +
            "AND tg.status IN ('PLANNED', 'IN_PROGRESS') " +
            "ORDER BY tg.id DESC",
            nativeQuery = true)
    List<TrainingGroupe> findByCompanyIdAndUserGroupIdsContainingNative(
            @Param("companyId") Long companyId,
            @Param("userId") Long userId
    );

    @Query(value = "SELECT tg.* FROM training_groupe tg " +
            "WHERE tg.company_id = :companyId " +
            "AND tg.user_group_ids IS NOT NULL " +
            "AND :userId = ANY(tg.user_group_ids) " +
            "AND tg.status IN ('COMPLETED', 'CANCELLED') " +
            "ORDER BY tg.id DESC",
            nativeQuery = true)
    List<TrainingGroupe> findTrainingGroupeCompleted(
            @Param("companyId") Long companyId,
            @Param("userId") Long userId
    );

    /**
     * Trouve tous les groupes avec les statuts spécifiés
     * Utilisé pour la mise à jour automatique (exclut DRAFT)
     */
    List<TrainingGroupe> findByStatusIn(List<GroupeStatusEnums> statuses);
}