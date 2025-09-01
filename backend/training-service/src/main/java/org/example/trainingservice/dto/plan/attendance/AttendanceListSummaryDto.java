package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AttendanceListSummaryDto {
    private String attendanceListId;
    private LocalDate attendanceDate;
    private String listType;
    private String listTypeDescription;
    private Integer totalParticipants;
    private Integer presentCount;
    private Integer absentCount;
    private Double attendanceRate; // Taux de présence en %
    private String pdfFileName;
    private String createdDate;
    private boolean canEdit; // Si on peut encore scanner/modifier
}