package org.example.trainingservice.dto.need;

import lombok.Data;

import java.util.List;

@Data
public class NeedForAddGroupDto {
    private Long id;

    private List<SiteDto> site;

    private List<DepartmentDto> department;
}