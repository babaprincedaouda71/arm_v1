package org.example.companyservice.service;

import org.example.companyservice.entity.Site;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SiteService {
    ResponseEntity<?> getAll();

    ResponseEntity<?> getById(Long id);

    ResponseEntity<?> add(Site site);

    ResponseEntity<?> edit(Long id, Site site);

    ResponseEntity<?> delete(Long id);

    ResponseEntity<?> getSitesByIds(List<Long> ids);

    // 🆕 Nouvelles méthodes
    ResponseEntity<?> getAllWithDepartments();

    ResponseEntity<?> getSiteDepartments(Long siteId);
}