package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class MyEvaluationsDto {
    private UUID id;
    private String title;
    private String status;
    private String type;
    private String category;
    private String startDate;
    private Integer progress;
    private List<QuestionDto> questions;

    // Nouveau champ ajouté
    private Boolean isSentToManager;
    private Boolean isSentToAdmin;

    // Description optionnelle
    private String description;
}