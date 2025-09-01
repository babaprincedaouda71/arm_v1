package org.example.authservice.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class UserRoleDto {
    private Long id;
    private String role;
    private String name;
    private Long managerId;
    private String managerName;
}