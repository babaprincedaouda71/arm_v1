package org.example.authservice.dto;

import lombok.Data;

@Data
public class GroupeDTO {
    private Long id;

    private Long companyId;

    private String name;

    private String description;
}