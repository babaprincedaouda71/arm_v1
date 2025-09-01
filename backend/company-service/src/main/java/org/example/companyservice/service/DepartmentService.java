package org.example.companyservice.service;

import org.example.companyservice.entity.Department;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DepartmentService {
    ResponseEntity<?> getAll();

    ResponseEntity<?> getById(Long id);

    ResponseEntity<?> add(Department department);

    ResponseEntity<?> edit(Long id, Department department);

    ResponseEntity<?> delete(Long id);

    ResponseEntity<?> getDepartmentsByIds(List<Long> ids);
}