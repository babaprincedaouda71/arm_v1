package org.example.authservice.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChangeRoleRequest {
    private Long id;
    private String role;
}