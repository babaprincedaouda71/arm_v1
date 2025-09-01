package org.example.trainingservice.adapter;

import org.example.trainingservice.enums.TrainingType;

import java.util.List;
import java.util.Set;

/**
 * Interface commune pour définir les propriétés partagées entre TrainingGroupe et Groupe
 */
public interface GroupeValidatable {
    String getName();

    Long getCompanyId();

    String getLocation();

    String getCity();

    List<String> getDates();

    String getMorningStartTime();

    String getMorningEndTime();

    String getAfternoonStartTime();

    String getAfternoonEndTime();

    Integer getDayCount();

    List<Long> getSiteIds();

    List<Long> getDepartmentIds();

    String getTargetAudience();

    Integer getManagerCount();

    Integer getEmployeeCount();

    Integer getWorkerCount();

    Integer getTemporaryWorkerCount();

    Set<Long> getUserGroupIds();

    TrainingType getTrainingType();

    Long getInternalTrainerId();

    String getTrainerName();

    Object getOcf();

    Object getTrainer();

    Float getPrice();

    // Méthodes pour la mise à jour du statut
    void setIsAllFieldsFilled(Boolean isComplete);
}