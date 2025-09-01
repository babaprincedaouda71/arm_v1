package org.example.authservice.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ParticipantsForPresenceListDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String cnss;
    private String cin;
}