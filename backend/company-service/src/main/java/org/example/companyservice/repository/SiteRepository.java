package org.example.companyservice.repository;

import org.example.companyservice.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
    List<Site> findAllByCompanyId(Long companyId);

    Optional<Site> findByIdAndCompanyId(Long id, Long companyId);
}