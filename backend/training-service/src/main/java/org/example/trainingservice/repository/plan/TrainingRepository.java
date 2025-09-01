package org.example.trainingservice.repository.plan;

import org.example.trainingservice.entity.plan.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrainingRepository extends JpaRepository<Training, UUID> {
    List<Training> findByPlanId(UUID planId);

    @Query("SELECT t FROM Training t LEFT JOIN FETCH t.groupes g WHERE t.plan.id = :planId")
    List<Training> findByPlanIdWithGroupes(@Param("planId") UUID planId);

    Optional<Training> findByIdAndCompanyId(UUID id, Long companyId);

    // Méthode de repository optimisée à ajouter dans TrainingRepository
    @Query("SELECT t FROM Training t LEFT JOIN FETCH t.groupes WHERE t.id = :id")
    Optional<Training> findByIdWithGroupes(@Param("id") UUID id);
}