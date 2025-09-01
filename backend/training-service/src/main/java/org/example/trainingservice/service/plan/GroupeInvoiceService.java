package org.example.trainingservice.service.plan;

import org.example.trainingservice.dto.plan.AddGroupeInvoiceDto;
import org.example.trainingservice.web.plan.UpdateGroupeInvoiceStatusDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface GroupeInvoiceService {
    ResponseEntity<?> getAll(Long groupId);

    ResponseEntity<?> getGroupeInvoice(UUID groupeInvoiceId);

    ResponseEntity<?> addGroupeInvoice(Long groupId, AddGroupeInvoiceDto invoice, MultipartFile invoiceFile, MultipartFile bankRemiseFile, MultipartFile receiptFile);

    ResponseEntity<?> deleteGroupeInvoice(UUID groupeInvoiceId);

    ResponseEntity<?> updateStatus(UpdateGroupeInvoiceStatusDto updateGroupeInvoiceStatusDto);

    ResponseEntity<?> getGroupeInvoiceDetails(UUID invoiceId);

    ResponseEntity<?> getPdf(UUID invoiceId, String fileType);

    ResponseEntity<?> editGroupeInvoice(UUID invoiceId, AddGroupeInvoiceDto invoice, MultipartFile invoiceFile, MultipartFile bankRemiseFile, MultipartFile receiptFile);
}