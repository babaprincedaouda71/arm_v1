package org.example.companyservice.service;

import org.example.companyservice.entity.Qualification;
import org.springframework.http.ResponseEntity;

public interface QualificationService {
    ResponseEntity<?> getAll();

    ResponseEntity<?> getById(Long id);

    ResponseEntity<?> add(Qualification qualification);

    ResponseEntity<?> edit(Long id, Qualification qualification);

    ResponseEntity<?> delete(Long id);
}