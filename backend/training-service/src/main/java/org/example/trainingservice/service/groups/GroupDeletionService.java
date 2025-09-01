package org.example.trainingservice.service.groups;

import org.springframework.http.ResponseEntity;

public interface GroupDeletionService {
    ResponseEntity<?> deleteGroup(Long groupId);
}