package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QRScanResponseDto {
    private boolean valid;
    private String message;
    private AttendanceListDto attendanceList; // Si valide
    private String errorCode; // Pour gestion d'erreurs spécifiques
}