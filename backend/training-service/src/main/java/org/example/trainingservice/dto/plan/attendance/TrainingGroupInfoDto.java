package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TrainingGroupInfoDto {
    private Long groupId;
    private String groupName;
    private String trainingTheme;
    private String location;
    private String city;
    private List<String> formationDates;
    private String trainerName;
    private String trainingType; // "INTERNAL" ou "EXTERNAL"
}