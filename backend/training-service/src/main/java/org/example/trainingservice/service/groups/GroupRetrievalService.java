package org.example.trainingservice.service.groups;

import org.springframework.http.ResponseEntity;

public interface GroupRetrievalService {
    ResponseEntity<?> getGroupToAddOrEdit(Long groupId);
}