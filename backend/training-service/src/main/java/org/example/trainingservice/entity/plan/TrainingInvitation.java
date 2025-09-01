package org.example.trainingservice.entity.plan;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.enums.InvitationStatusEnum;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "training_invitations",
        indexes = {
                @Index(name = "idx_training_groupe_id", columnList = "training_groupe_id"),
                @Index(name = "idx_user_id", columnList = "user_id"),
                @Index(name = "idx_status", columnList = "status"),
                @Index(name = "idx_company_id", columnList = "company_id"),
                @Index(name = "idx_invitation_date", columnList = "invitation_date")
        })
public class TrainingInvitation {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_groupe_id", nullable = false)
    private TrainingGroupe trainingGroupe;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Builder.Default
    private Boolean isTrainer = false;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InvitationStatusEnum status;

    @Column(name = "invitation_date")
    private LocalDate invitationDate;

    @Column(name = "response_date")
    private LocalDate responseDate;

    @Column(name = "invited_by")
    private Long invitedBy;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "thème de la formation")
    private String trainingTheme;

    @Column(name = "Identifiant de la formation")
    private UUID trainingId;

    @Column(name = "Nom du groupe")
    private String groupeName;

    @Column(name = "Nom du formateur")
    private String trainerName;

    @Column(name = "Nombre de participants")
    private Integer participantCount;

    @Column(name = "Lieu")
    private String location;

    @Column(name = "Ville")
    private String city;

    @Column(name = "Dates de formations")
    private List<String> dates;

    @Column(name = "notes")
    private String notes;

    // Optimisation pour éviter les requêtes supplémentaires
    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "user_full_name")
    private String userFullName;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = InvitationStatusEnum.NOT_SENT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (status != InvitationStatusEnum.PENDING && responseDate == null) {
            responseDate = LocalDate.now();
        }
    }
}