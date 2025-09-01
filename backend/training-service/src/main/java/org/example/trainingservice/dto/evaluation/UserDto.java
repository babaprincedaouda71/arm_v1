package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private Long id;
    private String role;
    private String name;
    private Long managerId;
    private String manager;
}