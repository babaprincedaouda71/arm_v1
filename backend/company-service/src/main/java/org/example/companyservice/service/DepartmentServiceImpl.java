package org.example.companyservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.companyservice.entity.Department;
import org.example.companyservice.exceptions.DepartmentNotFoundException;
import org.example.companyservice.repository.DepartmentRepository;
import org.example.companyservice.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public ResponseEntity<?> getAll() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        return ResponseEntity.ok(departmentRepository.findAllByCompanyId((companyId)));
    }

    @Override
    public ResponseEntity<?> getById(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Department found = departmentRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new DepartmentNotFoundException("DEPARTMENT_NOT_FOUND", null));
        return ResponseEntity.ok(found);
    }

    @Override
    public ResponseEntity<?> add(Department department) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        department.setCompanyId(companyId);
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @Override
    public ResponseEntity<?> edit(Long id, Department department) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Department found = departmentRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new DepartmentNotFoundException("DEPARTMENT_NOT_FOUND", null));
        found.setCode(department.getCode());
        found.setName(department.getName());
        return ResponseEntity.ok(departmentRepository.save(found));
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Department found = departmentRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new DepartmentNotFoundException("DEPARTMENT_NOT_FOUND", null));
        departmentRepository.delete(found);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> getDepartmentsByIds(List<Long> ids) {
        return ResponseEntity.ok().body(departmentRepository.findAllById(ids));
    }
}