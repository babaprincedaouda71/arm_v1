package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GetUserResponsesDto {
    private UUID id;
    private Long companyId;
    private Long userId;
    private UUID questionnaireId;
    private UUID questionId;
    private String responseType;
    private String textResponse;
    private String commentResponse;
    private Integer scoreResponse;
    private Integer ratingResponse;
    private List<String> multipleChoiceResponse;
    private String singleChoiceResponse;
    private String status;
    private Boolean isSentToManager;
    private String startDate;
    private String lastModifiedDate;
    private Integer progress;
    private UUID campaignEvaluationId;
}