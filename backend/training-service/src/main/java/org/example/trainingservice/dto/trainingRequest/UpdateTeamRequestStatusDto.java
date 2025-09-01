package org.example.trainingservice.dto.trainingRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTeamRequestStatusDto {
    private Long id;

    private String status;

    private String approvalComment;

    private String rejectionReason;
}