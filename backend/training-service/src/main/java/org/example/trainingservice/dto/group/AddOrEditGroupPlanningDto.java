package org.example.trainingservice.dto.group;

import lombok.Data;
import org.example.trainingservice.dto.need.DepartmentDto;
import org.example.trainingservice.dto.need.SiteDto;

import java.util.List;

@Data
public class AddOrEditGroupPlanningDto {
    private List<SiteDto> site;

    private List<DepartmentDto> department;

    private String location;

    private String city;

    private List<String> dates;

    private String morningStartTime;

    private String morningEndTime;

    private String afternoonStartTime;

    private String afternoonEndTime;
}