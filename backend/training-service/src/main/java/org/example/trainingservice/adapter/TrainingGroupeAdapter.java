package org.example.trainingservice.adapter;

import org.example.trainingservice.entity.TrainerForTrainingGroupe;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.TrainingType;

import java.util.List;
import java.util.Set;

public class TrainingGroupeAdapter implements GroupeValidatable {
    private final TrainingGroupe trainingGroupe;

    public TrainingGroupeAdapter(TrainingGroupe trainingGroupe) {
        this.trainingGroupe = trainingGroupe;
    }

    @Override
    public String getName() {
        return trainingGroupe.getName();
    }

    @Override
    public Long getCompanyId() {
        return trainingGroupe.getCompanyId();
    }

    @Override
    public String getLocation() {
        return trainingGroupe.getLocation();
    }

    @Override
    public String getCity() {
        return trainingGroupe.getCity();
    }

    @Override
    public List<String> getDates() {
        return trainingGroupe.getDates();
    }

    @Override
    public String getMorningStartTime() {
        return trainingGroupe.getMorningStartTime();
    }

    @Override
    public String getMorningEndTime() {
        return trainingGroupe.getMorningEndTime();
    }

    @Override
    public String getAfternoonStartTime() {
        return trainingGroupe.getAfternoonStartTime();
    }

    @Override
    public String getAfternoonEndTime() {
        return trainingGroupe.getAfternoonEndTime();
    }

    @Override
    public Integer getDayCount() {
        return trainingGroupe.getDayCount();
    }

    @Override
    public List<Long> getSiteIds() {
        return trainingGroupe.getSiteIds();
    }

    @Override
    public List<Long> getDepartmentIds() {
        return trainingGroupe.getDepartmentIds();
    }

    @Override
    public String getTargetAudience() {
        return trainingGroupe.getTargetAudience();
    }

    @Override
    public Integer getManagerCount() {
        return trainingGroupe.getManagerCount();
    }

    @Override
    public Integer getEmployeeCount() {
        return trainingGroupe.getEmployeeCount();
    }

    @Override
    public Integer getWorkerCount() {
        return trainingGroupe.getWorkerCount();
    }

    @Override
    public Integer getTemporaryWorkerCount() {
        return trainingGroupe.getTemporaryWorkerCount();
    }

    @Override
    public Set<Long> getUserGroupIds() {
        return trainingGroupe.getUserGroupIds();
    }

    @Override
    public TrainingType getTrainingType() {
        return trainingGroupe.getTrainingType();
    }

    @Override
    public Long getInternalTrainerId() {
        return trainingGroupe.getInternalTrainerId();
    }

    @Override
    public String getTrainerName() {
        return trainingGroupe.getTrainerName();
    }

    @Override
    public Object getOcf() {
        return trainingGroupe.getOcf();
    }

    @Override
    public TrainerForTrainingGroupe getTrainer() {
        return trainingGroupe.getTrainer();
    }

    @Override
    public Float getPrice() {
        return trainingGroupe.getPrice();
    }

    @Override
    public void setIsAllFieldsFilled(Boolean isComplete) {
        trainingGroupe.setIsAllFieldsFilled(isComplete);
    }

    // Méthode pour vérifier la présence d'un training/need
    public boolean hasTrainingOrNeed() {
        return trainingGroupe.getTraining() != null;
    }
}