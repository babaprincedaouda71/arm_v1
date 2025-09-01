package org.example.trainingservice.dto.plan;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class AddThemeToPlanDto {
    private UUID planId;

    private List<Long> selectedNeedIds;
}