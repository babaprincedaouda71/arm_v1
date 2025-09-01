package org.example.trainingservice.dto.group;

import lombok.Data;
import org.example.trainingservice.enums.GroupeStatusEnums;

@Data
public class GroupDto {
    private Long id;

    private String name;

    private String startDate;

    private String dates;

    private Integer participantCount;

    private Integer dayCount;

    private Float price;

    private String trainerName;

    private String trainingProvider;

    private String status;
}