package org.example.companyservice.web;

import org.example.companyservice.entity.Domain;
import org.example.companyservice.service.DomainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/domain")
public class DomainController {
    private final DomainService domainService;

    public DomainController(DomainService domainService) {
        this.domainService = domainService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> findAll() {
        return domainService.getAll();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return domainService.getById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Domain domain) {
        return domainService.add(domain);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> edit(@PathVariable Long id, @RequestBody Domain domain) {
        return domainService.edit(id, domain);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return domainService.delete(id);
    }
}