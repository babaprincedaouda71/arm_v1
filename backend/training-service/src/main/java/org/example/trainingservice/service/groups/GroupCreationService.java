package org.example.trainingservice.service.groups;

import org.springframework.http.ResponseEntity;

public interface GroupCreationService {
    ResponseEntity<?> duplicateGroup(Long id);
}