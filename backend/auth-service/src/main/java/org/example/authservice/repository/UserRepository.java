package org.example.authservice.repository;

import feign.Param;
import org.example.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByCompanyId(Long companyId);

    List<User> findByGroupe_Name(String groupeName);

    @Query("SELECT u.id FROM User u WHERE u.companyId = :companyId AND u.managerId = :managerId")
    List<Long> findIdsByCompanyIdAndManagerId(@Param("companyId") Long companyId, @Param("managerId") Long managerId);
}