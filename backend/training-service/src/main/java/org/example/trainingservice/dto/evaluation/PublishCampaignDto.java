package org.example.trainingservice.dto.evaluation;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PublishCampaignDto {
    private UUID id;

    private String status;
}