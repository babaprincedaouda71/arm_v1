package org.example.companyservice.repository;

import org.example.companyservice.entity.StrategicAxes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StrategicAxesRepository extends JpaRepository<StrategicAxes, Long> {
    @Query("SELECT sa.id, sa.year, sa.title FROM StrategicAxes sa WHERE sa.companyId = :companyId ORDER BY sa.year")
    List<Object[]> findAllByYearAndCompanyId(Long companyId);

    Optional<StrategicAxes> findByIdAndCompanyId(Long id, Long companyId);
}