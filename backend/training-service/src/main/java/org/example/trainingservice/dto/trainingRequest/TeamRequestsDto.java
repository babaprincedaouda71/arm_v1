package org.example.trainingservice.dto.trainingRequest;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TeamRequestsDto {
    private Long id;

    private Integer year;

    private String domain;

    private String theme;

    private String site;

    private String department;

    private LocalDate creationDate;

    private String requester;

    private String approver;

    private String status;
}