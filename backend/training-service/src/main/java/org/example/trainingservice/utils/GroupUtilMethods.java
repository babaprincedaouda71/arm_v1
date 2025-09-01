package org.example.trainingservice.utils;

import org.example.trainingservice.dto.group.GroupDto;
import org.example.trainingservice.dto.group.GroupToAddOrEditDto;
import org.example.trainingservice.dto.ocf.OCFAddOrEditGroupDto;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.enums.TrainingType;

public class GroupUtilMethods {

    public static GroupDto convertToGroupDto(Groupe groupe) {
        GroupDto dto = new GroupDto();
        dto.setId(groupe.getId());
        dto.setName(groupe.getName()); // J'ai utilisé 'label' car c'est le nom du champ dans ton entité Groupe
        dto.setStartDate(groupe.getStartDate()); // Conversion de LocalDate en String
        dto.setDates(groupe.getDates() != null ? String.join(",\n", groupe.getDates()) : null);
        // Il faudra récupérer le nombre de participants (cela pourrait impliquer une requête à la table 'inscription')
        // Pour l'instant, je le laisse comme ça, tu devras implémenter la logique pour le récupérer
        dto.setParticipantCount(
                (groupe.getManagerCount() == null ? 0 : groupe.getManagerCount()) +
                        (groupe.getEmployeeCount() == null ? 0 : groupe.getEmployeeCount()) +
                        (groupe.getWorkerCount() == null ? 0 : groupe.getWorkerCount()) +
                        (groupe.getTemporaryWorkerCount() == null ? 0 : groupe.getTemporaryWorkerCount()));
        if (groupe.getDayCount() != null) {
            dto.setDayCount(groupe.getDayCount());
        }
        if (groupe.getPrice() != null) {
            dto.setPrice(groupe.getPrice());
        }
        dto.setTrainerName(groupe.getTrainer() != null ? groupe.getTrainer().getName() : groupe.getTrainerName() != null ? groupe.getTrainerName() : null);        // Il faudra récupérer le nom du formateur (depuis l'entité Utilisateur ou Formateur selon ton choix)
        // Pour l'instant, je le laisse comme ça, tu devras implémenter la logique pour le récupérer
        dto.setTrainingProvider(null); // À implémenter
        // Il faudra convertir le statut de l'entité Groupe vers l'enum GroupeStatusEnums
        dto.setStatus(groupe.getStatus().getDescription()); // À implémenter la conversion de statut
        return dto;
    }


    public static GroupToAddOrEditDto convertToGroupToAddOrEditDto(Groupe groupe) {
        GroupToAddOrEditDto dto = GroupToAddOrEditDto.builder()
                .id(groupe.getId())
                .location(groupe.getLocation())
                .city(groupe.getCity())
                .dates(groupe.getDates())
                .morningStartTime(groupe.getMorningStartTime())
                .morningEndTime(groupe.getMorningEndTime())
                .afternoonStartTime(groupe.getAfternoonStartTime())
                .afternoonEndTime(groupe.getAfternoonEndTime())
                .targetAudience(groupe.getTargetAudience())
                .managerCount(groupe.getManagerCount())
                .employeeCount(groupe.getEmployeeCount())
                .workerCount(groupe.getWorkerCount())
                .temporaryWorkerCount(groupe.getTemporaryWorkerCount())
                .userGroupIds(groupe.getUserGroupIds())
                .build();

        // Gestion du Trainer dans le DTO de réponse
        if (groupe.getTrainer() != null) {
            dto.setExternalTrainerName(groupe.getTrainer().getName());
            dto.setExternalTrainerEmail(groupe.getTrainer().getEmail());
            dto.setCost(groupe.getPrice());
            dto.setTrainingType(TrainingType.EXTERNAL.getDescription());
        } else {
            dto.setComment(groupe.getComment());
            dto.setInternalTrainerId(groupe.getInternalTrainerId());
            dto.setTrainingType(TrainingType.INTERNAL.getDescription());
        }

        // Gestion de l'OCF dans le DTO de réponse
        if (groupe.getOcf() != null) {
            dto.setOcf(OCFAddOrEditGroupDto.builder()
                    .id(groupe.getOcf().getId())
                    .corporateName(groupe.getOcf().getCorporateName())
                    .build());
        }

        return dto;
    }
}