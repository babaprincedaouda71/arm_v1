package org.example.trainingservice.dto.plan;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Builder
@Data
public class GetGroupeInvoicesDto {
    private UUID id;
    private String type;
    private String description;
    private LocalDate creationDate;
    private BigDecimal amount;
    private String status;
    private LocalDate paymentDate;
    private String paymentMethod;
}