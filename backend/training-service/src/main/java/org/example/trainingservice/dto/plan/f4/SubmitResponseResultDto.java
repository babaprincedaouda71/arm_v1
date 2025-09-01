package org.example.trainingservice.dto.plan.f4;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitResponseResultDto {
    private Boolean success;
    private String message;
    private String errorCode;
    private Integer totalResponses;
    private String submissionDate;
}