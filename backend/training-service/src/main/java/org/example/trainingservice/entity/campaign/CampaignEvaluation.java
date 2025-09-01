package org.example.trainingservice.entity.campaign;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignEvaluation {

    @Id
    @GeneratedValue
    private UUID id;

    private Long companyId;

    private String title;
    private String description;
    private LocalDate creationDate;
    private LocalDate modificationDate;
    private String status;

    @ElementCollection
    private List<Long> departmentIds;

    @ElementCollection
    private List<Long> siteIds;

    @ElementCollection
    private List<Long> participantIds;

    @ManyToMany
    @JoinTable(
            name = "campaign_questionnaire",
            joinColumns = @JoinColumn(name = "campaign_id"),
            inverseJoinColumns = @JoinColumn(name = "questionnaire_id")
    )
    private List<Questionnaire> questionnaires;

    private String instructions;
}