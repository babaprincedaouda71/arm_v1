package org.example.trainingservice.client.company;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.need.DepartmentDto;
import org.example.trainingservice.dto.need.SiteDto;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class CompanyServiceClientFallback implements CompanyServiceClient {
    /*
     * Sites
     * */
    @Override
    public SiteDto getSiteById(Long id) {
        log.error("Error while calling getSiteById");
        return null;
    }

    @Override
    public List<SiteDto> getSitesByIds(List<Long> ids) {
        log.error("Error while calling getSitesByIds");
        return Collections.emptyList();
    }


    /*
     * Department
     * */
    @Override
    public DepartmentDto getDepartmentById(Long id) {
        log.error("Error while calling getDepartmentById");
        return null;
    }

    @Override
    public List<DepartmentDto> getDepartmentsByIds(List<Long> ids) {
        log.error("Error while calling getDepartmentsByIds");
        return List.of();
    }

    @Override
    public String getCompanyName(Long id) {
        log.error("Error while calling getCompanyName");
        return null;
    }

}