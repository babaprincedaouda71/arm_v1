package org.example.companyservice.repository;

import org.example.companyservice.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findAllByCompanyId(Long companyId);

    Optional<Department> findByIdAndCompanyId(Long id, Long companyId);
}