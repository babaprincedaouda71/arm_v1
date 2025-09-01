package org.example.trainingservice.dto.plan;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTrainingHistoryDto {
    private Integer year;
    private String theme;
    private String dates;
}