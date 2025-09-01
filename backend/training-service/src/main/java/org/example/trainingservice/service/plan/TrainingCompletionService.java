package org.example.trainingservice.service.plan;

import lombok.Getter;
import lombok.Setter;
import org.example.trainingservice.entity.plan.Training;
import org.example.trainingservice.enums.TrainingStatusEnum;
import org.springframework.stereotype.Service;

@Service
public class TrainingCompletionService {

    /**
     * Vérifie si une formation est complète
     * Une formation est considérée comme complète si :
     * 1. Tous ses champs obligatoires sont remplis
     * 2. Au moins un groupe complet existe (si ce n'est pas une formation CSF)
     * 3. Pour les formations CSF, seuls les champs de base sont requis
     *
     * @param training L'entité Training à vérifier
     * @return true si la formation est complète, false sinon
     */
    public boolean isTrainingComplete(Training training) {
        if (training == null) {
            return false;
        }

        // Vérification des champs obligatoires de base
        if (!hasRequiredBaseFields(training)) {
            return false;
        }

        // Pour les formations CSF, seuls les champs de base sont requis
        if (Boolean.TRUE.equals(training.getCsf())) {
            return hasRequiredCsfFields(training);
        }

        // Pour les formations non-CSF, vérifier qu'au moins un groupe est complet
        return hasAtLeastOneCompleteGroup(training);
    }

    /**
     * Met à jour le statut de complétude de la formation
     *
     * @param training L'entité Training à mettre à jour
     * @return L'entité avec le champ isAllFieldFilled mis à jour
     */
    public Training updateCompletionStatus(Training training) {
        boolean isComplete = isTrainingComplete(training);
        training.setIsAllFieldsFilled(isComplete);
        return training;
    }

    /**
     * Retourne un rapport détaillé des champs manquants
     *
     * @param training L'entité Training à analyser
     * @return TrainingCompletionReport avec les détails
     */
    public TrainingCompletionReport getCompletionReport(Training training) {
        TrainingCompletionReport report = new TrainingCompletionReport();
        report.setComplete(isTrainingComplete(training));

        if (!hasRequiredBaseFields(training)) {
            report.addMissingField("Champs de base", getMissingBaseFields(training));
        }

        if (Boolean.TRUE.equals(training.getCsf()) && !hasRequiredCsfFields(training)) {
            report.addMissingField("Champs CSF", getMissingCsfFields(training));
        }

        if (!Boolean.TRUE.equals(training.getCsf()) && !hasAtLeastOneCompleteGroup(training)) {
            report.addMissingField("Groupes", "Au moins un groupe complet requis");
        }

        return report;
    }

    /**
     * Vérifie si au moins un groupe de la formation est complet
     *
     * @param training La formation à vérifier
     * @return true si au moins un groupe est complet
     */
    public boolean hasAtLeastOneCompleteGroup(Training training) {
        if (training.getGroupes() == null || training.getGroupes().isEmpty()) {
            return false;
        }

        return training.getGroupes().stream()
                .anyMatch(groupe -> Boolean.TRUE.equals(groupe.getIsAllFieldsFilled()));
    }

    /**
     * Compte le nombre de groupes complets dans la formation
     *
     * @param training La formation à analyser
     * @return Le nombre de groupes complets
     */
    public long countCompleteGroups(Training training) {
        if (training.getGroupes() == null) {
            return 0;
        }

        return training.getGroupes().stream()
                .filter(groupe -> Boolean.TRUE.equals(groupe.getIsAllFieldsFilled()))
                .count();
    }

    // Méthodes privées de validation

    private boolean hasRequiredBaseFields(Training training) {
        return training.getCompanyId() != null &&
                training.getSiteIds() != null && !training.getSiteIds().isEmpty() &&
                training.getDepartmentIds() != null && !training.getDepartmentIds().isEmpty() &&
                training.getDomainId() != null &&
                training.getNumberOfDay() > 0 &&
                training.getNumberOfGroup() > 0 &&
                training.getQualificationId() != null &&
                training.getTheme() != null && !training.getTheme().trim().isEmpty() &&
                training.getType() != null && !training.getType().trim().isEmpty() &&
                training.getObjective() != null && !training.getObjective().trim().isEmpty() &&
                training.getContent() != null && !training.getContent().trim().isEmpty() &&
                training.getCsf() != null &&
                training.getPlan() != null;
    }

    private boolean hasRequiredCsfFields(Training training) {
        // Pour les formations CSF, vérifier aussi le champ csfPlanifie
        return training.getCsfPlanifie() != null && !training.getCsfPlanifie().trim().isEmpty();
    }

    // Méthodes pour obtenir les champs manquants (pour le rapport détaillé)

    private String getMissingBaseFields(Training training) {
        StringBuilder missing = new StringBuilder();

        if (training.getCompanyId() == null) missing.append("companyId, ");
        if (training.getSiteIds() == null || training.getSiteIds().isEmpty()) missing.append("siteIds, ");
        if (training.getDepartmentIds() == null || training.getDepartmentIds().isEmpty())
            missing.append("departmentIds, ");
        if (training.getDomainId() == null) missing.append("domainId, ");
        if (training.getNumberOfDay() <= 0) missing.append("numberOfDay, ");
        if (training.getNumberOfGroup() <= 0) missing.append("numberOfGroup, ");
        if (training.getQualificationId() == null) missing.append("qualificationId, ");
        if (training.getTheme() == null || training.getTheme().trim().isEmpty()) missing.append("theme, ");
        if (training.getType() == null || training.getType().trim().isEmpty()) missing.append("type, ");
        if (training.getObjective() == null || training.getObjective().trim().isEmpty()) missing.append("objective, ");
        if (training.getContent() == null || training.getContent().trim().isEmpty()) missing.append("content, ");
        if (training.getCsf() == null) missing.append("csf, ");
        if (training.getPlan() == null) missing.append("plan, ");

        return removeTrailingComma(missing);
    }

    private String getMissingCsfFields(Training training) {
        StringBuilder missing = new StringBuilder();

        if (training.getCsfPlanifie() == null || training.getCsfPlanifie().trim().isEmpty()) {
            missing.append("csfPlanifie, ");
        }

        return removeTrailingComma(missing);
    }

    private String removeTrailingComma(StringBuilder sb) {
        if (sb.length() > 2) {
            return sb.substring(0, sb.length() - 2);
        }
        return sb.toString();
    }

    // Classe interne pour le rapport de complétude
    public static class TrainingCompletionReport {
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
            return "TrainingCompletionReport{complete=" + complete +
                    ", missingFields='" + getMissingFields() + "'}";
        }
    }
}