package org.example.trainingservice.dto.plan;

import lombok.Data;
import org.example.trainingservice.dto.group.GroupDto;

import java.util.List;
import java.util.UUID;

@Data
public class TrainingDetailsDto {
    private UUID id;

    private String domain;

    private String theme;

    private String objective;

    private String content;

    private Boolean csf;

    private String csfPlanifie;

    private List<GroupDto> groups;
}