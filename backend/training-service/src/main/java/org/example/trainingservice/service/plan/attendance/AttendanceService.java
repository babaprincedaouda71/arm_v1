package org.example.trainingservice.service.plan.attendance;

import org.example.trainingservice.dto.plan.attendance.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    /**
     * Sauvegarde une liste de présence générée côté frontend
     * - Reçoit le PDF généré avec jsPDF
     * - Supprime l'ancienne liste si elle existe
     * - Crée les AttendanceRecord pour tous les participants ACCEPTED
     * - Sauvegarde le PDF dans MinIO
     */
    ResponseEntity<?> saveAttendanceList(SaveAttendanceListRequest request);

    /**
     * Récupère une liste de présence via le token QR
     * - Valide que c'est le bon jour
     * - Retourne la liste avec tous les participants et leurs statuts
     */
    ResponseEntity<AttendanceListDto> getAttendanceListByToken(String qrCodeToken);

    /**
     * Scanner un QR code et valider l'accès
     * - Vérifie que le token existe
     * - Vérifie que c'est le bon jour
     * - Retourne les infos de base ou erreur
     */
    ResponseEntity<QRScanResponseDto> scanQRCode(String qrCodeToken);

    /**
     * Marque la présence/absence d'un participant
     * - Valide que c'est le bon jour
     * - Met à jour le statut
     */
    ResponseEntity<MarkAttendanceResponseDto> markAttendance(MarkAttendanceRequest request);

    /**
     * Récupère toutes les listes de présence d'un groupe (résumé)
     */
    ResponseEntity<List<AttendanceListSummaryDto>> getGroupAttendanceLists(Long groupId);

    /**
     * Vérifie si une liste existe déjà pour un groupe/date
     */
    ResponseEntity<AttendanceListExistsDto> checkAttendanceListExists(Long groupId, LocalDate date, String listType);

    /**
     * Télécharge le PDF d'une liste de présence
     */
    ResponseEntity<?> downloadAttendancePDF(String attendanceListId);

    /**
     * Supprime une liste de présence
     */
    ResponseEntity<?> deleteAttendanceList(String attendanceListId);

    /**
     * Récuperer la liste de présence en fonction de la date
     */
    ResponseEntity<?> getAttendanceListPerDate(GetAttendancePerDateDto getAttendancePerDateDto);
}