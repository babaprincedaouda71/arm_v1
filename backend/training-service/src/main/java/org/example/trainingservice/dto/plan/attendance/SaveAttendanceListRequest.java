package org.example.trainingservice.dto.plan.attendance;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
public class SaveAttendanceListRequest {
    private Long groupId;
    private LocalDate attendanceDate;
    private String listType; // "internal" ou "csf"
    private String qrCodeToken; // Token généré côté frontend
    private MultipartFile pdfFile; // PDF généré avec jsPDF
    private List<Long> participantIds; // IDs des participants ACCEPTED
}