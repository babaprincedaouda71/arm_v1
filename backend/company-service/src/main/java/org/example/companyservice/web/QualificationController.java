package org.example.companyservice.web;

import org.example.companyservice.entity.Qualification;
import org.example.companyservice.service.QualificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qualification")
public class QualificationController {
    private final QualificationService qualificationService;

    public QualificationController(QualificationService qualificationService) {
        this.qualificationService = qualificationService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> findAll() {
        return qualificationService.getAll();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return qualificationService.getById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Qualification qualification) {
        return qualificationService.add(qualification);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> edit(@PathVariable Long id, @RequestBody Qualification qualification) {
        return qualificationService.edit(id, qualification);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return qualificationService.delete(id);
    }
}