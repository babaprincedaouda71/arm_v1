package org.example.trainingservice.repository.plan.attendance;

import org.example.trainingservice.entity.plan.attendance.AttendanceRecord;
import org.example.trainingservice.enums.AttendanceStatus;
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
import java.util.UUID;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, UUID> {

    /**
     * Trouver un enregistrement de présence par liste et utilisateur
     * (utilisé pour le marquage de présence)
     */
    Optional<AttendanceRecord> findByAttendanceList_IdAndUserId(UUID attendanceListId, Long userId);


    /**
     * Récupérer tous les enregistrements d'une liste de présence
     */
    @Query("SELECT ar FROM AttendanceRecord ar " +
            "WHERE ar.attendanceList.id = :attendanceListId " +
            "ORDER BY ar.userFullName ASC")
    List<AttendanceRecord> findByAttendanceListIdOrderByUserFullName(
            @Param("attendanceListId") UUID attendanceListId
    );

    /**
     * Récupérer les enregistrements par statut pour une liste
     */
    @Query("SELECT ar FROM AttendanceRecord ar " +
            "WHERE ar.attendanceList.id = :attendanceListId " +
            "AND ar.status = :status " +
            "ORDER BY ar.userFullName ASC")
    List<AttendanceRecord> findByAttendanceListIdAndStatus(
            @Param("attendanceListId") UUID attendanceListId,
            @Param("status") AttendanceStatus status
    );

    /**
     * Compter les présents/absents pour une liste
     */
    @Query("SELECT ar.status, COUNT(ar) FROM AttendanceRecord ar " +
            "WHERE ar.attendanceList.id = :attendanceListId " +
            "GROUP BY ar.status")
    List<Object[]> countByStatusForAttendanceList(
            @Param("attendanceListId") UUID attendanceListId
    );

    /**
     * Récupérer l'historique de présence d'un utilisateur
     */
    @Query("SELECT ar FROM AttendanceRecord ar " +
            "JOIN ar.attendanceList al " +
            "WHERE ar.userId = :userId " +
            "AND al.companyId = :companyId " +
            "ORDER BY al.attendanceDate DESC")
    Page<AttendanceRecord> findUserAttendanceHistory(
            @Param("userId") Long userId,
            @Param("companyId") Long companyId,
            Pageable pageable
    );

    /**
     * Récupérer les présences d'un groupe de formation
     */
    @Query("SELECT ar FROM AttendanceRecord ar " +
            "JOIN ar.attendanceList al " +
            "WHERE al.trainingGroupe.id = :groupId " +
            "ORDER BY al.attendanceDate DESC, ar.userFullName ASC")
    List<AttendanceRecord> findByTrainingGroupeId(@Param("groupId") Long groupId);

    /**
     * Statistiques de présence par groupe
     */
    @Query("SELECT al.attendanceDate, ar.status, COUNT(ar) " +
            "FROM AttendanceRecord ar " +
            "JOIN ar.attendanceList al " +
            "WHERE al.trainingGroupe.id = :groupId " +
            "GROUP BY al.attendanceDate, ar.status " +
            "ORDER BY al.attendanceDate")
    List<Object[]> getAttendanceStatsByGroup(@Param("groupId") Long groupId);

    /**
     * Mise à jour en lot du statut de présence
     */
    @Modifying
    @Query("UPDATE AttendanceRecord ar " +
            "SET ar.status = :status, ar.markedDate = :markedDate, ar.markedBy = :markedBy " +
            "WHERE ar.id IN :recordIds")
    int updateAttendanceStatusBatch(
            @Param("recordIds") List<UUID> recordIds,
            @Param("status") AttendanceStatus status,
            @Param("markedDate") LocalDateTime markedDate,
            @Param("markedBy") Long markedBy
    );

    /**
     * Trouver les enregistrements non marqués (pour rappels)
     */
    @Query("SELECT ar FROM AttendanceRecord ar " +
            "JOIN ar.attendanceList al " +
            "WHERE al.attendanceDate = :date " +
            "AND ar.markedDate IS NULL")
    List<AttendanceRecord> findUnmarkedRecordsForDate(@Param("date") LocalDateTime date);

    /**
     * Supprimer les enregistrements d'une liste (cascade)
     */
    @Modifying
    @Query("DELETE FROM AttendanceRecord ar WHERE ar.attendanceList.id = :attendanceListId")
    int deleteByAttendanceListId(@Param("attendanceListId") UUID attendanceListId);

    /**
     * Vérifier si un utilisateur a des enregistrements de présence
     */
    @Query("SELECT COUNT(ar) > 0 FROM AttendanceRecord ar WHERE ar.userId = :userId")
    boolean existsByUserId(@Param("userId") Long userId);
}