package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;
import org.example.trainingservice.dto.group.GroupDto;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TrainingDetailsForCancelDto {
    private UUID id;

    private String theme;

    private String csfPlanifie;
}