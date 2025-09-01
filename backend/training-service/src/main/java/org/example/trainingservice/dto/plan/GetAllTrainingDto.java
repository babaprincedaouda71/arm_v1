package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GetAllTrainingDto {
    private UUID id;

    private String theme;

    private String creationDate;

    private String type;

    private String ocf;

    private Boolean csf;

    private BigDecimal budget;

    private String status;

    // Nouvelle propriété pour les dates des groupes
    private List<GroupDatesDto> groupDates;

    @Data
    @Builder
    public static class GroupDatesDto {
        private Long groupId;
        private String groupName;
        private List<String> dates;
    }
}