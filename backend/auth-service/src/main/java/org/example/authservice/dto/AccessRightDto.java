package org.example.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessRightDto {
    private Long id;
    private String action;
    private Boolean allowed;
    private String actionLabel; // Label lisible pour l'affichage
}