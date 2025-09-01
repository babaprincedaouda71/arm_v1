package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AttendanceListPerDateDto {
    private UUID id;

    private Long userId;

    private String userFullName;

    private String userEmail;

    private String status;

}