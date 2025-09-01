package org.example.trainingservice.web.plan.attendance;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.plan.attendance.AttendanceListDto;
import org.example.trainingservice.dto.plan.attendance.MarkAttendanceRequest;
import org.example.trainingservice.dto.plan.attendance.MarkAttendanceResponseDto;
import org.example.trainingservice.dto.plan.attendance.QRScanResponseDto;
import org.example.trainingservice.service.plan.attendance.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller public pour l'accès via QR code (sans authentification)
 */
@RestController
@Slf4j
@RequestMapping("/api/public/attendance")
public class PublicAttendanceController {

    private final AttendanceService attendanceService;

    public PublicAttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /**
     * Scanner un QR code et récupérer la liste de présence
     * GET /public/attendance/scan/{qrCodeToken}
     */
    @GetMapping("/scan/{qrCodeToken}")
    public ResponseEntity<QRScanResponseDto> scanQRCode(@PathVariable String qrCodeToken) {
        log.info("Public QR scan: {}", qrCodeToken);
        return attendanceService.scanQRCode(qrCodeToken);
    }

    /**
     * Récupérer la liste de présence (accès public)
     * GET /public/attendance/list/{qrCodeToken}
     */
    @GetMapping("/list/{qrCodeToken}")
    public ResponseEntity<AttendanceListDto> getAttendanceList(@PathVariable String qrCodeToken) {
        log.info("Public access to attendance list: {}", qrCodeToken);
        return attendanceService.getAttendanceListByToken(qrCodeToken);
    }

    /**
     * Marquer la présence (accès public)
     * PUT /public/attendance/mark
     */
    @PutMapping("/mark")
    public ResponseEntity<MarkAttendanceResponseDto> markAttendance(@RequestBody MarkAttendanceRequest request) {
        log.info("Public attendance marking for user {} with status {}", request.getUserId(), request.getStatus());
        return attendanceService.markAttendance(request);
    }
}