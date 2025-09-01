package org.example.companyservice.utils;

import org.example.companyservice.dto.CurrentCompanyDto;
import org.example.companyservice.entity.Company;

public class CompanyUtilMethods {
    public static CurrentCompanyDto mapToCurrentCompanyDto(Company company) {
        return CurrentCompanyDto.builder()
                .id(company.getId())
                .corporateName(company.getName())
                .build();
    }
}