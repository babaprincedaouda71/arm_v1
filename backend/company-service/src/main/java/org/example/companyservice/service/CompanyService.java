package org.example.companyservice.service;

import org.example.companyservice.dto.CompanyDetailsRequest;
import org.example.companyservice.dto.CompanyResponse;
import org.example.companyservice.dto.InitialRegistrationRequest;
import org.springframework.http.ResponseEntity;

public interface CompanyService {
    CompanyResponse registerCompany(InitialRegistrationRequest request);

    CompanyResponse updateCompanyDetails(CompanyDetailsRequest request);

    CompanyResponse getCompanyById(Long companyId);

    CompanyResponse getCompanyByIdSecure(Long companyId);

    ResponseEntity<?> getAll();

    ResponseEntity<?> getAllWaiting();

    ResponseEntity<?> getCurrentCompany();

    ResponseEntity<?> getName(Long id);
}