package org.example.trainingservice.utils;

import org.example.trainingservice.dto.plan.PlanDto;
import org.example.trainingservice.entity.plan.Plan;

public class PlanUtilMethods {
    public static PlanDto mapToPlanDto(Plan plan) {
        return PlanDto.builder()
                .id(plan.getId())
                .title(plan.getTitle())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .year(plan.getYear())
                .estimatedBudget(plan.getEstimatedBudget())
                .status(plan.getStatus().getDescription())
                .isCSFPlan(plan.getIsCSFPlan())
                .isOFPPTValidation(plan.getIsOFPPTValidation())
                .build();
    }

}