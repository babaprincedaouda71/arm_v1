package org.example.trainingservice.dto.plan.attendance;

import lombok.Data;

@Data
public class GetAttendancePerDateDto {
    private Long groupId;
    private String date;
}