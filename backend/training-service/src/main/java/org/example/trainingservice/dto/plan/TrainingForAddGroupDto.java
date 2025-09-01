package org.example.trainingservice.dto.plan;

import lombok.Data;
import org.example.trainingservice.dto.need.DepartmentDto;
import org.example.trainingservice.dto.need.SiteDto;

import java.util.List;
import java.util.UUID;

@Data
public class TrainingForAddGroupDto {
    private UUID id;

    private List<SiteDto> site;

    private List<DepartmentDto> department;
}