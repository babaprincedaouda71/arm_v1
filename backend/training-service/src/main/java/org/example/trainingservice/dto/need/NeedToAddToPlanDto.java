package org.example.trainingservice.dto.need;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class NeedToAddToPlanDto {
    private Long id;

    private String theme;

    private String source;
}