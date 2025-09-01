package org.example.trainingservice.service.plan;

import lombok.Getter;
import lombok.Setter;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.TrainingType;
import org.springframework.stereotype.Service;

@Service
public class TrainingGroupeCompletionService {

    /**
     * Vérifie si un TrainingGroupe est complet en fonction de son type de formation.
     * Pour cela, on valide :
     * - Les champs communs obligatoires,
     * - Les champs de planification,
     * - Les champs de participants,
     * - Et enfin les informations du provider :
     *      -> On ne peut PAS avoir à la fois les informations d’un provider interne et externe.
     *      -> Il faut qu’au moins l’un soit présent et que ce soit cohérent avec le type de formation.
     *
     * @param trainingGroupe L'entité à vérifier
     * @return true si l'entité est complète, false sinon
     */
    public boolean isTrainingGroupeComplete(TrainingGroupe trainingGroupe) {
        if (trainingGroupe == null) {
            return false;
        }
        // Vérification des champs communs obligatoires
        if (hasCommonRequiredFields(trainingGroupe)) {
            return false;
        }
        // Vérification des champs de planification
        if (hasPlanningFields(trainingGroupe)) {
            return false;
        }
        // Vérification des champs de participants
        if (hasParticipantsFields(trainingGroupe)) {
            return false;
        }

        // Vérification des providers
        boolean internalPresent = hasInternalProviderFields(trainingGroupe);
        boolean externalPresent = hasExternalProviderFields(trainingGroupe);

        // Ne pas avoir les deux en même temps
        if (internalPresent && externalPresent) {
            return false;
        }
        // Il faut qu'au moins un soit présent
        if (!internalPresent && !externalPresent) {
            return false;
        }

        // En fonction du type de formation, vérifier que le provider renseigné correspond :
        if (trainingGroupe.getTrainingType() == TrainingType.INTERNAL) {
            return internalPresent;
        } else if (trainingGroupe.getTrainingType() == TrainingType.EXTERNAL) {
            return externalPresent;
        }
        // Si le type n'est pas défini, considérer le groupe comme incomplet
        return false;
    }

    /**
     * Met à jour le champ isAllFieldsFilled du groupe en fonction de sa complétude.
     *
     * @param trainingGroupe L'entité à mettre à jour
     * @return L'entité avec le champ isAllFieldsFilled mis à jour
     */
    public TrainingGroupe updateCompletionStatus(TrainingGroupe trainingGroupe) {
        boolean isComplete = isTrainingGroupeComplete(trainingGroupe);
        trainingGroupe.setIsAllFieldsFilled(isComplete);
        return trainingGroupe;
    }

    /**
     * Retourne un rapport détaillé des champs manquants.
     *
     * @param trainingGroupe L'entité à analyser
     * @return CompletionReport avec les détails
     */
    public CompletionReport getCompletionReport(TrainingGroupe trainingGroupe) {
        CompletionReport report = new CompletionReport();
        report.setComplete(isTrainingGroupeComplete(trainingGroupe));

        if (hasCommonRequiredFields(trainingGroupe)) {
            report.addMissingField("Champs communs", "name, training, companyId");
        }
        if (hasPlanningFields(trainingGroupe)) {
            report.addMissingField("Planning", getMissingPlanningFields(trainingGroupe));
        }
        if (hasParticipantsFields(trainingGroupe)) {
            report.addMissingField("Participants", getMissingParticipantsFields(trainingGroupe));
        }

        boolean internalPresent = hasInternalProviderFields(trainingGroupe);
        boolean externalPresent = hasExternalProviderFields(trainingGroupe);
        if(internalPresent && externalPresent) {
            // Conflit : les deux providers sont renseignés
            report.addMissingField("Provider", "Fournir uniquement soit Provider Interne soit Provider Externe, pas les deux en même temps");
        } else {
            if (trainingGroupe.getTrainingType() == TrainingType.INTERNAL && !internalPresent) {
                report.addMissingField("Provider Interne", getMissingInternalProviderFields(trainingGroupe));
            } else if (trainingGroupe.getTrainingType() == TrainingType.EXTERNAL && !externalPresent) {
                report.addMissingField("Provider Externe", getMissingExternalProviderFields(trainingGroupe));
            }
        }
        return report;
    }

    // Méthodes privées de validation

    private boolean hasCommonRequiredFields(TrainingGroupe trainingGroupe) {
        return trainingGroupe.getName() == null
                || trainingGroupe.getName().trim().isEmpty()
                || trainingGroupe.getTraining() == null
                || trainingGroupe.getCompanyId() == null;
    }

    private boolean hasPlanningFields(TrainingGroupe trainingGroupe) {
        return trainingGroupe.getLocation() == null
                || trainingGroupe.getLocation().trim().isEmpty()
                || trainingGroupe.getCity() == null
                || trainingGroupe.getCity().trim().isEmpty()
                || trainingGroupe.getDates() == null
                || trainingGroupe.getDates().isEmpty()
                || trainingGroupe.getMorningStartTime() == null
                || trainingGroupe.getMorningEndTime() == null
                || trainingGroupe.getAfternoonStartTime() == null
                || trainingGroupe.getAfternoonEndTime() == null
                || trainingGroupe.getDayCount() == null
                || trainingGroupe.getSiteIds() == null
                || trainingGroupe.getSiteIds().isEmpty()
                || trainingGroupe.getDepartmentIds() == null
                || trainingGroupe.getDepartmentIds().isEmpty();
    }

    private boolean hasParticipantsFields(TrainingGroupe trainingGroupe) {
        return trainingGroupe.getTargetAudience() == null
                || trainingGroupe.getTargetAudience().trim().isEmpty()
                || hasAtLeastOneParticipantCount(trainingGroupe)
                || trainingGroupe.getUserGroupIds() == null;
//                || trainingGroupe.getUserGroupIds().isEmpty();
    }

    private boolean hasAtLeastOneParticipantCount(TrainingGroupe trainingGroupe) {
        return (trainingGroupe.getManagerCount() == null || trainingGroupe.getManagerCount() <= 0)
                && (trainingGroupe.getEmployeeCount() == null || trainingGroupe.getEmployeeCount() <= 0)
                && (trainingGroupe.getWorkerCount() == null || trainingGroupe.getWorkerCount() <= 0)
                && (trainingGroupe.getTemporaryWorkerCount() == null || trainingGroupe.getTemporaryWorkerCount() <= 0);
    }

    private boolean hasInternalProviderFields(TrainingGroupe trainingGroupe) {
        return trainingGroupe.getInternalTrainerId() != null
                && trainingGroupe.getTrainerName() != null
                && !trainingGroupe.getTrainerName().trim().isEmpty();
    }

    private boolean hasExternalProviderFields(TrainingGroupe trainingGroupe) {
        return trainingGroupe.getOcf() != null
                && trainingGroupe.getTrainer() != null
                && trainingGroupe.getTrainerName() != null
                && !trainingGroupe.getTrainerName().trim().isEmpty()
                && trainingGroupe.getPrice() != null
                && trainingGroupe.getPrice() > 0;
    }

    // Méthodes pour obtenir les champs manquants (pour le rapport détaillé)

    private String getMissingPlanningFields(TrainingGroupe trainingGroupe) {
        StringBuilder missing = new StringBuilder();
        if (trainingGroupe.getLocation() == null || trainingGroupe.getLocation().trim().isEmpty())
            missing.append("location, ");
        if (trainingGroupe.getCity() == null || trainingGroupe.getCity().trim().isEmpty())
            missing.append("city, ");
        if (trainingGroupe.getDates() == null || trainingGroupe.getDates().isEmpty())
            missing.append("dates, ");
        if (trainingGroupe.getMorningStartTime() == null)
            missing.append("morningStartTime, ");
        if (trainingGroupe.getMorningEndTime() == null)
            missing.append("morningEndTime, ");
        if (trainingGroupe.getAfternoonStartTime() == null)
            missing.append("afternoonStartTime, ");
        if (trainingGroupe.getAfternoonEndTime() == null)
            missing.append("afternoonEndTime, ");
        if (trainingGroupe.getSiteIds() == null || trainingGroupe.getSiteIds().isEmpty())
            missing.append("siteIds, ");
        if (trainingGroupe.getDepartmentIds() == null || trainingGroupe.getDepartmentIds().isEmpty())
            missing.append("departmentIds, ");
        return !missing.isEmpty() ? missing.substring(0, missing.length() - 2) : "";
    }

    private String getMissingParticipantsFields(TrainingGroupe trainingGroupe) {
        StringBuilder missing = new StringBuilder();
        if (trainingGroupe.getTargetAudience() == null || trainingGroupe.getTargetAudience().trim().isEmpty())
            missing.append("targetAudience, ");
        if (hasAtLeastOneParticipantCount(trainingGroupe))
            missing.append("participantCounts, ");
        if (trainingGroupe.getUserGroupIds() == null || trainingGroupe.getUserGroupIds().isEmpty())
            missing.append("userGroupIds, ");
        return !missing.isEmpty() ? missing.substring(0, missing.length() - 2) : "";
    }

    private String getMissingInternalProviderFields(TrainingGroupe trainingGroupe) {
        StringBuilder missing = new StringBuilder();
        if (trainingGroupe.getInternalTrainerId() == null)
            missing.append("internalTrainerId, ");
        if (trainingGroupe.getTrainerName() == null || trainingGroupe.getTrainerName().trim().isEmpty())
            missing.append("trainerName, ");
        return !missing.isEmpty() ? missing.substring(0, missing.length() - 2) : "";
    }

    private String getMissingExternalProviderFields(TrainingGroupe trainingGroupe) {
        StringBuilder missing = new StringBuilder();
        if (trainingGroupe.getOcf() == null)
            missing.append("ocf, ");
        if (trainingGroupe.getTrainer() == null)
            missing.append("trainer, ");
        if (trainingGroupe.getTrainerName() == null || trainingGroupe.getTrainerName().trim().isEmpty())
            missing.append("trainerName, ");
        if (trainingGroupe.getPrice() == null || trainingGroupe.getPrice() <= 0)
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