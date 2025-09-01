package org.example.trainingservice.dto.trainingRequest;

import lombok.Data;

@Data
public class Requester {
    private Long requesterId;
    private String requesterFullName;
    private Long managerId;
}