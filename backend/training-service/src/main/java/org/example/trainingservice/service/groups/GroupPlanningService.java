package org.example.trainingservice.service.groups;

import org.example.trainingservice.dto.group.AddOrEditGroupPlanningDto;
import org.springframework.http.ResponseEntity;

public interface GroupPlanningService {
    ResponseEntity<?> addGroupPlanning(Long needId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto);

    ResponseEntity<?> editGroupPlanning(Long groupId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto);
}