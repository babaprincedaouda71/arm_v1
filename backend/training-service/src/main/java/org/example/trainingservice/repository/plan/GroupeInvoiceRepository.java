package org.example.trainingservice.repository.plan;

import org.example.trainingservice.entity.plan.GroupeInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupeInvoiceRepository extends JpaRepository<GroupeInvoice, UUID> {
    /**
     * Trouver toutes les factures d'un groupe (optimisé)
     */
    @Query("SELECT gi FROM GroupeInvoice gi " +
            "WHERE gi.trainingGroupe.id = :trainingGroupeId " +
            "ORDER BY gi.creationDate DESC")
    List<GroupeInvoice> findByTrainingGroupeId(@Param("trainingGroupeId") Long trainingGroupeId);
}