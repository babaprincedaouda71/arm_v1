package org.example.trainingservice.utils;

import org.example.trainingservice.dto.group.AddOrEditGroupParticipantsDto;
import org.example.trainingservice.dto.group.GroupDto;
import org.example.trainingservice.dto.group.GroupToAddOrEditDto;
import org.example.trainingservice.dto.ocf.OCFAddOrEditGroupDto;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.TrainingType;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class TrainingGroupeUtilMethods {
    public static int calculateTotalParticipants(AddOrEditGroupParticipantsDto dto) {
        return dto.getManagerCount()
                + dto.getEmployeeCount()
                + dto.getWorkerCount()
                + dto.getTemporaryWorkerCount();
    }

    public static GroupDto convertToGroupDto(TrainingGroupe trainingGroupe) {
        GroupDto dto = new GroupDto();
        dto.setId(trainingGroupe.getId());
        dto.setName(trainingGroupe.getName()); // J'ai utilisé 'label' car c'est le nom du champ dans ton entité Groupe
        dto.setStartDate(trainingGroupe.getStartDate()); // Conversion de LocalDate en String
        dto.setDates(trainingGroupe.getDates() != null ? String.join(",\n", trainingGroupe.getDates()) : null);
        // Il faudra récupérer le nombre de participants (cela pourrait impliquer une requête à la table 'inscription')
        // Pour l'instant, je le laisse comme ça, tu devras implémenter la logique pour le récupérer
        dto.setParticipantCount(
                (trainingGroupe.getManagerCount() == null ? 0 : trainingGroupe.getManagerCount()) +
                        (trainingGroupe.getEmployeeCount() == null ? 0 : trainingGroupe.getEmployeeCount()) +
                        (trainingGroupe.getWorkerCount() == null ? 0 : trainingGroupe.getWorkerCount()) +
                        (trainingGroupe.getTemporaryWorkerCount() == null ? 0 : trainingGroupe.getTemporaryWorkerCount()));
        if (trainingGroupe.getDayCount() != null) {
            dto.setDayCount(trainingGroupe.getDayCount());
        }
        if (trainingGroupe.getPrice() != null) {
            dto.setPrice(trainingGroupe.getPrice());
        }
        dto.setTrainerName(trainingGroupe.getTrainer() != null ? trainingGroupe.getTrainer().getName() : trainingGroupe.getTrainerName() != null ? trainingGroupe.getTrainerName() : null);        // Il faudra récupérer le nom du formateur (depuis l'entité Utilisateur ou Formateur selon ton choix)
        // Pour l'instant, je le laisse comme ça, tu devras implémenter la logique pour le récupérer
        dto.setTrainingProvider(null); // À implémenter
        // Il faudra convertir le statut de l'entité Groupe vers l'enum GroupeStatusEnums
        dto.setStatus(trainingGroupe.getStatus().getDescription()); // À implémenter la conversion de statut
        return dto;
    }

    public static GroupToAddOrEditDto convertToTrainingGroupToAddOrEditDto(TrainingGroupe trainingGroupe, Boolean isTrainingComplete, Boolean isOFPPTValidationEnabled) {
        GroupToAddOrEditDto dto = GroupToAddOrEditDto.builder()
                .id(trainingGroupe.getId())
                .location(trainingGroupe.getLocation())
                .city(trainingGroupe.getCity())
                .dates(trainingGroupe.getDates())
                .morningStartTime(trainingGroupe.getMorningStartTime())
                .morningEndTime(trainingGroupe.getMorningEndTime())
                .afternoonStartTime(trainingGroupe.getAfternoonStartTime())
                .afternoonEndTime(trainingGroupe.getAfternoonEndTime())
                .targetAudience(trainingGroupe.getTargetAudience())
                .managerCount(trainingGroupe.getManagerCount())
                .employeeCount(trainingGroupe.getEmployeeCount())
                .workerCount(trainingGroupe.getWorkerCount())
                .temporaryWorkerCount(trainingGroupe.getTemporaryWorkerCount())
                .userGroupIds(trainingGroupe.getUserGroupIds())
                .isTrainingComplete(isTrainingComplete)
                .isOFPPTValidationEnabled(isOFPPTValidationEnabled)
                .build();

        // Gestion du Trainer dans le DTO de réponse
        if (trainingGroupe.getTrainer() != null) {
            dto.setExternalTrainerName(trainingGroupe.getTrainer().getName());
            dto.setExternalTrainerEmail(trainingGroupe.getTrainer().getEmail());
            dto.setCost(trainingGroupe.getPrice());
            dto.setTrainingType(TrainingType.EXTERNAL.getDescription());
        } else {
            dto.setComment(trainingGroupe.getComment());
            dto.setInternalTrainerId(trainingGroupe.getInternalTrainerId());
            dto.setTrainingType(TrainingType.INTERNAL.getDescription());
        }

        // Gestion de l'OCF dans le DTO de réponse
        if (trainingGroupe.getOcf() != null) {
            dto.setOcf(OCFAddOrEditGroupDto.builder()
                    .id(trainingGroupe.getOcf().getId())
                    .corporateName(trainingGroupe.getOcf().getCorporateName())
                    .build());
        }

        return dto;
    }

    public static GroupToAddOrEditDto convertToGroupToAddOrEditDto(TrainingGroupe trainingGroupe) {
        GroupToAddOrEditDto dto = GroupToAddOrEditDto.builder()
                .id(trainingGroupe.getId())
                .location(trainingGroupe.getLocation())
                .city(trainingGroupe.getCity())
                .dates(trainingGroupe.getDates())
                .morningStartTime(trainingGroupe.getMorningStartTime())
                .morningEndTime(trainingGroupe.getMorningEndTime())
                .afternoonStartTime(trainingGroupe.getAfternoonStartTime())
                .afternoonEndTime(trainingGroupe.getAfternoonEndTime())
                .targetAudience(trainingGroupe.getTargetAudience())
                .managerCount(trainingGroupe.getManagerCount())
                .employeeCount(trainingGroupe.getEmployeeCount())
                .workerCount(trainingGroupe.getWorkerCount())
                .temporaryWorkerCount(trainingGroupe.getTemporaryWorkerCount())
                .userGroupIds(trainingGroupe.getUserGroupIds())
                .build();

        // Gestion du Trainer dans le DTO de réponse
        if (trainingGroupe.getTrainer() != null) {
            dto.setExternalTrainerName(trainingGroupe.getTrainer().getName());
            dto.setExternalTrainerEmail(trainingGroupe.getTrainer().getEmail());
            dto.setCost(trainingGroupe.getPrice());
            dto.setTrainingType(TrainingType.EXTERNAL.getDescription());
        } else {
            dto.setComment(trainingGroupe.getComment());
            dto.setInternalTrainerId(trainingGroupe.getInternalTrainerId());
            dto.setTrainingType(TrainingType.INTERNAL.getDescription());
        }

        // Gestion de l'OCF dans le DTO de réponse
        if (trainingGroupe.getOcf() != null) {
            dto.setOcf(OCFAddOrEditGroupDto.builder()
                    .id(trainingGroupe.getOcf().getId())
                    .corporateName(trainingGroupe.getOcf().getCorporateName())
                    .build());
        }

        return dto;
    }

    public static LocalDate getLastDate(List<String> dateStrings, String format) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);

        return dateStrings.stream()
                .map(dateStr -> LocalDate.parse(dateStr, formatter))
                .max(LocalDate::compareTo)
                .orElse(null); // null si la liste est vide ou invalide
    }

    public static Long extraireNumber(String texte) {
        String nombreStr = texte.replaceAll("[^0-9]", "");
        return (long) Integer.parseInt(nombreStr);
    }

}