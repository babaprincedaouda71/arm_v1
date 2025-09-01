package org.example.trainingservice.dto.need;

import lombok.Data;
import org.example.trainingservice.dto.group.GroupDto;

import java.util.List;

@Data
public class StrategicAxeNeedDetailsDto {
    private Long id;

    private String domain;

    private String theme;

    private String objective;

    private String content;

    private Boolean csf;

    private String csfPlanifie;

    private List<GroupDto> groups;
}