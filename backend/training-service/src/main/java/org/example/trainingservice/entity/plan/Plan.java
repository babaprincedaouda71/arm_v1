package org.example.trainingservice.entity.plan;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.enums.PlanStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Plan {
    @Id
    @GeneratedValue
    @Column(name = "Identifiant du plan")
    private UUID id;

    @Column(name = "Identifiant de l'entreprise")
    private Long companyId;

    @Column(name = "Titre")
    private String title;

    @Column(name = "Date de début")
    private LocalDate startDate;

    @Column(name = "Date de fin")
    private LocalDate endDate;

    @Column(name = "Exercice")
    private Integer year;

    @Column(precision = 19, scale = 2, name = "Budget prévisionnel")
    private BigDecimal estimatedBudget;

    @Enumerated(EnumType.STRING)
    @Column(name = "État")
    private PlanStatusEnum status;

    @Column(name = "CSF")
    private Boolean isCSFPlan;

    @Column(name = "Validation OFPPT")
    private Boolean isOFPPTValidation;

    // Relation One-to-Many avec Training
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Training> trainings = new ArrayList<>();


}