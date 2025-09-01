package org.example.trainingservice.service.scheduled;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.repository.plan.TrainingGroupeRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainingGroupeStatusService {

    private final TrainingGroupeRepository trainingGroupeRepository;
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Mise à jour automatique quotidienne des statuts à 1h du matin
     */
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void updateAllTrainingGroupeStatuses() {
        log.info("Début de la mise à jour automatique des statuts des groupes de formation");

        List<TrainingGroupe> groupesToUpdate = trainingGroupeRepository
                .findByStatusIn(List.of(GroupeStatusEnums.PLANNED, GroupeStatusEnums.IN_PROGRESS));

        int updatedCount = 0;
        LocalDate today = LocalDate.now();

        for (TrainingGroupe groupe : groupesToUpdate) {
            GroupeStatusEnums newStatus = calculateStatusFromDates(groupe.getDates(), today);

            if (newStatus != groupe.getStatus()) {
                GroupeStatusEnums oldStatus = groupe.getStatus();
                groupe.setStatus(newStatus);
                trainingGroupeRepository.save(groupe);

                logStatusChange(groupe.getId(), oldStatus, newStatus, "Mise à jour automatique");
                updatedCount++;
            }
        }

        log.info("Mise à jour automatique terminée. {} groupes mis à jour", updatedCount);
    }

    /**
     * Mise à jour manuelle d'un groupe spécifique (appelée lors de consultations)
     */
    @Transactional
    public void updateTrainingGroupeStatus(TrainingGroupe groupe) {
        if (!groupe.getStatus().canBeAutoUpdated()) {
            return; // Ne pas toucher aux DRAFT
        }

        LocalDate today = LocalDate.now();
        GroupeStatusEnums newStatus = calculateStatusFromDates(groupe.getDates(), today);

        if (newStatus != groupe.getStatus()) {
            GroupeStatusEnums oldStatus = groupe.getStatus();
            groupe.setStatus(newStatus);
            trainingGroupeRepository.save(groupe);

            logStatusChange(groupe.getId(), oldStatus, newStatus, "Consultation");
        }
    }

    /**
     * Calcule le statut basé sur les dates
     */
    private GroupeStatusEnums calculateStatusFromDates(List<String> dates, LocalDate today) {
        if (dates == null || dates.isEmpty()) {
            return GroupeStatusEnums.PLANNED; // Statut par défaut si pas de dates
        }

        try {
            // Conversion des dates String en LocalDate
            List<LocalDate> parsedDates = dates.stream()
                    .map(dateStr -> LocalDate.parse(dateStr, ISO_FORMATTER))
                    .toList();

            LocalDate minDate = parsedDates.stream().min(LocalDate::compareTo).orElse(today);
            LocalDate maxDate = parsedDates.stream().max(LocalDate::compareTo).orElse(today);

            // Logique de détermination du statut
            if (maxDate.isBefore(today)) {
                return GroupeStatusEnums.COMPLETED;
            } else if (minDate.isEqual(today) || (minDate.isBefore(today) && maxDate.isAfter(today))) {
                return GroupeStatusEnums.IN_PROGRESS;
            } else {
                return GroupeStatusEnums.PLANNED; // Futur
            }

        } catch (Exception e) {
            log.error("Erreur lors du parsing des dates pour le groupe. Dates: {}", dates, e);
            return GroupeStatusEnums.PLANNED; // Fallback en cas d'erreur
        }
    }

    /**
     * Log des changements de statut
     */
    private void logStatusChange(Long groupeId, GroupeStatusEnums oldStatus,
                                 GroupeStatusEnums newStatus, String trigger) {
        log.info("Changement de statut - Groupe ID: {}, Ancien: {}, Nouveau: {}, Déclencheur: {}",
                groupeId, oldStatus.getDescription(), newStatus.getDescription(), trigger);
    }

    /**
     * Méthode utilitaire pour obtenir le statut calculé sans persistance
     */
    public GroupeStatusEnums getCalculatedStatus(TrainingGroupe groupe) {
        if (!groupe.getStatus().canBeAutoUpdated()) {
            return groupe.getStatus();
        }
        return calculateStatusFromDates(groupe.getDates(), LocalDate.now());
    }
}