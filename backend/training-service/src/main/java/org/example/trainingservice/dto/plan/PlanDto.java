package org.example.trainingservice.dto.plan;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;
import org.example.trainingservice.enums.PlanStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Builder
@Data
public class PlanDto {
    private UUID id;

    private Long companyId;

    private String title;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer year;

    @Column(precision = 19, scale = 2)
    private BigDecimal estimatedBudget;

    private String status;

    private Boolean isCSFPlan;

    private Boolean isOFPPTValidation;
}