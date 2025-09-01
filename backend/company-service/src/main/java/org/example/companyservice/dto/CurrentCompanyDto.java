package org.example.companyservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CurrentCompanyDto {
    private Long id;
    private String corporateName;
}