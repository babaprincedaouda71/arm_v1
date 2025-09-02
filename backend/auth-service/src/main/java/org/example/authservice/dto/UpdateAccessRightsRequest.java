package org.example.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// DTO pour recevoir les mises à jour de droits d'accès
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccessRightsRequest {
    private Long groupeId;
    private String module;
    private List<AccessRightUpdateDto> accessRights;
}