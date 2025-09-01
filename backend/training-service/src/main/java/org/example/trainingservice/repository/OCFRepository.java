package org.example.trainingservice.repository;

import org.example.trainingservice.entity.OCF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OCFRepository extends JpaRepository<OCF,Long> {
    List<OCF> findByCompanyId(Long companyId);
}