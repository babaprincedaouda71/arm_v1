package org.example.trainingservice.dto.group;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.dto.ocf.OCFAddOrEditGroupDto;
import org.example.trainingservice.enums.TrainingType;

import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupToAddOrEditDto {
    private Long id;

    private String location;

    private String city;

    private List<String> dates;

    private String morningStartTime;

    private String morningEndTime;

    private String afternoonStartTime;

    private String afternoonEndTime;

    private String targetAudience;

    private Integer managerCount;

    private Integer employeeCount;

    private Integer workerCount;

    private Integer temporaryWorkerCount;

    private Set<Long> userGroupIds;

    private String trainingType;

    private TrainerDto trainer;

    private Long internalTrainerId;

    private String comment;

    private OCFAddOrEditGroupDto ocf;

    private String externalTrainerName;

    private String externalTrainerEmail;

    private Float cost;

    // POur le conditionnement de l'affichage des autres liens
    private Boolean isTrainingComplete;
    private Boolean isOFPPTValidationEnabled;
}