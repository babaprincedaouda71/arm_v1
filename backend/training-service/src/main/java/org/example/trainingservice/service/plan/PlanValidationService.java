package org.example.trainingservice.service.plan;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.entity.plan.Plan;
import org.example.trainingservice.entity.plan.Training;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.PlanStatusEnum;
import org.example.trainingservice.enums.TrainingStatusEnum;
import org.example.trainingservice.repository.plan.TrainingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PlanValidationService {

    private final TrainingRepository trainingRepository;

    public PlanValidationService(TrainingRepository trainingRepository) {
        this.trainingRepository = trainingRepository;
    }

    /**
     * Vérifie si un plan CSF peut être validé par l'OFPPT
     * Un plan peut être validé si :
     * 1. C'est un plan CSF (isCSFPlan = true)
     * 2. Il contient au moins une formation CSF
     * 3. Toutes les formations CSF sont complètes (isAllFieldFilled = true)
     * 4. Toutes les formations CSF ont au moins un groupe complet
     *
     * @param plan Le plan à valider
     * @return true si le plan peut être validé, false sinon
     */
    public boolean canPlanBeOFPPTValidated(Plan plan) {
        if (plan == null) {
            return false;
        }

        // Vérifier que c'est un plan CSF
        if (!Boolean.TRUE.equals(plan.getIsCSFPlan())) {
            return false;
        }

        // Récupérer toutes les formations CSF du plan
        List<Training> csfTrainings = plan.getTrainings().stream()
                .filter(training -> Boolean.TRUE.equals(training.getCsf()))
                .toList();

        // Il doit y avoir au moins une formation CSF
        if (csfTrainings.isEmpty()) {
            return false;
        }

        // Toutes les formations CSF doivent être complètes
        for (Training training : csfTrainings) {
            if (!Boolean.TRUE.equals(training.getIsAllFieldsFilled())) {
                return false;
            }

            // Chaque formation CSF doit avoir au moins un groupe complet
            if (hasNoCompleteGroup(training)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Génère un rapport détaillé de validation pour un plan
     *
     * @param plan Le plan à analyser
     * @return Un rapport détaillé avec les problèmes identifiés
     */
    public PlanValidationReport generateValidationReport(Plan plan) {
        PlanValidationReport report = new PlanValidationReport();
        report.setPlanId(plan.getId().toString());
        report.setPlanTitle(plan.getTitle());

        if (!Boolean.TRUE.equals(plan.getIsCSFPlan())) {
            report.addIssue("Ce plan n'est pas marqué comme plan CSF");
            report.setCanBeValidated(false);
            return report;
        }

        List<Training> csfTrainings = plan.getTrainings().stream()
                .filter(training -> Boolean.TRUE.equals(training.getCsf()))
                .toList();

        if (csfTrainings.isEmpty()) {
            report.addIssue("Aucune formation CSF trouvée dans ce plan");
            report.setCanBeValidated(false);
            return report;
        }

        boolean allValid = true;
        for (Training training : csfTrainings) {
            TrainingValidationDetail detail = analyzeTraining(training);
            report.addTrainingDetail(detail);

            if (!detail.isComplete()) {
                allValid = false;
            }
        }

        report.setCanBeValidated(allValid);

        if (allValid) {
            report.addMessage("Toutes les formations CSF sont complètes. Le plan peut être validé.");
        } else {
            report.addMessage("Certaines formations CSF ne sont pas complètes. Veuillez les compléter avant validation.");
        }

        return report;
    }

    /**
     * Analyse une formation spécifique
     */
    private TrainingValidationDetail analyzeTraining(Training training) {
        TrainingValidationDetail detail = new TrainingValidationDetail();
        detail.setTrainingId(training.getId().toString());
        detail.setTrainingTheme(training.getTheme());

        // Vérifier si la formation est complète
        boolean trainingComplete = Boolean.TRUE.equals(training.getIsAllFieldsFilled());
        detail.setComplete(trainingComplete);

        // Ajouter les champs manquants si la formation n'est pas complète
        if (!trainingComplete) {
            detail.addMissingField("Formation incomplète - certains champs obligatoires sont manquants");
        }

        // Analyser les groupes
        if (training.getGroupes() != null) {
            for (TrainingGroupe groupe : training.getGroupes()) {
                GroupeValidationDetail groupeDetail = new GroupeValidationDetail();
                groupeDetail.setGroupeId(groupe.getId());
                groupeDetail.setGroupeName(groupe.getName());
                groupeDetail.setComplete(Boolean.TRUE.equals(groupe.getIsAllFieldsFilled()));

                if (!groupeDetail.isComplete()) {
                    groupeDetail.setMissingFields("Groupe incomplet - certains champs sont manquants");
                    detail.setComplete(false); // Si un groupe est incomplet, la formation l'est aussi
                }

                detail.addGroupeDetail(groupeDetail);
            }
        }

        // Vérifier qu'il y a au moins un groupe complet
        if (hasNoCompleteGroup(training)) {
            detail.setComplete(false);
            if (training.getGroupes() == null || training.getGroupes().isEmpty()) {
                detail.addMissingField("Aucun groupe de formation créé");
            } else {
                detail.addMissingField("Aucun groupe complet trouvé");
            }
        }

        return detail;
    }

    /**
     * Vérifie si une formation n'a aucun groupe complet
     */
    private boolean hasNoCompleteGroup(Training training) {
        if (training.getGroupes() == null || training.getGroupes().isEmpty()) {
            return true;
        }

        return training.getGroupes().stream()
                .noneMatch(groupe -> Boolean.TRUE.equals(groupe.getIsAllFieldsFilled()));
    }

    /**
     * Met à jour le statut de validation OFPPT d'un plan et gère les formations CSF
     */
    @Transactional
    public Plan updateOFPPTValidationStatus(Plan plan, boolean isValidated) {
        // Vérifier que la validation est possible avant de l'activer
        if (isValidated && !canPlanBeOFPPTValidated(plan)) {
            throw new IllegalStateException("Le plan ne peut pas être validé OFPPT car il ne satisfait pas tous les critères");
        }

        // Mettre à jour le statut de validation du plan
        plan.setIsOFPPTValidation(isValidated);
        plan.setStatus(PlanStatusEnum.PLANNED);

        // Si la validation OFPPT est activée, mettre à jour le statut des formations CSF
        if (isValidated) {
            updateCSFTrainingsStatus(plan);
        }

        return plan;
    }

    /**
     * Met à jour le statut des formations CSF du plan en "PLANNED" lors de la validation OFPPT
     *
     * @param plan Le plan dont les formations CSF doivent être mises à jour
     */
    @Transactional
    protected void updateCSFTrainingsStatus(Plan plan) {
        log.info("Mise à jour du statut des formations CSF pour le plan validé OFPPT: {}", plan.getId());

        // Récupérer toutes les formations CSF du plan
        List<Training> csfTrainings = plan.getTrainings().stream()
                .filter(training -> Boolean.TRUE.equals(training.getCsf()))
                .filter(training -> !TrainingStatusEnum.PLANNED.equals(training.getStatus())) // Éviter les mises à jour inutiles
                .toList();

        if (csfTrainings.isEmpty()) {
            log.info("Aucune formation CSF à mettre à jour pour le plan: {}", plan.getId());
            return;
        }

        // Mettre à jour le statut de chaque formation CSF
        List<Training> trainingsToUpdate = new ArrayList<>();
        for (Training training : csfTrainings) {
            // Vérifier que la formation est complète avant de la marquer comme planifiée
            if (Boolean.TRUE.equals(training.getIsAllFieldsFilled())) {
                training.setStatus(TrainingStatusEnum.PLANNED);
                trainingsToUpdate.add(training);

                log.debug("Formation CSF '{}' (ID: {}) mise à jour vers le statut PLANNED",
                        training.getTheme(), training.getId());
            } else {
                log.warn("Formation CSF '{}' (ID: {}) non complète, statut non mis à jour",
                        training.getTheme(), training.getId());
            }
        }

        // Sauvegarder en batch pour optimiser les performances
        if (!trainingsToUpdate.isEmpty()) {
            trainingRepository.saveAll(trainingsToUpdate);
            log.info("Statut mis à jour pour {} formations CSF du plan: {}",
                    trainingsToUpdate.size(), plan.getId());
        }
    }

    // Classes pour le rapport de validation

    @Getter
    @Setter
    public static class PlanValidationReport {
        private String planId;
        private String planTitle;
        private boolean canBeValidated;
        private List<String> issues = new ArrayList<>();
        private List<String> messages = new ArrayList<>();
        private List<TrainingValidationDetail> trainingDetails = new ArrayList<>();

        public void addIssue(String issue) {
            this.issues.add(issue);
        }

        public void addMessage(String message) {
            this.messages.add(message);
        }

        public void addTrainingDetail(TrainingValidationDetail detail) {
            this.trainingDetails.add(detail);
        }
    }

    @Getter
    @Setter
    public static class TrainingValidationDetail {
        private String trainingId;
        private String trainingTheme;
        private boolean complete;
        private List<String> missingFields = new ArrayList<>();
        private List<GroupeValidationDetail> groupeDetails = new ArrayList<>();

        public void addMissingField(String field) {
            this.missingFields.add(field);
        }

        public void addGroupeDetail(GroupeValidationDetail detail) {
            this.groupeDetails.add(detail);
        }
    }

    @Getter
    @Setter
    public static class GroupeValidationDetail {
        private Long groupeId;
        private String groupeName;
        private boolean complete;
        private String missingFields;
    }
}