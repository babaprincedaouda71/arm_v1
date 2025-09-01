package org.example.authservice.dto.groups;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupeResponse {
    private Long id;
    private String name;
    private String description;
    private Long numberOfUsers;
}