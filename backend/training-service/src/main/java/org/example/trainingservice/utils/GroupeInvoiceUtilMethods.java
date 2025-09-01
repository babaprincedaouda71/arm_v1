package org.example.trainingservice.utils;

import org.example.trainingservice.dto.plan.GetGroupeInvoiceDetailsDto;
import org.example.trainingservice.dto.plan.GetGroupeInvoicesDto;
import org.example.trainingservice.entity.plan.GroupeInvoice;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class GroupeInvoiceUtilMethods {
    /**
     * Convertit une liste de GroupeInvoice en liste de GetGroupeInvoicesDto
     *
     * @param invoices Liste des entités GroupeInvoice
     * @return Liste des DTOs GetGroupeInvoicesDto
     */
    public static List<GetGroupeInvoicesDto> mapToGetGroupeInvoicesDto(List<GroupeInvoice> invoices) {
        if (invoices == null || invoices.isEmpty()) {
            return Collections.emptyList();
        }

        return invoices.stream()
                .map(GroupeInvoiceUtilMethods::mapSingleInvoiceToDto)
                .collect(Collectors.toList());
    }


    /**
     * Convertit une seule entité GroupeInvoice en GetGroupeInvoicesDto
     *
     * @param invoice Entité GroupeInvoice à convertir
     * @return DTO GetGroupeInvoicesDto
     */
    public static GetGroupeInvoicesDto mapSingleInvoiceToDto(GroupeInvoice invoice) {
        if (invoice == null) {
            return null;
        }

        return GetGroupeInvoicesDto.builder()
                .id(invoice.getId())
                .type(invoice.getType())
                .creationDate(invoice.getCreationDate())
                .description(invoice.getDescription())
                .amount(invoice.getAmount())
                .status(invoice.getStatus().getDescription())
                .paymentDate(invoice.getPaymentDate())
                .paymentMethod(invoice.getPaymentMethod())
                .build();
    }

    public static GetGroupeInvoiceDetailsDto mapToGetGroupeInvoiceDetailsDto(GroupeInvoice groupeInvoice) {
        return GetGroupeInvoiceDetailsDto.builder()
                .id(groupeInvoice.getId())
                .type(groupeInvoice.getType())
                .description(groupeInvoice.getDescription())
                .amount(String.valueOf(groupeInvoice.getAmount()))
                .paymentDate(String.valueOf(groupeInvoice.getPaymentDate()))
                .paymentMethod(groupeInvoice.getPaymentMethod())
                .creationDate(String.valueOf(groupeInvoice.getCreationDate()))
                .status(groupeInvoice.getStatus().getDescription())
                .invoiceFile(groupeInvoice.getInvoiceFile())
                .bankRemiseFile(groupeInvoice.getBankRemiseFile())
                .receiptFile(groupeInvoice.getReceiptFile())
                .build();
    }
}