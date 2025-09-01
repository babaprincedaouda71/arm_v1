package org.example.companyservice.repository;

import org.example.companyservice.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DomainRepository extends JpaRepository<Domain, Long> {
    List<Domain> findAllByCompanyId(Long companyId);

    Optional<Domain> findByIdAndCompanyId(Long id, Long companyId);
}