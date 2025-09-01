package org.example.trainingservice.entity.plan;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.enums.NeedSource;
import org.example.trainingservice.enums.TrainingStatusEnum;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "formations")
public class Training {
    @Id
    @GeneratedValue
    private UUID id;

    private Long companyId;

    private Long strategicAxeId;

    private String strategicAxeName;

    private List<Long> siteIds;

    private List<String> siteNames;

    private List<Long> departmentIds;

    private List<String> departmentNames;

    private Long domainId;

    private String domainName;

    private Long qualificationId;

    private String qualificationName;

    private String theme;

    private int numberOfDay;

    private String type;

    private int numberOfGroup;

    private String objective;

    private String content;

    private Boolean csf;

    private String csfPlanifie;

    private String creationDate;

    private NeedSource source;

    @Enumerated(EnumType.STRING)
    private TrainingStatusEnum status;

    @OneToMany(mappedBy = "training", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<TrainingGroupe> groupes;

    @Column(name = "exercice")
    private Integer year;

    private String wishDate;

    private Long requesterId;

    private String requesterName;

    private Long approverId;

    private String learningMode;

    private String questionnaire;

    // Relation Many-to-One avec Plan
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    @JsonBackReference  // Évite la sérialisation circulaire
    private Plan plan;

    // pour vérifier si tous les champs sont remplis
    private Boolean isAllFieldsFilled;
    public boolean isComplete() {
        return this.companyId != null &&
                this.siteIds != null &&
                this.departmentIds != null &&
                this.domainId != null &&
                this.numberOfDay != 0 &&
                this.numberOfGroup != 0 &&
                this.qualificationId != null &&
                this.theme != null &&
                this.type != null &&
                this.objective != null &&
                this.content != null &&
                this.csf != null &&
                this.csfPlanifie != null &&
                this.groupes != null &&
                this.plan != null;
    }
}