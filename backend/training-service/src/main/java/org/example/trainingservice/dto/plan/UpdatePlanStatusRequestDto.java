package org.example.trainingservice.dto.plan;

import lombok.Data;

import java.util.UUID;

@Data
public class UpdatePlanStatusRequestDto {
    private UUID id;
    private String status;
}