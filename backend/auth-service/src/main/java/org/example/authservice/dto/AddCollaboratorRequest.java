package org.example.authservice.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AddCollaboratorRequest {
    private Long companyId;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String position;
}