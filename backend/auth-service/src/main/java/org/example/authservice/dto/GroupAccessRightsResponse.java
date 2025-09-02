package org.example.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupAccessRightsResponse {
    private Long groupeId;
    private String groupeName;
    private String module;
    private List<AccessRightDto> accessRights;
}