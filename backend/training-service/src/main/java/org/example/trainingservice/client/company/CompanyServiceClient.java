package org.example.trainingservice.client.company;

import org.example.trainingservice.dto.need.DepartmentDto;
import org.example.trainingservice.dto.need.SiteDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "COMPANY-SERVICE", fallback = CompanyServiceClientFallback.class)
public interface CompanyServiceClient {
    /*
     * Sites
     * */
    @GetMapping("/api/site/get/{id}")
    SiteDto getSiteById(@PathVariable Long id);

    @GetMapping("/api/site/getByIds")
    List<SiteDto> getSitesByIds(@RequestParam List<Long> ids);

    /*
     * Department
     * */
    @GetMapping("/api/department/get/{id}")
    DepartmentDto getDepartmentById(@PathVariable Long id);

    @GetMapping("/api/department/getByIds")
    List<DepartmentDto> getDepartmentsByIds(@RequestParam List<Long> ids);

    @GetMapping("/api/companies/getName/{id}")
    String getCompanyName(@PathVariable Long id);
}