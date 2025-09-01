package org.example.trainingservice.dto.group;

import lombok.Data;
import org.example.trainingservice.dto.need.DepartmentDto;
import org.example.trainingservice.dto.need.SiteDto;

import java.util.List;
import java.util.Set;

@Data
public class AddOrEditGroupParticipantsDto {
    private String targetAudience;

    private Integer managerCount;

    private Integer employeeCount;

    private Integer workerCount;

    private Integer temporaryWorkerCount;

    private Set<Long> userGroupIds;
}