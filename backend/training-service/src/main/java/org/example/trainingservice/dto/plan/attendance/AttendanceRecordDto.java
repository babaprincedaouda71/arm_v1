package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceRecordDto {
    private String recordId;
    private Long userId;
    private String userFullName;
    private String userCode;
    private String userEmail;
    private String status; // "PRESENT" ou "ABSENT"
    private String statusDescription; // "présent" ou "absent"
    private String markedDate; // Date/heure de marquage
    private String markedByName; // Nom de la personne qui a marqué
    private Boolean canEdit; // Si on peut encore modifier (selon la date)
}