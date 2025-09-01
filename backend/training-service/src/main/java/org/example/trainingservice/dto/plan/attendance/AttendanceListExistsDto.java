package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AttendanceListExistsDto {
    private boolean exists;
    private String existingListId;
    private LocalDate existingDate;
    private String message;
}