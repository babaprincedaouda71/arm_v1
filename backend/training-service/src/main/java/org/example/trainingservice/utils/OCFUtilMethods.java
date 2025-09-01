package org.example.trainingservice.utils;

import org.example.trainingservice.dto.ocf.OCFAddOrEditGroupDto;
import org.example.trainingservice.dto.ocf.OCFCreateDto;
import org.example.trainingservice.dto.ocf.OCFDashboardDataDto;
import org.example.trainingservice.dto.ocf.OCFResponseDto;
import org.example.trainingservice.entity.OCF;
import org.example.trainingservice.enums.OCFStatusEnum;
import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.stream.Collectors;

public class OCFUtilMethods {
    public static List<OCFAddOrEditGroupDto> mapToOCFAddOrEditGroupDto(List<OCF> ocfs) {
        return ocfs.stream().map(ocf -> {
            OCFAddOrEditGroupDto dto = new OCFAddOrEditGroupDto();
            dto.setId(ocf.getId());
            dto.setCorporateName(ocf.getCorporateName());
            dto.setEmailMainContact(ocf.getEmailMainContact());
            return dto;
        }).collect(Collectors.toList());
    }

    public static List<OCFDashboardDataDto> mapToOCFDashboardDataDto(List<OCF> ocfs) {
        return ocfs.stream().map(ocf -> {
            OCFDashboardDataDto dto = new OCFDashboardDataDto();
            dto.setId(ocf.getId());
            dto.setCompanyId(ocf.getCompanyId());
            dto.setCorporateName(ocf.getCorporateName());
            dto.setIce(ocf.getIce());
            dto.setPhone(ocf.getPhone());
            dto.setEmail(ocf.getEmail());
            dto.setAddress(ocf.getAddress());
            dto.setWebsite(ocf.getWebsite());
            dto.setNameMainContact(ocf.getNameMainContact());
            dto.setPositionMainContact(ocf.getPositionMainContact());
            dto.setEmailMainContact(ocf.getEmailMainContact());
            dto.setPhoneMainContact(ocf.getPhoneMainContact());
            dto.setNameLegalRepresentant(ocf.getNameLegalRepresentant());
            dto.setPositionLegalRepresentant(ocf.getPositionLegalRepresentant());
            dto.setEmailLegalRepresentant(ocf.getEmailLegalRepresentant());
            dto.setPhoneLegalRepresentant(ocf.getPhoneLegalRepresentant());
            dto.setStatus(ocf.getStatus().getDescription());
            return dto;
        }).collect(Collectors.toList());
    }

    public static OCF mapToOCF(@NotNull OCFCreateDto ocfCreateDto, Long companyId) {
        return OCF.builder()
                .companyId(companyId)
                .corporateName(ocfCreateDto.getCorporateName())
                .address(ocfCreateDto.getAddress())
                .phone(ocfCreateDto.getPhone())
                .email(ocfCreateDto.getEmail())
                .website(ocfCreateDto.getWebsite())
                .staff(ocfCreateDto.getStaff())
                .creationDate(ocfCreateDto.getCreationDate())
                .legalForm(ocfCreateDto.getLegalForm())
                .ice(ocfCreateDto.getIce())
                .rc(ocfCreateDto.getRc())
                .patent(ocfCreateDto.getPatent())
                .ifValue(ocfCreateDto.getIfValue())
                .cnss(ocfCreateDto.getCnss())
                .permanentStaff(ocfCreateDto.getPermanentStaff())
                .nameLegalRepresentant(ocfCreateDto.getNameLegalRepresentant())
                .positionLegalRepresentant(ocfCreateDto.getPositionLegalRepresentant())
                .phoneLegalRepresentant(ocfCreateDto.getPhoneLegalRepresentant())
                .emailLegalRepresentant(ocfCreateDto.getEmailLegalRepresentant())
                .nameMainContact(ocfCreateDto.getNameMainContact())
                .positionMainContact(ocfCreateDto.getPositionMainContact())
                .phoneMainContact(ocfCreateDto.getPhoneMainContact())
                .emailMainContact(ocfCreateDto.getEmailMainContact())
                .status(OCFStatusEnum.ACTIVE)
                .build();
    }

    public static OCFResponseDto mapToOCFDetailsDto(OCF ocf) {
        return OCFResponseDto.builder()
                .id(ocf.getId())
                .companyId(ocf.getCompanyId())
                .corporateName(ocf.getCorporateName())
                .address(ocf.getAddress())
                .phone(ocf.getPhone())
                .email(ocf.getEmail())
                .website(ocf.getWebsite())
                .staff(ocf.getStaff())
                .creationDate(ocf.getCreationDate())
                .legalForm(ocf.getLegalForm())
                .ice(ocf.getIce())
                .rc(ocf.getRc())
                .patent(ocf.getPatent())
                .ifValue(ocf.getIfValue())
                .cnss(ocf.getCnss())
                .permanentStaff(ocf.getPermanentStaff())
                .nameLegalRepresentant(ocf.getNameLegalRepresentant())
                .positionLegalRepresentant(ocf.getPositionLegalRepresentant())
                .phoneLegalRepresentant(ocf.getPhoneLegalRepresentant())
                .emailLegalRepresentant(ocf.getEmailLegalRepresentant())
                .nameMainContact(ocf.getNameMainContact())
                .positionMainContact(ocf.getPositionMainContact())
                .phoneMainContact(ocf.getPhoneMainContact())
                .emailMainContact(ocf.getEmailMainContact())
                .build();
    }
}