package org.example.authservice.client;

import org.example.authservice.dto.CompanyResponse;
import org.example.authservice.dto.CompanyTest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "COMPANY-SERVICE")
public interface CompanyClient {
    @GetMapping("/api/companies/company/{companyId}")
    CompanyResponse getCompanyById(@PathVariable("companyId") Long companyId);

    @GetMapping("/api/companies/company/get/{companyId}")
    CompanyTest getCompanyByIdSecure(@PathVariable("companyId") Long companyId);
}