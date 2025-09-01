package org.example.trainingservice.dto.plan;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class AddGroupeInvoiceDto {
    private String type;
    private BigDecimal amount;
    private String description;
    private String paymentMethod;
    private LocalDate paymentDate;
}