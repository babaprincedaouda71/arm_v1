package org.example.companyservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.companyservice.entity.Domain;
import org.example.companyservice.exceptions.DomainNotFoundException;
import org.example.companyservice.repository.DomainRepository;
import org.example.companyservice.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DomainServiceImpl implements DomainService {
    private final DomainRepository domainRepository;

    public DomainServiceImpl(DomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    @Override
    public ResponseEntity<?> getAll() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        return ResponseEntity.ok(domainRepository.findAllByCompanyId((companyId)));
    }

    @Override
    public ResponseEntity<?> getById(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Domain found = domainRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new DomainNotFoundException("Domain not found", null));
        return ResponseEntity.ok(found);
    }

    @Override
    public ResponseEntity<?> add(Domain domain) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        domain.setCompanyId(companyId);
        return ResponseEntity.ok(domainRepository.save(domain));
    }

    @Override
    public ResponseEntity<?> edit(Long id, Domain domain) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Domain found = domainRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new DomainNotFoundException("Domain not found", null));
        found.setCode(domain.getCode());
        found.setName(domain.getName());
        return ResponseEntity.ok(domainRepository.save(found));
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Domain found = domainRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new DomainNotFoundException("Domain not found", null));
        domainRepository.delete(found);
        return ResponseEntity.ok().build();
    }
}