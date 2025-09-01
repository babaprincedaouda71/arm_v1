package org.example.trainingservice.dto.plan.f4;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponseDto {
    private UUID questionId;
    private String responseType;
    private String textResponse;
    private String commentResponse;
    private Integer scoreResponse;
    private Integer ratingResponse;
    private List<String> multipleChoiceResponse;
    private String singleChoiceResponse;
    private String singleLevelChoiceResponse;
}