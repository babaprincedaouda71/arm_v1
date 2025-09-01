package org.example.trainingservice.service.groups;

import org.example.trainingservice.dto.group.AddOrEditGroupExternalProviderDto;
import org.springframework.http.ResponseEntity;

public interface GroupExternalProviderService {
    ResponseEntity<?> addGroupExternalProvider(Long needId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto);

    ResponseEntity<?> editGroupExternalProvider(Long groupId, AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto);
}