package org.example.trainingservice.repository.plan;

import org.example.trainingservice.entity.plan.Plan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlanRepository extends JpaRepository<Plan, UUID> {
    List<Plan> findAllByCompanyId(Long companyId);

    Optional<Plan> findByTitle(String title);

    // Nouvelle méthode avec pagination
    Page<Plan> findAllByCompanyId(Long companyId, Pageable pageable);

    // Méthode avec recherche et pagination
    Page<Plan> findAllByCompanyIdAndTitleContainingIgnoreCase(
            Long companyId,
            String title,
            Pageable pageable
    );
}