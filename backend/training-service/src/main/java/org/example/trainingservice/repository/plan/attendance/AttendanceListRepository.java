package org.example.trainingservice.repository.plan.attendance;

import org.example.trainingservice.entity.plan.attendance.AttendanceList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceListRepository extends JpaRepository<AttendanceList, UUID> {

    /**
     * Trouver une liste de présence par token QR (pour le scan)
     */
    Optional<AttendanceList> findByQrCodeToken(@Param("qrCodeToken") String qrCodeToken);

    /**
     * Trouver une liste existante pour un groupe/date/type spécifique
     * (utilisé pour vérifier les doublons avant création)
     */
    Optional<AttendanceList> findByTrainingGroupeIdAndAttendanceDateAndListType(
            @Param("groupId") Long groupId,
            @Param("attendanceDate") LocalDate attendanceDate,
            @Param("listType") String listType
    );

    /**
     * Récupérer toutes les listes de présence d'un groupe de formation
     */
    List<AttendanceList> findByTrainingGroupeIdOrderByAttendanceDateDesc(
            @Param("groupId") Long groupId
    );

    /**
     * Récupérer les listes de présence d'un groupe avec pagination
     */
    Page<AttendanceList> findByTrainingGroupeId(
            @Param("groupId") Long groupId,
            Pageable pageable
    );

    /**
     * Récupérer toutes les listes de présence d'une entreprise
     */
    @Query("SELECT al FROM AttendanceList al WHERE al.companyId = :companyId " +
            "ORDER BY al.attendanceDate DESC")
    Page<AttendanceList> findByCompanyIdOrderByAttendanceDateDesc(
            @Param("companyId") Long companyId,
            Pageable pageable
    );

    /**
     * Récupérer les listes par date (pour nettoyage automatique par exemple)
     */
    @Query("SELECT al FROM AttendanceList al WHERE al.attendanceDate = :date")
    List<AttendanceList> findByAttendanceDate(@Param("date") LocalDate date);

    /**
     * Récupérer les listes anciennes (pour archivage)
     */
    @Query("SELECT al FROM AttendanceList al WHERE al.attendanceDate < :beforeDate")
    List<AttendanceList> findOldAttendanceLists(@Param("beforeDate") LocalDate beforeDate);

    /**
     * Compter le nombre de listes pour un groupe
     */
    @Query("SELECT COUNT(al) FROM AttendanceList al WHERE al.trainingGroupe.id = :groupId")
    Long countByTrainingGroupeId(@Param("groupId") Long groupId);

    /**
     * Vérifier si une liste existe déjà pour un groupe/date
     */
    @Query("SELECT COUNT(al) > 0 FROM AttendanceList al " +
            "WHERE al.trainingGroupe.id = :groupId " +
            "AND al.attendanceDate = :attendanceDate " +
            "AND al.listType = :listType")
    boolean existsByGroupDateAndType(
            @Param("groupId") Long groupId,
            @Param("attendanceDate") LocalDate attendanceDate,
            @Param("listType") String listType
    );

    /**
     * Mise à jour en lot du chemin PDF (optimisation pour gros volumes)
     */
    @Modifying
    @Query("UPDATE AttendanceList al SET al.pdfFilePath = :pdfPath " +
            "WHERE al.id = :attendanceListId")
    int updatePdfFilePath(
            @Param("attendanceListId") UUID attendanceListId,
            @Param("pdfPath") String pdfPath
    );

    /**
     * Trouver une liste de présence pour un groupe et une date spécifiques.
     * Idéal car on s'attend à un seul résultat.
     */
    Optional<AttendanceList> findByTrainingGroupeIdAndAttendanceDate(
            @Param("groupId") Long groupId,
            @Param("attendanceDate") LocalDate attendanceDate
    );
}