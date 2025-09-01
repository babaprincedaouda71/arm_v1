package org.example.authservice.repository;

import org.example.authservice.dto.GroupeCountDTO;
import org.example.authservice.dto.GroupeUserCountProjection;
import org.example.authservice.entity.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {
//    Groupe findByNameAndCompanyId(String name, Long companyId);
    Optional<Groupe> findByNameAndCompanyId(String name, Long companyId);

    @Query("SELECT g.id as id, g.name as name, g.description as description, g.companyId as companyId, " +
            "COUNT(u) as userCount " +
            "FROM Groupe g LEFT JOIN g.users u " +
            "GROUP BY g.id, g.name, g.description, g.companyId")
    List<GroupeCountDTO> findAllWithUserCount();

    // Variante avec filtrage par companyId si nécessaire
    @Query("SELECT g.id as id, g.name as name, g.description as description, g.companyId as companyId, " +
            "COUNT(u) as userCount " +
            "FROM Groupe g LEFT JOIN g.users u " +
            "WHERE g.companyId = :companyId " +
            "GROUP BY g.id, g.name, g.description, g.companyId")
    List<GroupeCountDTO> findAllWithUserCountByCompanyId(Long companyId);


    // solution pour récuperer également les droits d'accès
    @Query("SELECT g FROM Groupe g " +
            "WHERE g.companyId = :companyId")
    List<Groupe> findAllWithAccessRightsByCompanyId(Long companyId);

    @Query("SELECT g.id as groupeId, COUNT(u) as userCount " +
            "FROM Groupe g LEFT JOIN g.users u " +
            "WHERE g.companyId = :companyId " +
            "GROUP BY g.id")
    List<GroupeUserCountProjection> countUsersByGroupeId(Long companyId);

    Groupe findByName(String name);
}