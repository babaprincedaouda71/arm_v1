package org.example.trainingservice.dto.group;

import lombok.Data;
import org.example.trainingservice.enums.TrainingType;

@Data
public class AddOrEditGroupInternalProviderDto {
    private TrainerDto trainer;

    private String comment;

    private String trainerConfirmationStatus;
}