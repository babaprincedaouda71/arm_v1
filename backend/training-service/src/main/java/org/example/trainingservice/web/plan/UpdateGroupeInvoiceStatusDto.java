package org.example.trainingservice.web.plan;

import lombok.Getter;

import java.util.UUID;

@Getter
public class UpdateGroupeInvoiceStatusDto {
    private UUID id;
    private String status;
}