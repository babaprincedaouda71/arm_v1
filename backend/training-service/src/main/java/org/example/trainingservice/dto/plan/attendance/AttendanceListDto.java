package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class AttendanceListDto {
    private String qrCodeToken;
    private LocalDate attendanceDate;
    private String groupName;
    private String trainingTheme;
    private String listType;
    private String listTypeDescription; // "Liste interne" ou "Liste CSF"
    private Integer totalParticipants;
    private Integer presentCount;
    private Integer absentCount;
    private String createdDate;
    private String pdfFileName;
    private List<AttendanceRecordDto> attendanceRecords;
    private TrainingGroupInfoDto groupInfo; // Infos du groupe pour affichage
}