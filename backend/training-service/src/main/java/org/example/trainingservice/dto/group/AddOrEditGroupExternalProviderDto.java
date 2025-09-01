package org.example.trainingservice.dto.group;

import lombok.Data;
import org.example.trainingservice.dto.ocf.OCFAddOrEditGroupDto;

@Data
public class AddOrEditGroupExternalProviderDto {
    private OCFAddOrEditGroupDto ocf;

    private String externalTrainerName;

    private String externalTrainerEmail;

    private Float cost;
}