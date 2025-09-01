package org.example.trainingservice.dto.need;

import lombok.Data;

@Data
public class UpdateStatusRequestDto {
    private Long id;
    private String status;
}