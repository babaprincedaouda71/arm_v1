package org.example.trainingservice.dto.plan;

import lombok.Data;
import org.example.trainingservice.dto.need.*;

import java.util.List;

@Data
public class EditTrainingDto {
    private Long id;

    private StrategicAxeDto axe;

    private List<SiteDto> site;

    private List<DepartmentDto> department;

    private DomainDto domain;

    private QualificationDto qualification;

    private String theme;

    private int nbrDay;

    private String type;

    private int nbrGroup;

    private String objective;

    private String content;

    private Boolean csf;

    private String csfPlanifie;
}