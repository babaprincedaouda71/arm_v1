package org.example.trainingservice.repository;

import org.example.trainingservice.entity.Need;
import org.example.trainingservice.enums.NeedSource;
import org.example.trainingservice.enums.NeedStatusEnums;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NeedRepository extends JpaRepository<Need, Long> {
    List<Need> findAllByCompanyId(Long companyId);

    List<Need> findAllByCompanyIdAndSource(Long companyId, NeedSource source);

    Optional<Need> findByIdAndCompanyId(Long id, Long companyId);

    List<Need> findAllByCompanyIdAndStatus(Long companyId, NeedStatusEnums status);
}