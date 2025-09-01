package org.example.trainingservice.repository;

import org.example.trainingservice.entity.TrainingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingRequestRepository extends JpaRepository<TrainingRequest, Long> {
    List<TrainingRequest> findByCompanyIdAndId(Long companyId, Long id);

    Optional<TrainingRequest> findTrainingRequestByCompanyIdAndId(Long companyId, Long id);

    List<TrainingRequest> findByCompanyIdAndRequesterId(Long companyId, Long requesterId);

    List<TrainingRequest> findByCompanyId(Long companyId);

    List<TrainingRequest> findByCompanyIdAndManagerId(Long companyId, Long managerId);
}