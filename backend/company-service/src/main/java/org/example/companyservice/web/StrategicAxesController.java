package org.example.companyservice.web;

import org.example.companyservice.entity.StrategicAxes;
import org.example.companyservice.service.StrategicAxesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/strategicAxes")
public class StrategicAxesController {
    private final StrategicAxesService strategicAxesService;

    public StrategicAxesController(StrategicAxesService strategicAxesService) {
        this.strategicAxesService = strategicAxesService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return strategicAxesService.getAll();
    }

    @GetMapping("/get/allByYear")
    public ResponseEntity<?> getAllByYear() {
        return strategicAxesService.getAllByYear();
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody StrategicAxes strategicAxes) {
        return strategicAxesService.add(strategicAxes);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> edit(@PathVariable Long id, @RequestBody StrategicAxes strategicAxes) {
        return strategicAxesService.edit(id, strategicAxes);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return strategicAxesService.delete(id);
    }
}