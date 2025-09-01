package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Builder
@Getter
public class GetGroupeInvoiceDetailsDto {
    private UUID id;
    private String type;
    private String description;
    private String amount;
    private String paymentDate;
    private String paymentMethod;
    private String creationDate;
    private String status;
    private String invoiceFile;
    private String bankRemiseFile;
    private String receiptFile;
}