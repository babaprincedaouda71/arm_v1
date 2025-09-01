package org.example.companyservice.web;

import org.example.companyservice.entity.Department;
import org.example.companyservice.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/department")
public class DepartmentController {
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> findAll() {
        return departmentService.getAll();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return departmentService.getById(id);
    }

    @GetMapping("/getByIds")
    public ResponseEntity<?> getDepartmentsByIds(@RequestParam List<Long> ids) {
        return departmentService.getDepartmentsByIds(ids);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Department department) {
        return departmentService.add(department);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> edit(@PathVariable Long id, @RequestBody Department department) {
        return departmentService.edit(id, department);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return departmentService.delete(id);
    }
}