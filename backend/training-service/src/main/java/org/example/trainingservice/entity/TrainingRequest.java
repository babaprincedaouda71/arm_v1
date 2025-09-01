package org.example.trainingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.trainingservice.enums.TrainingRequestStatus;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long companyId;

    @Column(name = "annee")
    private Integer year;

    private Long domainId;

    @Column(name = "domaine")
    private String domainName;

    @Column(name = "theme")
    private String theme;

    private Long siteId;

    @Column(name = "site")
    private String siteName;

    private Long departmentId;

    @Column(name = "departement")
    private String departmentName;

    @Column(name = "date_soumission")
    private LocalDate creationDate;

    @Column(name = "date_souhaitee")
    private LocalDate wishDate;

    private Long requesterId;

    @Column(name = "demandeur")
    private String requesterName;

    @Column(name = "id_manager")
    private Long managerId;

    @Column(name = "valide_par")
    private String approver;

    @Column(name = "objectif")
    private String objective;

    @Column(name = "contenu")
    private String content;

    @Column(name = "mode_formation")
    private String learningMode;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TrainingRequestStatus status;
}