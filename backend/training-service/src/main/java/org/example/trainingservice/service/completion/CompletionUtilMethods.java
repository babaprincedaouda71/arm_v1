package org.example.trainingservice.service.completion;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.entity.plan.Training;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.repository.plan.TrainingRepository;
import org.example.trainingservice.service.plan.NeedCompletionService;
import org.example.trainingservice.service.plan.TrainingCompletionService;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@Slf4j
public class CompletionUtilMethods {
    private final TrainingRepository trainingRepository;
    private final NeedRepository needRepository;
    private final TrainingCompletionService trainingCompletionService;
    private final NeedCompletionService needCompletionService;

    public CompletionUtilMethods(
            TrainingRepository trainingRepository,
            NeedRepository needRepository,
            TrainingCompletionService trainingCompletionService,
            NeedCompletionService needCompletionService
    ) {
        this.trainingRepository = trainingRepository;
        this.needRepository = needRepository;
        this.trainingCompletionService = trainingCompletionService;
        this.needCompletionService = needCompletionService;
    }

    /**
     * Méthode utilitaire pour vérifier et mettre à jour la complétude après modification d'un TrainingGroupe
     */
    public void checkAndUpdateTrainingCompletion(TrainingGroupe trainingGroupe) {
        Training training = trainingGroupe.getTraining();

        // Vérifier et mettre à jour le statut de complétude de la formation
        Boolean wasTrainingComplete = training.getIsAllFieldsFilled();
        training = trainingCompletionService.updateCompletionStatus(training);
        Boolean isTrainingNowComplete = training.getIsAllFieldsFilled();

        // Sauvegarder si le statut a changé (même de null à false/true)
        if (!Objects.equals(wasTrainingComplete, isTrainingNowComplete)) {
            Training savedTraining = trainingRepository.save(training);
            log.info("Statut de complétude de la formation {} mis à jour: {} -> {}",
                    training.getId(), wasTrainingComplete, isTrainingNowComplete);

            // Ici vous pouvez ajouter des actions spécifiques quand la formation devient complète
            // if (Boolean.TRUE.equals(isTrainingNowComplete)) {
            //     performActionWhenTrainingBecomesComplete(savedTraining);
            // }
        }
    }

    /**
     * Méthode utilitaire pour vérifier et mettre à jour la complétude après modification d'un Groupe (Need)
     */
    public void checkAndUpdateNeedCompletion(Groupe groupe) {
        Need need = groupe.getNeed();

        // Vérifier et mettre à jour le statut de complétude du besoin
        Boolean wasNeedComplete = need.getIsAllFieldsFilled();
        need = needCompletionService.updateCompletionStatus(need);
        Boolean isNeedNowComplete = need.getIsAllFieldsFilled();

        // Sauvegarder si le statut a changé (même de null à false/true)
        if (!Objects.equals(wasNeedComplete, isNeedNowComplete)) {
            Need savedNeed = needRepository.save(need);
            log.info("Statut de complétude du besoin {} mis à jour: {} -> {}",
                    need.getId(), wasNeedComplete, isNeedNowComplete);

            // Ici vous pouvez ajouter des actions spécifiques quand le besoin devient complet
            // if (Boolean.TRUE.equals(isNeedNowComplete)) {
            //     performActionWhenNeedBecomesComplete(savedNeed);
            // }
        }
    }
}