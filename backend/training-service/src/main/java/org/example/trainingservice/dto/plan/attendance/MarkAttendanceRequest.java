package org.example.trainingservice.dto.plan.attendance;

import lombok.Data;

@Data
public class MarkAttendanceRequest {
    private String qrCodeToken;
    private Long userId;
    private String status; // "PRESENT" ou "ABSENT"
    private Long markedBy; // ID de la personne qui marque
}