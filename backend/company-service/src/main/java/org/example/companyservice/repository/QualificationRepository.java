package org.example.companyservice.repository;

import org.example.companyservice.entity.Qualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QualificationRepository extends JpaRepository<Qualification, Long> {
    List<Qualification> findAllByCompanyId(Long companyId);

    Optional<Qualification> findByIdAndCompanyId(Long id, Long companyId);
}