package org.example.trainingservice.dto.evaluation;

import lombok.Data;

import java.util.List;

@Data
public class SendEvaluationToAdminDto {
    private Long userId;
    private List<Long> participantIds;
}