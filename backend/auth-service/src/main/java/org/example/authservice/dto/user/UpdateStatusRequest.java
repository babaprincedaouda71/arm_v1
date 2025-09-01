package org.example.authservice.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateStatusRequest {
    private Long id;
    private String status;
}