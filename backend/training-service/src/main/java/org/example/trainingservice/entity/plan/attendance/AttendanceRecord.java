package org.example.trainingservice.entity.plan.attendance;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.enums.AttendanceStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendance_records",
        indexes = {
                @Index(name = "idx_attendance_record_list_user",
                        columnList = "attendance_list_id, user_id"),
                @Index(name = "idx_attendance_record_user_id",
                        columnList = "user_id"),
                @Index(name = "idx_attendance_record_status",
                        columnList = "status"),
                @Index(name = "idx_attendance_record_marked_date",
                        columnList = "marked_date")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_attendance_record_list_user",
                        columnNames = {"attendance_list_id", "user_id"})
        })
public class AttendanceRecord {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_list_id", nullable = false)
    private AttendanceList attendanceList;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_full_name", nullable = false, length = 255)
    private String userFullName;

    @Column(name = "user_email", length = 255)
    private String userEmail;

    @Column(name = "user_code", length = 50) // Code employé pour identification
    private String userCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.ABSENT;

    @Column(name = "marked_date")
    private LocalDateTime markedDate;

    @Column(name = "marked_by")
    private Long markedBy;

    @PreUpdate
    protected void onUpdate() {
        if (status == AttendanceStatus.PRESENT && markedDate == null) {
            markedDate = LocalDateTime.now();
        }
    }

    // Méthode utilitaire pour marquer la présence
    public void markAsPresent(Long markedByUserId) {
        this.status = AttendanceStatus.PRESENT;
        this.markedDate = LocalDateTime.now();
        this.markedBy = markedByUserId;
    }

    // Méthode utilitaire pour marquer l'absence
    public void markAsAbsent(Long markedByUserId) {
        this.status = AttendanceStatus.ABSENT;
        this.markedDate = LocalDateTime.now();
        this.markedBy = markedByUserId;
    }
}