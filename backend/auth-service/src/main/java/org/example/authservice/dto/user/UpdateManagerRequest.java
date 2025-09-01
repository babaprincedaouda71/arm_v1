package org.example.authservice.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateManagerRequest {
    private Long userId;
    private Long managerId;
}