package org.example.companyservice.service;

import org.example.companyservice.entity.StrategicAxes;
import org.springframework.http.ResponseEntity;

public interface StrategicAxesService {
    ResponseEntity<?> getAll();

    ResponseEntity<?> getAllByYear();

    ResponseEntity<?> add(StrategicAxes strategicAxes);

    ResponseEntity<?> edit(Long id, StrategicAxes strategicAxes);

    ResponseEntity<?> delete(Long id);
}