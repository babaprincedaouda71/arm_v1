package org.example.companyservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.companyservice.dto.SiteWithDepartmentsDto;
import org.example.companyservice.entity.Department;
import org.example.companyservice.entity.Site;
import org.example.companyservice.exceptions.SiteNotFoundException;
import org.example.companyservice.repository.DepartmentRepository;
import org.example.companyservice.repository.SiteRepository;
import org.example.companyservice.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SiteServiceImpl implements SiteService {
    private final SiteRepository siteRepository;
    private final DepartmentRepository departmentRepository;

    public SiteServiceImpl(SiteRepository siteRepository, DepartmentRepository departmentRepository) {
        this.siteRepository = siteRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public ResponseEntity<?> getAll() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        return ResponseEntity.ok(siteRepository.findAllByCompanyId(companyId));
    }

    @Override
    public ResponseEntity<?> getById(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Site found = siteRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new SiteNotFoundException("SITE NOT FOUND", null));
        return ResponseEntity.ok(found);
    }

    @Override
    public ResponseEntity<?> add(Site site) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        site.setCompanyId(companyId);

        // Validation des départements
        if (site.getDepartmentIds() != null && !site.getDepartmentIds().isEmpty()) {
            validateDepartments(site.getDepartmentIds(), companyId);
        }

        return ResponseEntity.ok(siteRepository.save(site));
    }

    @Override
    public ResponseEntity<?> edit(Long id, Site site) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Site found = siteRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new SiteNotFoundException("SITE NOT FOUND", null));

        found.setLabel(site.getLabel());
        found.setAddress(site.getAddress());
        found.setCity(site.getCity());
        found.setPhone(site.getPhone());
        found.setTrainingRoom(site.getTrainingRoom());
        found.setSize(site.getSize());

        // 🆕 Mise à jour des départements
        if (site.getDepartmentIds() != null) {
            validateDepartments(site.getDepartmentIds(), companyId);
            found.setDepartmentIds(site.getDepartmentIds());
        }

        return ResponseEntity.ok(siteRepository.save(found));
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        siteRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new SiteNotFoundException("SITE NOT FOUND", null));
        siteRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> getSitesByIds(List<Long> ids) {
        return ResponseEntity.ok().body(siteRepository.findAllById(ids));
    }

    // 🆕 Nouvelles méthodes
    @Override
    public ResponseEntity<?> getAllWithDepartments() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        List<Site> sites = siteRepository.findAllByCompanyId(companyId);

        // Enrichir avec les informations des départements
        List<SiteWithDepartmentsDto> sitesWithDepartments = sites.stream()
                .map(this::mapSiteWithDepartments)
                .collect(Collectors.toList());

        return ResponseEntity.ok(sitesWithDepartments);
    }

    @Override
    public ResponseEntity<?> getSiteDepartments(Long siteId) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Site site = siteRepository.findByIdAndCompanyId(siteId, companyId)
                .orElseThrow(() -> new SiteNotFoundException("SITE NOT FOUND", null));

        if (site.getDepartmentIds() == null || site.getDepartmentIds().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Department> departments = departmentRepository.findAllById(site.getDepartmentIds());
        return ResponseEntity.ok(departments);
    }

    private void validateDepartments(List<Long> departmentIds, Long companyId) {
        for (Long deptId : departmentIds) {
            if (!departmentRepository.findByIdAndCompanyId(deptId, companyId).isPresent()) {
                throw new IllegalArgumentException("Department with ID " + deptId + " not found or doesn't belong to this company");
            }
        }
    }

    private SiteWithDepartmentsDto mapSiteWithDepartments(Site site) {
        List<Department> departments = Collections.emptyList();
        if (site.getDepartmentIds() != null && !site.getDepartmentIds().isEmpty()) {
            departments = departmentRepository.findAllById(site.getDepartmentIds());
        }

        return SiteWithDepartmentsDto.builder()
                .id(site.getId())
                .code(site.getCode())
                .label(site.getLabel())
                .address(site.getAddress())
                .city(site.getCity())
                .phone(site.getPhone())
                .trainingRoom(site.getTrainingRoom())
                .size(site.getSize())
                .departments(departments)
                .build();
    }
}