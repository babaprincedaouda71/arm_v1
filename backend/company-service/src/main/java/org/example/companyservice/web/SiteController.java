package org.example.companyservice.web;

import org.example.companyservice.entity.Site;
import org.example.companyservice.service.SiteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/site")
public class SiteController {
    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return siteService.getAll();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return siteService.getById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Site site) {
        return siteService.add(site);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> edit(@PathVariable Long id, @RequestBody Site site) {
        return siteService.edit(id, site);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return siteService.delete(id);
    }

    @GetMapping("/getByIds")
    public ResponseEntity<?> getSitesByIds(@RequestParam List<Long> ids) {
        return siteService.getSitesByIds(ids);
    }

    // 🆕 Nouvelle méthode pour récupérer les sites avec leurs départements
    @GetMapping("/get/all/with-departments")
    public ResponseEntity<?> getAllWithDepartments() {
        return siteService.getAllWithDepartments();
    }

    // 🆕 Nouvelle méthode pour récupérer les départements d'un site
    @GetMapping("/get/{id}/departments")
    public ResponseEntity<?> getSiteDepartments(@PathVariable Long id) {
        return siteService.getSiteDepartments(id);
    }
}