package org.example.trainingservice.utils;

import org.example.trainingservice.cacheService.UserCacheService;
import org.example.trainingservice.dto.group.GroupDto;
import org.example.trainingservice.dto.need.*;
import org.example.trainingservice.dto.trainingRequest.IndividualRequestNeedViewDto;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.enums.NeedSource;
import org.example.trainingservice.enums.NeedStatusEnums;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class NeedUtilMethods {

    public static Need convertToAddStrategicNeedDtoToEntity(AddStrategicAxeNeedDto addStrategicAxeNeedDto, Long companyId) {
        return Need.builder()
                .strategicAxeId(addStrategicAxeNeedDto.getAxe().getId())
                .strategicAxeName(addStrategicAxeNeedDto.getAxe().getTitle()) // Assurez-vous que StrategicAxeDto a un champ 'title'
                .siteIds(addStrategicAxeNeedDto.getSite().stream().map(SiteDto::getId).collect(Collectors.toList()))
                .siteNames(addStrategicAxeNeedDto.getSite().stream().map(SiteDto::getLabel).collect(Collectors.toList()))
                .departmentIds(addStrategicAxeNeedDto.getDepartment().stream().map(DepartmentDto::getId).collect(Collectors.toList()))
                .departmentNames(addStrategicAxeNeedDto.getDepartment().stream().map(DepartmentDto::getName).collect(Collectors.toList()))
                .domainId(addStrategicAxeNeedDto.getDomain() != null ? addStrategicAxeNeedDto.getDomain().getId() : null)
                .domainName(addStrategicAxeNeedDto.getDomain() != null ? addStrategicAxeNeedDto.getDomain().getName() : null)
                .qualificationId(addStrategicAxeNeedDto.getQualification() != null ? addStrategicAxeNeedDto.getQualification().getId() : null)
                .qualificationName(addStrategicAxeNeedDto.getQualification() != null ? addStrategicAxeNeedDto.getQualification().getType() : null)
                .theme(addStrategicAxeNeedDto.getTheme())
                .numberOfDay(addStrategicAxeNeedDto.getNbrDay())
                .type(addStrategicAxeNeedDto.getType())
                .numberOfGroup(addStrategicAxeNeedDto.getNbrGroup())
                .objective(addStrategicAxeNeedDto.getObjective())
                .content(addStrategicAxeNeedDto.getContent())
                .csf(addStrategicAxeNeedDto.getCsf()) // Assurez-vous que le type correspond (String dans l'entité)
                .csfPlanifie(addStrategicAxeNeedDto.getCsfPlanifie())
                .companyId(companyId)
                .creationDate(LocalDate.now().toString())
                .source(NeedSource.Strategic_Axes)
                .status(NeedStatusEnums.DRAFT)
                .build();
    }

    public static StrategicAxeNeedViewDto convertToStrategicAxeNeedViewDto(Need need) {
        // Convertis la liste des entités Groupe en liste de GroupDto
        List<GroupDto> groupDtos = new ArrayList<>();
        if (need.getGroupes() != null && !need.getGroupes().isEmpty()) {
            groupDtos = need.getGroupes().stream()
                    .map(GroupUtilMethods::convertToGroupDto)
                    .toList();
        }
        return StrategicAxeNeedViewDto.builder()
                .id(need.getId())
                .domain(need.getDomainName())
                .theme(need.getTheme())
                .axe(need.getStrategicAxeName())
                .source(need.getSource())
                .nbrGroup(need.getNumberOfGroup())
                .groups(groupDtos)
                .site(need.getSiteNames() != null ? String.join(",\n", need.getSiteNames()) : null)
                .department(need.getDepartmentNames() != null && !need.getDepartmentNames().isEmpty() ? String.join(",\n", need.getDepartmentNames()) : null)
                .creationDate(need.getCreationDate())
                .status(need.getStatus() != null ? need.getStatus().getDescription() : null)
                .build();
    }

    public static GetNeedToEditDto convertToGetNeedToEditDto(Need need) {
        GetNeedToEditDto dto = new GetNeedToEditDto();
        dto.setId(need.getId());

        if (need.getSource().equals(NeedSource.Strategic_Axes) && need.getStrategicAxeId() != null) {
            StrategicAxeDto strategicAxeDto = new StrategicAxeDto();
            strategicAxeDto.setId(need.getStrategicAxeId());
            strategicAxeDto.setTitle(need.getStrategicAxeName());
            dto.setAxe(strategicAxeDto);
        }

        if (need.getSiteIds() != null && !need.getSiteIds().isEmpty() && need.getSiteNames() != null && !need.getSiteNames().isEmpty() && need.getSiteIds().size() == need.getSiteNames().size()) {
            List<SiteDto> siteDtos = need.getSiteIds().stream()
                    .map(id -> {
                        int index = need.getSiteIds().indexOf(id);
                        SiteDto siteDto = new SiteDto();
                        siteDto.setId(id);
                        siteDto.setLabel(need.getSiteNames().get(index));
                        return siteDto;
                    })
                    .collect(Collectors.toList());
            dto.setSite(siteDtos);
        }

        if (need.getDepartmentIds() != null && !need.getDepartmentIds().isEmpty() && need.getDepartmentNames() != null && !need.getDepartmentNames().isEmpty() && need.getDepartmentIds().size() == need.getDepartmentNames().size()) {
            List<DepartmentDto> departmentDtos = need.getDepartmentIds().stream()
                    .map(id -> {
                        int index = need.getDepartmentIds().indexOf(id);
                        DepartmentDto departmentDto = new DepartmentDto();
                        departmentDto.setId(id);
                        departmentDto.setName(need.getDepartmentNames().get(index));
                        return departmentDto;
                    })
                    .collect(Collectors.toList());
            dto.setDepartment(departmentDtos);
        }

        if (need.getDomainId() != null) {
            DomainDto domainDto = new DomainDto();
            domainDto.setId(need.getDomainId());
            domainDto.setName(need.getDomainName());
            dto.setDomain(domainDto);
        }

        if (need.getQualificationId() != null) {
            QualificationDto qualificationDto = new QualificationDto();
            qualificationDto.setId(need.getQualificationId());
            qualificationDto.setType(need.getQualificationName());
            dto.setQualification(qualificationDto);
        }

        dto.setTheme(need.getTheme());
        dto.setNbrDay(need.getNumberOfDay());
        dto.setType(need.getType());
        dto.setNbrGroup(need.getNumberOfGroup());
        dto.setObjective(need.getObjective());
        dto.setContent(need.getContent());
        dto.setCsf(need.getCsf());
        dto.setSource(need.getSource());
        dto.setCsfPlanifie(need.getCsfPlanifie());

        return dto;
    }

    public static NeedForAddGroupDto convertToNeedForAddGroupDto(Need need) {
        NeedForAddGroupDto dto = new NeedForAddGroupDto();
        dto.setId(need.getId());

        if (need.getSiteIds() != null && !need.getSiteIds().isEmpty() && need.getSiteNames() != null && !need.getSiteNames().isEmpty() && need.getSiteIds().size() == need.getSiteNames().size()) {
            List<SiteDto> siteDtos = need.getSiteIds().stream()
                    .map(id -> {
                        int index = need.getSiteIds().indexOf(id);
                        SiteDto siteDto = new SiteDto();
                        siteDto.setId(id);
                        siteDto.setLabel(need.getSiteNames().get(index));
                        return siteDto;
                    })
                    .collect(Collectors.toList());
            dto.setSite(siteDtos);
        }

        if (need.getDepartmentIds() != null && !need.getDepartmentIds().isEmpty() && need.getDepartmentNames() != null && !need.getDepartmentNames().isEmpty() && need.getDepartmentIds().size() == need.getDepartmentNames().size()) {
            List<DepartmentDto> departmentDtos = need.getDepartmentIds().stream()
                    .map(id -> {
                        int index = need.getDepartmentIds().indexOf(id);
                        DepartmentDto departmentDto = new DepartmentDto();
                        departmentDto.setId(id);
                        departmentDto.setName(need.getDepartmentNames().get(index));
                        return departmentDto;
                    })
                    .collect(Collectors.toList());
            dto.setDepartment(departmentDtos);
        }

        return dto;
    }

    public static StrategicAxeNeedDetailsDto convertToStrategicAxeNeedDetailsDto(Need need) {
        StrategicAxeNeedDetailsDto dto = new StrategicAxeNeedDetailsDto();
        dto.setId(need.getId());
        if (need.getDomainId() != null) {
            dto.setDomain(need.getDomainName());
        }
        dto.setTheme(need.getTheme());
        if (need.getObjective() != null) {
            dto.setObjective(need.getObjective());
        }
        if (need.getContent() != null) {
            dto.setContent(need.getContent());
        }
        if (need.getCsf() != null) {
            dto.setCsf(need.getCsf());
            dto.setCsfPlanifie(need.getCsfPlanifie());
        }

        // Convertis la liste des entités Groupe en liste de GroupDto
        if (need.getGroupes() != null && !need.getGroupes().isEmpty()) {
            List<GroupDto> groupDtos = need.getGroupes().stream()
                    .map(GroupUtilMethods::convertToGroupDto)
                    .collect(Collectors.toList());
            dto.setGroups(groupDtos);
        }

        return dto;
    }

    public static void updateNeedFromEditNeedDto(Need needToUpdate, EditNeedDto updateDto) {
        if (updateDto.getAxe() != null) {
            needToUpdate.setStrategicAxeId(updateDto.getAxe().getId());
            needToUpdate.setStrategicAxeName(updateDto.getAxe().getTitle());
        }
        if (updateDto.getSite() != null) {
            needToUpdate.setSiteIds(updateDto.getSite().stream().map(SiteDto::getId).collect(Collectors.toList()));
            needToUpdate.setSiteNames(updateDto.getSite().stream().map(SiteDto::getLabel).collect(Collectors.toList()));
        }
        if (updateDto.getDepartment() != null) {
            needToUpdate.setDepartmentIds(updateDto.getDepartment().stream().map(DepartmentDto::getId).collect(Collectors.toList()));
            needToUpdate.setDepartmentNames(updateDto.getDepartment().stream().map(DepartmentDto::getName).collect(Collectors.toList()));
        }
        if (updateDto.getDomain() != null) {
            needToUpdate.setDomainId(updateDto.getDomain().getId());
            needToUpdate.setDomainName(updateDto.getDomain().getName());
        }
        if (updateDto.getQualification() != null) {
            needToUpdate.setQualificationId(updateDto.getQualification().getId());
            needToUpdate.setQualificationName(updateDto.getQualification().getType());
        }
        if (updateDto.getTheme() != null) {
            needToUpdate.setTheme(updateDto.getTheme());
        }
        needToUpdate.setNumberOfDay(updateDto.getNbrDay());
        if (updateDto.getType() != null) {
            needToUpdate.setType(updateDto.getType());
        }
        needToUpdate.setNumberOfGroup(updateDto.getNbrGroup());
        if (updateDto.getObjective() != null) {
            needToUpdate.setObjective(updateDto.getObjective());
        }
        if (updateDto.getContent() != null) {
            needToUpdate.setContent(updateDto.getContent());
        }
        if (updateDto.getCsf() != null) {
            needToUpdate.setCsf(updateDto.getCsf());
        }
        if (updateDto.getCsfPlanifie() != null) {
            needToUpdate.setCsfPlanifie(updateDto.getCsfPlanifie());
        }
    }

    public static IndividualRequestNeedViewDto convertToIndividualRequestNeedViewDto(Need need, UserCacheService userCacheService) {
        String approverName = userCacheService.getApproverName(need.getApproverId());
        return IndividualRequestNeedViewDto.builder()
                .id(need.getId())
                .year(need.getYear())
                .domain(need.getDomainName())
                .theme(need.getTheme())
                .site(need.getSiteNames() != null ? String.join(",\n", need.getSiteNames()) : null)
                .department(need.getDepartmentNames() != null && !need.getDepartmentNames().isEmpty() ? String.join(",\n", need.getDepartmentNames()) : null)
                .creationDate(need.getCreationDate())
                .requester(need.getRequesterName())
                .approver(approverName)
                .status(need.getStatus() != null ? need.getStatus().getDescription() : null)
                .build();
    }

    public static GetEvaluationNeedDto convertToEvaluationNeedDto(Need need, UserCacheService userCacheService) {
        String approverName = userCacheService.getApproverName(need.getApproverId());
        return GetEvaluationNeedDto.builder()
                .id(need.getId())
                .domain(need.getDomainName())
                .questionnaire(need.getQuestionnaire())
                .theme(need.getTheme())
                .manager(approverName)
                .creationDate(need.getCreationDate())
                .status(need.getStatus() != null ? need.getStatus().getDescription() : null)
                .build();
    }

    public static NeedToAddToPlanDto convertToNeedToAddToPlanDto(Need need) {
        return NeedToAddToPlanDto.builder()
                .id(need.getId())
                .theme(need.getTheme())
                .source(need.getSource().toString())
                .build();
    }
}