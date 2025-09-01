package org.example.trainingservice.service.plan;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.adapter.GroupeAdapter;
import org.example.trainingservice.adapter.GroupeValidatable;
import org.example.trainingservice.adapter.TrainingGroupeAdapter;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.enums.TrainingType;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class GroupeCompletionService {

    /**
     * Vérifie si un TrainingGroupe est complet
     */
    public boolean isTrainingGroupeComplete(TrainingGroupe trainingGroupe) {
        if (trainingGroupe == null) return false;
        TrainingGroupeAdapter adapter = new TrainingGroupeAdapter(trainingGroupe);
        return isGroupeComplete(adapter) && adapter.hasTrainingOrNeed();
    }

    /**
     * Vérifie si un Groupe est complet
     */
    public boolean isGroupeComplete(Groupe groupe) {
        if (groupe == null) return false;
        GroupeAdapter adapter = new GroupeAdapter(groupe);
        return isGroupeComplete(adapter) && adapter.hasTrainingOrNeed();
    }

    /**
     * Logique commune de validation
     */
    private boolean isGroupeComplete(GroupeValidatable validatable) {
        // Vérification des champs communs obligatoires
        if (hasCommonRequiredFields(validatable)) {
            return false;
        }
        // Vérification des champs de planification
        if (hasPlanningFields(validatable)) {
            return false;
        }
        // Vérification des champs de participants
        if (hasParticipantsFields(validatable)) {
            return false;
        }

        // Vérification des providers
        boolean internalPresent = hasInternalProviderFields(validatable);
        boolean externalPresent = hasExternalProviderFields(validatable);

        // Ne pas avoir les deux en même temps
        if (internalPresent && externalPresent) {
            return false;
        }
        // Il faut qu'au moins un soit présent
        if (!internalPresent && !externalPresent) {
            return false;
        }

        // En fonction du type de formation, vérifier que le provider renseigné correspond
        if (validatable.getTrainingType() == TrainingType.INTERNAL) {
            return internalPresent;
        } else if (validatable.getTrainingType() == TrainingType.EXTERNAL) {
            return externalPresent;
        }
        return false;
    }

    /**
     * Met à jour le statut de complétude pour TrainingGroupe
     */
    public TrainingGroupe updateCompletionStatus(TrainingGroupe trainingGroupe) {
        boolean isComplete = isTrainingGroupeComplete(trainingGroupe);
        trainingGroupe.setIsAllFieldsFilled(isComplete);
        if (isComplete) {
            trainingGroupe.setStatus(GroupeStatusEnums.PLANNED);
        }
        return trainingGroupe;
    }

    /**
     * Met à jour le statut de complétude pour Groupe
     */
    public Groupe updateCompletionStatus(Groupe groupe) {
        boolean isComplete = isGroupeComplete(groupe);
        groupe.setIsAllFieldsFilled(isComplete);
        if (isComplete) {
            groupe.setStatus(GroupeStatusEnums.APPROVED);
        }
        return groupe;
    }

    /**
     * Génère un rapport de complétude pour TrainingGroupe
     */
    public CompletionReport getCompletionReport(TrainingGroupe trainingGroupe) {
        TrainingGroupeAdapter adapter = new TrainingGroupeAdapter(trainingGroupe);
        CompletionReport report = generateCompletionReport(adapter);

        if (!adapter.hasTrainingOrNeed()) {
            report.addMissingField("Training", "training obligatoire");
        }

        return report;
    }

    /**
     * Génère un rapport de complétude pour Groupe
     */
    public CompletionReport getCompletionReport(Groupe groupe) {
        GroupeAdapter adapter = new GroupeAdapter(groupe);
        CompletionReport report = generateCompletionReport(adapter);

        if (!adapter.hasTrainingOrNeed()) {
            report.addMissingField("Need", "need obligatoire");
        }

        return report;
    }

    /**
     * Logique commune pour générer le rapport de complétude
     */
    private CompletionReport generateCompletionReport(GroupeValidatable validatable) {
        CompletionReport report = new CompletionReport();
        report.setComplete(isGroupeComplete(validatable));

        if (hasCommonRequiredFields(validatable)) {
            report.addMissingField("Champs communs", "name, companyId");
        }
        if (hasPlanningFields(validatable)) {
            report.addMissingField("Planning", getMissingPlanningFields(validatable));
        }
        if (hasParticipantsFields(validatable)) {
            report.addMissingField("Participants", getMissingParticipantsFields(validatable));
        }

        boolean internalPresent = hasInternalProviderFields(validatable);
        boolean externalPresent = hasExternalProviderFields(validatable);

        if (internalPresent && externalPresent) {
            report.addMissingField("Provider", "Fournir uniquement soit Provider Interne soit Provider Externe, pas les deux en même temps");
        } else {
            if (validatable.getTrainingType() == TrainingType.INTERNAL && !internalPresent) {
                report.addMissingField("Provider Interne", getMissingInternalProviderFields(validatable));
            } else if (validatable.getTrainingType() == TrainingType.EXTERNAL && !externalPresent) {
                report.addMissingField("Provider Externe", getMissingExternalProviderFields(validatable));
            }
        }
        return report;
    }

    // ===============================
    // Méthodes privées de validation
    // ===============================

    private boolean hasCommonRequiredFields(GroupeValidatable validatable) {
        return validatable.getName() == null
                || validatable.getName().trim().isEmpty()
                || validatable.getCompanyId() == null;
    }

    private boolean hasPlanningFields(GroupeValidatable validatable) {
        return isBlank(validatable.getLocation())
                || isBlank(validatable.getCity())
                || isEmptyOrBlankList(validatable.getDates())
                || isBlank(validatable.getMorningStartTime())
                || isBlank(validatable.getMorningEndTime())
                || isBlank(validatable.getAfternoonStartTime())
                || isBlank(validatable.getAfternoonEndTime())
                || validatable.getDayCount() == null
                || isEmptyOrNull(validatable.getSiteIds())
                || isEmptyOrNull(validatable.getDepartmentIds());
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private boolean isEmptyOrBlankList(List<String> list) {
        return list == null || list.isEmpty() || list.stream().allMatch(s -> s == null || s.trim().isEmpty());
    }

    private boolean isEmptyOrNull(List<?> list) {
        return list == null || list.isEmpty();
    }


    private boolean hasParticipantsFields(GroupeValidatable validatable) {
        return validatable.getTargetAudience() == null
                || validatable.getTargetAudience().trim().isEmpty()
                || hasAtLeastOneParticipantCount(validatable);
    }

    private boolean hasAtLeastOneParticipantCount(GroupeValidatable validatable) {
        return (validatable.getManagerCount() == null || validatable.getManagerCount() <= 0)
                && (validatable.getEmployeeCount() == null || validatable.getEmployeeCount() <= 0)
                && (validatable.getWorkerCount() == null || validatable.getWorkerCount() <= 0)
                && (validatable.getTemporaryWorkerCount() == null || validatable.getTemporaryWorkerCount() <= 0);
    }

    private boolean hasInternalProviderFields(GroupeValidatable validatable) {
        return validatable.getInternalTrainerId() != null
                && validatable.getTrainerName() != null
                && !validatable.getTrainerName().trim().isEmpty();
    }

    private boolean hasExternalProviderFields(GroupeValidatable validatable) {
        if (validatable.getOcf() == null) {
            log.error("OCF not here");
        }

        if (validatable.getTrainer() == null) {
            log.error("Trainer not here");
        }
        return
                validatable.getOcf() != null
                        && validatable.getTrainer() != null
                        && validatable.getTrainerName() != null
                        && !validatable.getTrainerName().trim().isEmpty()
                        && validatable.getPrice() != null
                        && validatable.getPrice() > 0;
    }

    // ========================================
    // Méthodes pour obtenir les champs manquants
    // ========================================

    private String getMissingPlanningFields(GroupeValidatable validatable) {
        StringBuilder missing = new StringBuilder();
        if (validatable.getLocation() == null || validatable.getLocation().trim().isEmpty())
            missing.append("location, ");
        if (validatable.getCity() == null || validatable.getCity().trim().isEmpty())
            missing.append("city, ");
        if (validatable.getDates() == null || validatable.getDates().isEmpty())
            missing.append("dates, ");
        if (validatable.getMorningStartTime() == null)
            missing.append("morningStartTime, ");
        if (validatable.getMorningEndTime() == null)
            missing.append("morningEndTime, ");
        if (validatable.getAfternoonStartTime() == null)
            missing.append("afternoonStartTime, ");
        if (validatable.getAfternoonEndTime() == null)
            missing.append("afternoonEndTime, ");
        if (validatable.getSiteIds() == null || validatable.getSiteIds().isEmpty())
            missing.append("siteIds, ");
        if (validatable.getDepartmentIds() == null || validatable.getDepartmentIds().isEmpty())
            missing.append("departmentIds, ");
        return !missing.isEmpty() ? missing.substring(0, missing.length() - 2) : "";
    }

    private String getMissingParticipantsFields(GroupeValidatable validatable) {
        StringBuilder missing = new StringBuilder();
        if (validatable.getTargetAudience() == null || validatable.getTargetAudience().trim().isEmpty())
            missing.append("targetAudience, ");
        if (hasAtLeastOneParticipantCount(validatable))
            missing.append("participantCounts, ");
        return !missing.isEmpty() ? missing.substring(0, missing.length() - 2) : "";
    }

    private String getMissingInternalProviderFields(GroupeValidatable validatable) {
        StringBuilder missing = new StringBuilder();
        if (validatable.getInternalTrainerId() == null)
            missing.append("internalTrainerId, ");
        if (validatable.getTrainerName() == null || validatable.getTrainerName().trim().isEmpty())
            missing.append("trainerName, ");
        return !missing.isEmpty() ? missing.substring(0, missing.length() - 2) : "";
    }

    private String getMissingExternalProviderFields(GroupeValidatable validatable) {
        StringBuilder missing = new StringBuilder();
        if (validatable.getOcf() == null)
            missing.append("ocf, ");
        if (validatable.getTrainer() == null)
            missing.append("trainer, ");
        if (validatable.getTrainerName() == null || validatable.getTrainerName().trim().isEmpty())
            missing.append("trainerName, ");
        if (validatable.getPrice() == null || validatable.getPrice() <= 0)
            missing.append("price, ");
        return !missing.isEmpty() ? missing.substring(0, missing.length() - 2) : "";
    }

    // Classe interne pour le rapport de complétude
    public static class CompletionReport {
        @Setter
        @Getter
        private boolean complete;
        private final StringBuilder missingFields = new StringBuilder();

        public void addMissingField(String section, String fields) {
            if (fields != null && !fields.trim().isEmpty()) {
                missingFields.append(section).append(": ").append(fields).append("; ");
            }
        }

        public String getMissingFields() {
            return missingFields.toString();
        }

        @Override
        public String toString() {
            return "CompletionReport{complete=" + complete + ", missingFields='" + getMissingFields() + "'}";
        }
    }
}