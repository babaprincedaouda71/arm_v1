package org.example.trainingservice.web.plan.attendance;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.plan.attendance.AttendanceListExistsDto;
import org.example.trainingservice.dto.plan.attendance.AttendanceListSummaryDto;
import org.example.trainingservice.dto.plan.attendance.GetAttendancePerDateDto;
import org.example.trainingservice.dto.plan.attendance.SaveAttendanceListRequest;
import org.example.trainingservice.service.plan.attendance.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/plan/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /**
     * Sauvegarder une liste de présence générée côté frontend
     * POST /api/plan/attendance/save-list
     */
    @PostMapping("/save-list")
    public ResponseEntity<?> saveAttendanceList(
            @RequestParam("groupId") Long groupId,
            @RequestParam("attendanceDate") String attendanceDateStr,
            @RequestParam("listType") String listType,
            @RequestParam("qrCodeToken") String qrCodeToken,
            @RequestParam("pdfFile") MultipartFile pdfFile,
            @RequestParam("participantIds") List<Long> participantIds) {

        try {
            log.info("Saving attendance list for group {} on date {}", groupId, attendanceDateStr);

            // Validation des paramètres
            if (groupId == null || attendanceDateStr == null || listType == null ||
                    qrCodeToken == null || pdfFile == null || participantIds == null || participantIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Tous les paramètres sont obligatoires"));
            }

            LocalDate attendanceDate = LocalDate.parse(attendanceDateStr);

            SaveAttendanceListRequest request = new SaveAttendanceListRequest();
            request.setGroupId(groupId);
            request.setAttendanceDate(attendanceDate);
            request.setListType(listType);
            request.setQrCodeToken(qrCodeToken);
            request.setPdfFile(pdfFile);
            request.setParticipantIds(participantIds);

            return attendanceService.saveAttendanceList(request);

        } catch (Exception e) {
            log.error("Error saving attendance list", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de la sauvegarde de la liste de présence"));
        }
    }

    /**
     * Récupérer toutes les listes de présence d'un groupe
     * GET /api/plan/attendance/group/{groupId}/lists
     */
    @GetMapping("/group/{groupId}/lists")
    public ResponseEntity<List<AttendanceListSummaryDto>> getGroupAttendanceLists(@PathVariable Long groupId) {
        log.info("Getting attendance lists for group {}", groupId);
        return attendanceService.getGroupAttendanceLists(groupId);
    }

    /**
     * Vérifier si une liste de présence existe déjà
     * GET /api/plan/attendance/check-exists
     */
    @GetMapping("/check-exists")
    public ResponseEntity<AttendanceListExistsDto> checkAttendanceListExists(
            @RequestParam Long groupId,
            @RequestParam String attendanceDate,
            @RequestParam String listType) {

        try {
            LocalDate date = LocalDate.parse(attendanceDate);
            return attendanceService.checkAttendanceListExists(groupId, date, listType);
        } catch (Exception e) {
            log.error("Error checking attendance list existence", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Télécharger le PDF d'une liste de présence
     * GET /api/plan/attendance/download-pdf/{attendanceListId}
     */
    @GetMapping("/download-pdf/{attendanceListId}")
    public ResponseEntity<?> downloadAttendancePDF(@PathVariable String attendanceListId) {
        log.info("Downloading PDF for attendance list: {}", attendanceListId);
        return attendanceService.downloadAttendancePDF(attendanceListId);
    }

    /**
     * Supprimer une liste de présence
     * DELETE /api/plan/attendance/{attendanceListId}
     */
    @DeleteMapping("/{attendanceListId}")
    public ResponseEntity<?> deleteAttendanceList(@PathVariable String attendanceListId) {
        log.info("Deleting attendance list: {}", attendanceListId);
        return attendanceService.deleteAttendanceList(attendanceListId);
    }

    /**
     * Récuperer la liste de présence en fonction de la date
     */
    @PostMapping("/get-list-per-date")
    public ResponseEntity<?> getAttendanceListPerDate(@RequestBody GetAttendancePerDateDto getAttendancePerDateDto) {
        return attendanceService.getAttendanceListPerDate(getAttendancePerDateDto);
    }
}