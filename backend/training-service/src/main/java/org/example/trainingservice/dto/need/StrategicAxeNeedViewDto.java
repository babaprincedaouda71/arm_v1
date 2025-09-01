package org.example.trainingservice.dto.need;

import lombok.Builder;
import lombok.Data;
import org.example.trainingservice.dto.group.GroupDto;
import org.example.trainingservice.enums.NeedSource;

import java.util.List;

@Data
@Builder
public class StrategicAxeNeedViewDto {
    private Long id;

    private String domain;

    private String theme;

    private String axe;

    private NeedSource source;

    private int nbrGroup;

    private String site;

    private String department;

    private String creationDate;

    private String status;

    private List<GroupDto> groups;
}