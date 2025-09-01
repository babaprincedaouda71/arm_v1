package org.example.trainingservice.dto.trainingRequest;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IndividualRequestNeedViewDto {
    private Long id;

    private Integer year;

    private String domain;

    private String theme;

    private String site;

    private String department;

    private String creationDate;

    private String requester;

    private String approver;

    private String status;
}