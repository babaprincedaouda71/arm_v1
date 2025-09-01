package org.example.trainingservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class PlanErrorResponse {
    private String message;
    private String code;
    private Map<String, Object> details;
}