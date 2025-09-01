package org.example.trainingservice.repository;

import org.example.trainingservice.entity.plan.TrainingInvitation;
import org.example.trainingservice.enums.InvitationStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface TrainingInvitationRepository extends JpaRepository<TrainingInvitation, UUID> {

    /**
     * Trouver toutes les factures d'un groupe (optimisé)
     */
    @Query("SELECT ti FROM TrainingInvitation ti " +
            "WHERE ti.trainingGroupe.id = :groupId AND ti.isTrainer = false")
    List<TrainingInvitation> findByTrainingGroupeId(@Param("groupId") Long groupId);

    /*
    * Trouver une invitation par groupe et par user
    * */
    @Query("SELECT ti FROM TrainingInvitation ti WHERE ti.trainingGroupe.id = :trainingGroupeId AND ti.userId = :userId")
    TrainingInvitation findByTrainingGroupeIdAndUserId(Long trainingGroupeId, Long userId);

    // Recherche par utilisateur
    Page<TrainingInvitation> findByUserIdAndCompanyIdOrderByInvitationDateDesc(
            Long userId, Long companyId, Pageable pageable);

    // Recherche par groupe de formation
    List<TrainingInvitation> findByTrainingGroupeIdOrderByInvitationDateDesc(Long trainingGroupeId);

    // Recherche par statut
    @Query("SELECT ti FROM TrainingInvitation ti WHERE ti.trainingGroupe.id = :groupeId AND ti.status = :status")
    List<TrainingInvitation> findByTrainingGroupeIdAndStatus(@Param("groupeId") Long groupeId,
                                                             @Param("status") InvitationStatusEnum status);

    // Vérifier si un utilisateur a déjà une invitation pour un groupe
    Optional<TrainingInvitation> findByUserIdAndTrainingGroupeId(Long userId, Long trainingGroupeId);

    // Statistiques par groupe
    @Query("SELECT ti.status, COUNT(ti) FROM TrainingInvitation ti WHERE ti.trainingGroupe.id = :groupeId GROUP BY ti.status")
    List<Object[]> getInvitationStatsByGroupeId(@Param("groupeId") Long groupeId);

    // Invitations expirées (à traiter par batch)
    @Query("SELECT ti FROM TrainingInvitation ti WHERE ti.status = 'PENDING' AND ti.invitationDate < :expirationDate")
    List<TrainingInvitation> findExpiredInvitations(@Param("expirationDate") LocalDateTime expirationDate);

    // Mise à jour en lot du statut
    @Modifying
    @Query("UPDATE TrainingInvitation ti SET ti.status = :newStatus, ti.responseDate = :responseDate WHERE ti.id IN :ids")
    int updateStatusBatch(@Param("ids") List<UUID> ids,
                          @Param("newStatus") InvitationStatusEnum newStatus,
                          @Param("responseDate") LocalDateTime responseDate);

    // Compter les participants confirmés
    @Query("SELECT COUNT(ti) FROM TrainingInvitation ti WHERE ti.trainingGroupe.id = :groupeId AND ti.status = 'ACCEPTED'")
    Long countAcceptedByGroupeId(@Param("groupeId") Long groupeId);

    // Recherche avec pagination pour l'admin
    @Query("SELECT ti FROM TrainingInvitation ti WHERE ti.companyId = :companyId " +
            "AND (:status IS NULL OR ti.status = :status) " +
            "AND (:userId IS NULL OR ti.userId = :userId)")
    Page<TrainingInvitation> findByCompanyWithFilters(@Param("companyId") Long companyId,
                                                      @Param("status") InvitationStatusEnum status,
                                                      @Param("userId") Long userId,
                                                      Pageable pageable);

    List<TrainingInvitation> findByUserId(Long userId);

    // Ajouter cette méthode dans TrainingInvitationRepository
    /**
     * Récupère les IDs des utilisateurs qui ont des invitations avec un statut différent de NOT_SENT
     */
    @Query("SELECT DISTINCT ti.userId FROM TrainingInvitation ti " +
            "WHERE ti.trainingGroupe.id = :groupeId " +
            "AND ti.status != org.example.trainingservice.enums.InvitationStatusEnum.NOT_SENT")
    Set<Long> findUserIdsWithSentInvitationsByGroupeId(@Param("groupeId") Long groupeId);

    @Query("SELECT ti FROM TrainingInvitation ti WHERE ti.userId IN :attr0")
    List<TrainingInvitation> findAllByUserIds(List<Long> attr0);
}