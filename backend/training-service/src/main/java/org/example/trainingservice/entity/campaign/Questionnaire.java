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
@AllArgsConstructor
@NoArgsConstructor
public class Questionnaire {

    @Id
    @GeneratedValue
    private UUID id;

    private Long companyId;

    private String title;
    private String description;
    private String type;
    private LocalDate creationDate;
    private LocalDate modificationDate;

    @ManyToMany(mappedBy = "questionnaires")
    private List<CampaignEvaluation> campaigns;

    @OneToMany
    @JoinColumn(name = "questionnaire_id")
    private List<Question> questions;

    private Boolean defaultQuestionnaire;

}