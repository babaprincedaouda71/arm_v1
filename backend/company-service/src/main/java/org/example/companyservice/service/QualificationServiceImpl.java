package org.example.companyservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.companyservice.entity.Qualification;
import org.example.companyservice.exceptions.QualificationNotFoundException;
import org.example.companyservice.repository.QualificationRepository;
import org.example.companyservice.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class QualificationServiceImpl implements QualificationService {
    private final QualificationRepository qualificationRepository;

    public QualificationServiceImpl(QualificationRepository qualificationRepository) {
        this.qualificationRepository = qualificationRepository;
    }

    @Override
    public ResponseEntity<?> getAll() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        return ResponseEntity.ok(qualificationRepository.findAllByCompanyId((companyId)));
    }

    @Override
    public ResponseEntity<?> getById(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Qualification found = qualificationRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new QualificationNotFoundException("Qualification Not Found", null));
        return ResponseEntity.ok(found);
    }

    @Override
    public ResponseEntity<?> add(Qualification qualification) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        qualification.setCompanyId(companyId);
        return ResponseEntity.ok(qualificationRepository.save(qualification));
    }

    @Override
    public ResponseEntity<?> edit(Long id, Qualification qualification) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Qualification found = qualificationRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new QualificationNotFoundException("Qualification Not Found", null));
        found.setCode(qualification.getCode());
        found.setType(qualification.getType());
        found.setValidityNumber(qualification.getValidityNumber());
        found.setValidityUnit(qualification.getValidityUnit());
        found.setReminderNumber(qualification.getReminderNumber());
        found.setReminderUnit(qualification.getReminderUnit());
        return ResponseEntity.ok(qualificationRepository.save(found));
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        Qualification found = qualificationRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new QualificationNotFoundException("Qualification Not Found", null));
        qualificationRepository.delete(found);
        return ResponseEntity.ok().build();
    }
}