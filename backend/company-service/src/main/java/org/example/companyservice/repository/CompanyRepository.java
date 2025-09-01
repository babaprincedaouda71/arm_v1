package org.example.companyservice.repository;

import org.example.companyservice.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByMainContactEmail(String mainContactEmail);

    boolean existsByMainContactEmail(String mainContactEmail);

    List<Company> findAllByStatus(String status);
}