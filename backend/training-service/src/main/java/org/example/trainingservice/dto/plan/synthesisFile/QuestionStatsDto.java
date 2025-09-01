package org.example.trainingservice.dto.plan.synthesisFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionStatsDto {
    private UUID questionId;
    private String questionText;
    private String questionType;
    private int totalResponses;
    private Map<String, Double> optionPercentages; // Option -> Pourcentage
}