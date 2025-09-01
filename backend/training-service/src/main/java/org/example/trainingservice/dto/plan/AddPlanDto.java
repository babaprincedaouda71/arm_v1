package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Data
public class AddPlanDto {
    private String csf;

    private String title;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal estimatedBudget;
}