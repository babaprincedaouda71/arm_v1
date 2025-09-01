package org.example.authservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyTest {
    private Long id;
    private String name;
    private String mainContactFirstName;
    private String mainContactLastName;
}