package org.example.trainingservice.dto.trainingRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.dto.need.DepartmentDto;
import org.example.trainingservice.dto.need.DomainDto;
import org.example.trainingservice.dto.need.SiteDto;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddMyTrainingRequestDto {
    private Integer year;

    private DomainDto domain;

    private String theme;

    private SiteDto site;

    private DepartmentDto department;

    private LocalDate wishDate;

    private Requester requester;

    private String objective;

    private String content;

    private String learningMode;
}