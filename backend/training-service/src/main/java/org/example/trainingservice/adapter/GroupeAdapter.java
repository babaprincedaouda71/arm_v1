package org.example.trainingservice.adapter;

import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Trainer;
import org.example.trainingservice.enums.TrainingType;

import java.util.List;
import java.util.Set;

public class GroupeAdapter implements GroupeValidatable {
    private final Groupe groupe;

    public GroupeAdapter(Groupe groupe) {
        this.groupe = groupe;
    }

    @Override
    public String getName() {
        return groupe.getName();
    }

    @Override
    public Long getCompanyId() {
        return groupe.getCompanyId();
    }

    @Override
    public String getLocation() {
        return groupe.getLocation();
    }

    @Override
    public String getCity() {
        return groupe.getCity();
    }

    @Override
    public List<String> getDates() {
        return groupe.getDates();
    }

    @Override
    public String getMorningStartTime() {
        return groupe.getMorningStartTime();
    }

    @Override
    public String getMorningEndTime() {
        return groupe.getMorningEndTime();
    }

    @Override
    public String getAfternoonStartTime() {
        return groupe.getAfternoonStartTime();
    }

    @Override
    public String getAfternoonEndTime() {
        return groupe.getAfternoonEndTime();
    }

    @Override
    public Integer getDayCount() {
        return groupe.getDayCount();
    }

    @Override
    public List<Long> getSiteIds() {
        return groupe.getSiteIds();
    }

    @Override
    public List<Long> getDepartmentIds() {
        return groupe.getDepartmentIds();
    }

    @Override
    public String getTargetAudience() {
        return groupe.getTargetAudience();
    }

    @Override
    public Integer getManagerCount() {
        return groupe.getManagerCount();
    }

    @Override
    public Integer getEmployeeCount() {
        return groupe.getEmployeeCount();
    }

    @Override
    public Integer getWorkerCount() {
        return groupe.getWorkerCount();
    }

    @Override
    public Integer getTemporaryWorkerCount() {
        return groupe.getTemporaryWorkerCount();
    }

    @Override
    public Set<Long> getUserGroupIds() {
        return groupe.getUserGroupIds();
    }

    @Override
    public TrainingType getTrainingType() {
        return groupe.getTrainingType();
    }

    @Override
    public Long getInternalTrainerId() {
        return groupe.getInternalTrainerId();
    }

    @Override
    public String getTrainerName() {
        return groupe.getTrainerName();
    }

    @Override
    public Object getOcf() {
        return groupe.getOcf();
    }

    @Override
    public Trainer getTrainer() {
        return groupe.getTrainer();
    }

    @Override
    public Float getPrice() {
        return groupe.getPrice();
    }

    @Override
    public void setIsAllFieldsFilled(Boolean isComplete) {
        groupe.setIsAllFieldsFilled(isComplete);
    }

    // Méthode pour vérifier la présence d'un training/need
    public boolean hasTrainingOrNeed() {
        return groupe.getNeed() != null;
    }
}