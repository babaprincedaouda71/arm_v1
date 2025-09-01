package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MarkAttendanceResponseDto {
    private boolean success;
    private String message;
    private AttendanceRecordDto updatedRecord; // Enregistrement mis à jour
    private AttendanceListSummaryDto listSummary; // Résumé mis à jour
}