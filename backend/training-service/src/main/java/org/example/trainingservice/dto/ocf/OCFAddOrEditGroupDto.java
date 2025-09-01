package org.example.trainingservice.dto.ocf;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OCFAddOrEditGroupDto {
    private Long id;

    private String corporateName;

    private String emailMainContact;
}