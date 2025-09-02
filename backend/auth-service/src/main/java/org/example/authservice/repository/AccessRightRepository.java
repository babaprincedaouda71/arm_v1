package org.example.authservice.repository;

import org.example.authservice.entity.AccessRight;
import org.example.authservice.entity.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccessRightRepository extends JpaRepository<AccessRight, Long> {

    List<AccessRight> findByGroupe(Groupe groupe);

    List<AccessRight> findByGroupeId(Long groupeId);

    Optional<AccessRight> findByGroupeAndModuleAndAction(Groupe groupe, String module, String action);

    List<AccessRight> findByGroupeAndModule(Groupe groupe, String module);

    @Query("SELECT ar FROM AccessRight ar WHERE ar.groupe.id = :groupeId AND ar.module = :module")
    List<AccessRight> findByGroupeIdAndModule(@Param("groupeId") Long groupeId, @Param("module") String module);

    @Query("SELECT ar FROM AccessRight ar WHERE ar.groupe.companyId = :companyId")
    List<AccessRight> findByCompanyId(@Param("companyId") Long companyId);

    void deleteByGroupeId(Long groupeId);
}