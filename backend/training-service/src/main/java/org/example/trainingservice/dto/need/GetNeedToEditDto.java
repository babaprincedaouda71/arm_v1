package org.example.trainingservice.dto.need;

import lombok.Data;
import org.example.trainingservice.enums.NeedSource;

import java.util.List;

@Data
public class GetNeedToEditDto {
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

    private NeedSource source;

    private String content;

    private Boolean csf;

    private String csfPlanifie;
}