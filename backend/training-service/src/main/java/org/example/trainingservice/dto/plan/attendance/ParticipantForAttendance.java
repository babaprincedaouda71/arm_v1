package org.example.trainingservice.dto.plan.attendance;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParticipantForAttendance {
    private Long userId;
    private String fullName;
    private String firstName;
    private String lastName;
    private String code;
    private String email;
    private String position;
    private String level;
    private String manager;
    private String cin;
    private String cnss;
}