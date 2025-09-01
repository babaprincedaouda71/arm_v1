package org.example.trainingservice.entity.plan.f4;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.entity.plan.evaluation.GroupeEvaluation;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "evaluation_qr_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationQRToken {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false)
    private Long participantId;

    @Column(nullable = true)
    private String participantFullName;

    @Column(nullable = true)
    private String participantCin;

    @Column(nullable = true)
    private String participantEmail;

    @Column(nullable = true)
    private String participantCnss;

    @Column(name = "groupe_evaluation_id")
    private UUID groupeEvaluationId;

    @Column(nullable = false)
    private Long companyId;

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private Boolean isUsed;

    @Column
    private LocalDateTime usedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "groupe_evaluation_id", insertable = false, updatable = false)
    private GroupeEvaluation groupeEvaluation;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.isUsed = false;
        // Token valide pendant 30 jours par défaut
        this.expiryDate = this.createdDate.plusDays(30);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

    public boolean isValid() {
        return !this.isUsed && !this.isExpired();
    }

    public void markAsUsed() {
        this.isUsed = true;
        this.usedDate = LocalDateTime.now();
    }
}