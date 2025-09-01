package org.example.authservice.service;

import org.example.authservice.dto.groups.GroupeRequest;
import org.springframework.http.ResponseEntity;

public interface GroupeService {
    ResponseEntity<?> addGroupe(GroupeRequest request);

    ResponseEntity<?> getAllGroupes();

    ResponseEntity<?> deleteGroupe(Long id);

    ResponseEntity<?> update(Long id, GroupeRequest request);
}