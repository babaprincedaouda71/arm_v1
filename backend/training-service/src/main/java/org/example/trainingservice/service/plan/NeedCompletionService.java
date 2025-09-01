package org.example.trainingservice.service.plan;

import lombok.Getter;
import lombok.Setter;
import org.example.trainingservice.entity.Need;
import org.springframework.stereotype.Service;

@Service
public class NeedCompletionService {

    /**
     * Vérifie si un besoin est complète
     * Un besoin est considérée comme complète si :
     * 1. Tous ses champs obligatoires sont remplis
     * 2. Au moins un groupe complet existe (si ce n'est pas un besoin CSF)
     * 3. Pour les formations CSF, seuls les champs de base sont requis
     *
     * @param need L'entité Need à vérifier
     * @return true si le besoin est complète, false sinon
     */
    public boolean isNeedComplete(Need need) {
        if (need == null) {
            return false;
        }

        // Vérification des champs obligatoires de base
        if (!hasRequiredBaseFields(need)) {
            return false;
        }

        // Pour les formations CSF, seuls les champs de base sont requis
        if (Boolean.TRUE.equals(need.getCsf())) {
            return hasRequiredCsfFields(need);
        }

        // Pour les formations non-CSF, vérifier qu'au moins un groupe est complet
        return hasAtLeastOneCompleteGroup(need);
    }

    /**
     * Met à jour le statut de complétude de la besoin
     *
     * @param need L'entité Need à mettre à jour
     * @return L'entité avec le champ isAllFieldFilled mis à jour
     */
    public Need updateCompletionStatus(Need need) {
        boolean isComplete = isNeedComplete(need);
        need.setIsAllFieldsFilled(isComplete);
        return need;
    }

    /**
     * Retourne un rapport détaillé des champs manquants
     *
     * @param need L'entité Need à analyser
     * @return NeedCompletionReport avec les détails
     */
    public NeedCompletionReport getCompletionReport(Need need) {
        NeedCompletionReport report = new NeedCompletionReport();
        report.setComplete(isNeedComplete(need));

        if (!hasRequiredBaseFields(need)) {
            report.addMissingField("Champs de base", getMissingBaseFields(need));
        }

        if (Boolean.TRUE.equals(need.getCsf()) && !hasRequiredCsfFields(need)) {
            report.addMissingField("Champs CSF", getMissingCsfFields(need));
        }

        if (!Boolean.TRUE.equals(need.getCsf()) && !hasAtLeastOneCompleteGroup(need)) {
            report.addMissingField("Groupes", "Au moins un groupe complet requis");
        }

        return report;
    }

    /**
     * Vérifie si au moins un groupe de la besoin est complet
     *
     * @param need Le besoin à vérifier
     * @return true si au moins un groupe est complet
     */
    public boolean hasAtLeastOneCompleteGroup(Need need) {
        if (need.getGroupes() == null || need.getGroupes().isEmpty()) {
            return false;
        }

        return need.getGroupes().stream()
                .anyMatch(groupe -> Boolean.TRUE.equals(groupe.getIsAllFieldsFilled()));
    }

    /**
     * Compte le nombre de groupes complets dans la besoin
     *
     * @param need La besoin à analyser
     * @return Le nombre de groupes complets
     */
    public long countCompleteGroups(Need need) {
        if (need.getGroupes() == null) {
            return 0;
        }

        return need.getGroupes().stream()
                .filter(groupe -> Boolean.TRUE.equals(groupe.getIsAllFieldsFilled()))
                .count();
    }

    // Méthodes privées de validation

    private boolean hasRequiredBaseFields(Need need) {
        return need.getCompanyId() != null &&
                need.getSiteIds() != null && !need.getSiteIds().isEmpty() &&
                need.getDepartmentIds() != null && !need.getDepartmentIds().isEmpty() &&
                need.getDomainId() != null &&
                need.getNumberOfDay() > 0 &&
                need.getNumberOfGroup() > 0 &&
                need.getQualificationId() != null &&
                need.getTheme() != null && !need.getTheme().trim().isEmpty() &&
                need.getType() != null && !need.getType().trim().isEmpty() &&
                need.getObjective() != null && !need.getObjective().trim().isEmpty() &&
                need.getContent() != null && !need.getContent().trim().isEmpty() &&
                need.getCsf() != null;
    }

    private boolean hasRequiredCsfFields(Need need) {
        // Pour les formations CSF, vérifier aussi le champ csfPlanifie
        return need.getCsfPlanifie() != null && !need.getCsfPlanifie().trim().isEmpty();
    }

    // Méthodes pour obtenir les champs manquants (pour le rapport détaillé)

    private String getMissingBaseFields(Need need) {
        StringBuilder missing = new StringBuilder();

        if (need.getCompanyId() == null) missing.append("companyId, ");
        if (need.getSiteIds() == null || need.getSiteIds().isEmpty()) missing.append("siteIds, ");
        if (need.getDepartmentIds() == null || need.getDepartmentIds().isEmpty())
            missing.append("departmentIds, ");
        if (need.getDomainId() == null) missing.append("domainId, ");
        if (need.getNumberOfDay() <= 0) missing.append("numberOfDay, ");
        if (need.getNumberOfGroup() <= 0) missing.append("numberOfGroup, ");
        if (need.getQualificationId() == null) missing.append("qualificationId, ");
        if (need.getTheme() == null || need.getTheme().trim().isEmpty()) missing.append("theme, ");
        if (need.getType() == null || need.getType().trim().isEmpty()) missing.append("type, ");
        if (need.getObjective() == null || need.getObjective().trim().isEmpty()) missing.append("objective, ");
        if (need.getContent() == null || need.getContent().trim().isEmpty()) missing.append("content, ");
        if (need.getCsf() == null) missing.append("csf, ");

        return removeTrailingComma(missing);
    }

    private String getMissingCsfFields(Need need) {
        StringBuilder missing = new StringBuilder();

        if (need.getCsfPlanifie() == null || need.getCsfPlanifie().trim().isEmpty()) {
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
    public static class NeedCompletionReport {
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