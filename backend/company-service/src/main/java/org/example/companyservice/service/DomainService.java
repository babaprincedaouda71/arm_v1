package org.example.companyservice.service;

import org.example.companyservice.entity.Domain;
import org.springframework.http.ResponseEntity;

public interface DomainService {
    ResponseEntity<?> getAll();

    ResponseEntity<?> getById(Long id);

    ResponseEntity<?> add(Domain domain);

    ResponseEntity<?> edit(Long id, Domain domain);

    ResponseEntity<?> delete(Long id);
}