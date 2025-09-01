package org.example.trainingservice.entity.plan.evaluation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.entity.campaign.Questionnaire;
import org.example.trainingservice.enums.GroupeEvaluationStatusEnums;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "groupe_evaluation")
public class GroupeEvaluation {
    @Id
    @GeneratedValue
    private UUID id;

    private Long companyId;

    private UUID trainingId;

    private Long groupeId;

    private String label;

    private String type;

    private String description;

    private LocalDate creationDate;

    private LocalDate modificationDate;

    private GroupeEvaluationStatusEnums status;

    // Relation avec UN SEUL questionnaire
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire;

    // Participants du groupe d'évaluation
    @ElementCollection
    private List<Long> participantIds;
}