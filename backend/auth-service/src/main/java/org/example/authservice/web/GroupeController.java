package org.example.authservice.web;

import org.example.authservice.dto.groups.GroupeRequest;
import org.example.authservice.service.GroupeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groupes")
public class GroupeController {
    private final GroupeService groupeService;

    public GroupeController(GroupeService groupeService) {
        this.groupeService = groupeService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody GroupeRequest request) {
        return groupeService.addGroupe(request);
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return groupeService.getAllGroupes();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody GroupeRequest request) {
        return groupeService.update(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return groupeService.deleteGroupe(id);
    }
}