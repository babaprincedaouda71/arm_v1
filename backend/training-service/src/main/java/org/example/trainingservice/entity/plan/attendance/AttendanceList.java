package org.example.trainingservice.entity.plan.attendance;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.entity.plan.TrainingGroupe;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendance_lists",
        indexes = {
                @Index(name = "idx_attendance_list_groupe_date",
                        columnList = "training_groupe_id, attendance_date"),
                @Index(name = "idx_attendance_list_qr_token",
                        columnList = "qr_code_token"),
                @Index(name = "idx_attendance_list_company_id",
                        columnList = "company_id"),
                @Index(name = "idx_attendance_list_date",
                        columnList = "attendance_date")
        })
public class AttendanceList {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_groupe_id", nullable = false)
    private TrainingGroupe trainingGroupe;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "pdf_file_path", length = 500)
    private String pdfFilePath;

    @Column(name = "pdf_file_name", length = 255)
    private String pdfFileName;

    @Column(name = "qr_code_token", unique = true, nullable = false, length = 100)
    private String qrCodeToken;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "list_type", length = 20) // 'internal' ou 'csf'
    private String listType;

    @OneToMany(mappedBy = "attendanceList",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @Builder.Default
    private List<AttendanceRecord> attendanceRecords = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
        if (qrCodeToken == null) {
            qrCodeToken = generateQrCodeToken();
        }
    }

    private String generateQrCodeToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}