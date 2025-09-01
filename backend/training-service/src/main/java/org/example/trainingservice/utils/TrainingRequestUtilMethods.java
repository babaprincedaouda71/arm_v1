package org.example.trainingservice.utils;

import org.example.trainingservice.dto.trainingRequest.AddMyTrainingRequestDto;
import org.example.trainingservice.dto.trainingRequest.TeamRequestsDto;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.entity.TrainingRequest;
import org.example.trainingservice.enums.NeedSource;
import org.example.trainingservice.enums.NeedStatusEnums;
import org.example.trainingservice.enums.TrainingRequestStatus;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class TrainingRequestUtilMethods {
    public static TrainingRequest mapToTrainingRequest(AddMyTrainingRequestDto newRequest, Long currentCompanyId) {
        return TrainingRequest.builder()
                .companyId(currentCompanyId)
                .year(newRequest.getYear())
                .domainId(newRequest.getDomain() != null ? newRequest.getDomain().getId() : null )
                .domainName(newRequest.getDomain() != null ? newRequest.getDomain().getName() : null)
                .siteId(newRequest.getSite() != null ? newRequest.getSite().getId() : null)
                .siteName(newRequest.getSite() != null ? newRequest.getSite().getLabel() : null)
                .departmentId(newRequest.getDepartment() != null ? newRequest.getDepartment().getId() : null)
                .departmentName(newRequest.getDepartment() != null ? newRequest.getDepartment().getName() : null)
                .theme(newRequest.getTheme())
                .wishDate(newRequest.getWishDate())
                .creationDate(LocalDate.now())
                .requesterId(newRequest.getRequester().getRequesterId())
                .requesterName(newRequest.getRequester().getRequesterFullName())
                .managerId(newRequest.getRequester().getManagerId())
                .managerId(newRequest.getRequester().getManagerId())
                .objective(newRequest.getObjective())
                .learningMode(newRequest.getLearningMode())
                .status(TrainingRequestStatus.Waiting)
                .build();
    }

    public static List<TeamRequestsDto> mapToTeamRequestsDto(List<TrainingRequest> trainingRequests) {
        List<TeamRequestsDto> teamRequestsDtos = new ArrayList<>();
        for (TrainingRequest trainingRequest : trainingRequests) {
            TeamRequestsDto dto = TeamRequestsDto.builder()
                    .id(trainingRequest.getId())
                    .year(trainingRequest.getYear())
                    .domain(trainingRequest.getDomainName())
                    .theme(trainingRequest.getTheme())
                    .site(trainingRequest.getSiteName())
                    .department(trainingRequest.getDepartmentName())
                    .creationDate(trainingRequest.getCreationDate())
                    .requester(trainingRequest.getRequesterName())
                    .approver(trainingRequest.getApprover())
                    .status(trainingRequest.getStatus().toString())
                    .build();
            teamRequestsDtos.add(dto);
        }
        return teamRequestsDtos;
    }

    public static Need convertTrainingRequestToNeed(TrainingRequest request, Long approverId) {
        return Need.builder()
                .companyId(request.getCompanyId())
                .theme(request.getTheme())
                .objective(request.getObjective())
                .content(request.getContent())
                .year(request.getYear())
                .wishDate(request.getWishDate() != null ? request.getWishDate().toString() : null)
                .requesterId(request.getRequesterId())
                .requesterName(request.getRequesterName())
                .approverId(approverId)
                .learningMode(request.getLearningMode())
                .domainId(request.getDomainId())
                .domainName(request.getDomainName())
                .siteIds(List.of(request.getSiteId()))
                .siteNames(List.of(request.getSiteName()))
                .departmentIds(List.of(request.getDepartmentId()))
                .departmentNames(List.of(request.getDepartmentName()))
                .status(NeedStatusEnums.DRAFT)  // statut par défaut pour les besoins issus de demandes
                .source(NeedSource.Individual_Requests)  // source indiquant qu'il s'agit d'une demande individuelle
                .creationDate(LocalDate.now().toString())
                // valeurs par défaut pour les champs obligatoires
                .numberOfDay(1)  // à ajuster selon vos besoins
                .numberOfGroup(1)  // à ajuster selon vos besoins
                .build();
    }
}