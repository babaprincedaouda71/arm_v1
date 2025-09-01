package org.example.companyservice.web;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.companyservice.dto.CompanyDetailsRequest;
import org.example.companyservice.dto.CompanyResponse;
import org.example.companyservice.dto.InitialRegistrationRequest;
import org.example.companyservice.service.CompanyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return companyService.getAll();
    }

    @GetMapping("/get/all/waiting")
    public ResponseEntity<?> getAllWaiting() {
        return companyService.getAllWaiting();
    }

    @PostMapping("/register")
    public ResponseEntity<CompanyResponse> registerCompany(@Valid @RequestBody InitialRegistrationRequest request) {
        System.out.println("Registering new company");
        CompanyResponse companyResponse = companyService.registerCompany(request);
        return new ResponseEntity<>(companyResponse, HttpStatus.CREATED);
    }

    @PutMapping("/company/complete")
    public ResponseEntity<CompanyResponse> updateCompanyDetails(
            @Valid @RequestBody CompanyDetailsRequest request) {

        CompanyResponse companyResponse = companyService.updateCompanyDetails(request);
        return ResponseEntity.ok(companyResponse);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<CompanyResponse> getCompany(
            @PathVariable Long companyId) {

        CompanyResponse companyById = companyService.getCompanyById(companyId);
        return ResponseEntity.ok(companyById);
    }

    /***************************************/
    @GetMapping("/company/get/{companyId}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable Long companyId) {
        CompanyResponse companyById = companyService.getCompanyByIdSecure(companyId);
        return ResponseEntity.ok(companyById);
    }

    @GetMapping("/company/current")
    public ResponseEntity<?> getCurrentCompany() {
        log.error("Getting current company");
        companyService.getCurrentCompany();
        return companyService.getCurrentCompany();
    }

    @GetMapping("/getName/{id}")
    public ResponseEntity<?> getName(@PathVariable Long id) {
        return companyService.getName(id);
    }
}