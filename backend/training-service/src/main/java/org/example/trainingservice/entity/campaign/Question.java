package org.example.trainingservice.entity.campaign;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue
    private UUID id;

    private Long companyId;

    private String type;
    private String text;
    private String comment;

    @ElementCollection
    private List<String> options;

    @ManyToOne
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire;

    private Integer ratingValue;

    private Integer scoreValue;

    @ElementCollection
    private List<String> levels;

    // More fields can be added here
}