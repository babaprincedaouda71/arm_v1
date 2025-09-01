package org.example.trainingservice.service.groups;

import org.example.trainingservice.dto.group.AddOrEditGroupInternalProviderDto;
import org.springframework.http.ResponseEntity;

public interface GroupInternalProviderService {
    ResponseEntity<?> addGroupInternalProvider(Long needId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto);

    ResponseEntity<?> editGroupInternalProvider(Long groupId, AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto);
}