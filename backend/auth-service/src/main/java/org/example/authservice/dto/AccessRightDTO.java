package org.example.authservice.dto;

import lombok.Data;

@Data
public class AccessRightDTO {
    private Long id;
    private String page;
    private String action;
    private boolean allowed;
}