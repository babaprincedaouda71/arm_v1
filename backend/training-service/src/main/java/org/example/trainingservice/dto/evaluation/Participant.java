package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Participant {
    private Long id;
    private String lastName;
    private String firstName;
    private String email;
    private String cin;
    private String cnss;
    private String groupe;
    private String department;
    private String site;
    private String manager;
}