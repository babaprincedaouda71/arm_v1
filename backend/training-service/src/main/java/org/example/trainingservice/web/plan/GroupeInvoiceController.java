package org.example.trainingservice.web.plan;

import org.example.trainingservice.dto.plan.AddGroupeInvoiceDto;
import org.example.trainingservice.dto.plan.UpdatePlanStatusRequestDto;
import org.example.trainingservice.service.plan.GroupeInvoiceService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/plan/groupeInvoice")
public class GroupeInvoiceController {
    private final GroupeInvoiceService groupeInvoiceService;

    public GroupeInvoiceController(GroupeInvoiceService groupeInvoiceService) {
        this.groupeInvoiceService = groupeInvoiceService;
    }

    @GetMapping("/get/all/{groupId}")
    public ResponseEntity<?> getAll(@PathVariable Long groupId) {
        return groupeInvoiceService.getAll(groupId);
    }

    @GetMapping("/get/{groupeInvoiceId}")
    public ResponseEntity<?> getGroupeInvoice(@PathVariable UUID groupeInvoiceId) {
        return groupeInvoiceService.getGroupeInvoice(groupeInvoiceId);
    }

    @PostMapping(path = "/add/groupeInvoice/{groupId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> addGroupeInvoice(
            @PathVariable Long groupId,
            @RequestPart AddGroupeInvoiceDto invoice,
            @RequestPart(required = false) MultipartFile invoiceFile,
            @RequestPart(required = false) MultipartFile bankRemiseFile,
            @RequestPart(required = false) MultipartFile receiptFile
    ) {
        // Validation des fichiers PDF
        validatePdfFiles(invoiceFile, bankRemiseFile, receiptFile);

        return groupeInvoiceService.addGroupeInvoice(groupId, invoice, invoiceFile, bankRemiseFile, receiptFile);
    }

    @DeleteMapping("/delete/groupeInvoice/{groupeInvoiceId}")
    public ResponseEntity<?> deleteGroupeInvoice(@PathVariable UUID groupeInvoiceId) {
        return groupeInvoiceService.deleteGroupeInvoice(groupeInvoiceId);
    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updateStatus(@RequestBody UpdateGroupeInvoiceStatusDto updateGroupeInvoiceStatusDto) {
        return groupeInvoiceService.updateStatus(updateGroupeInvoiceStatusDto);
    }

    @GetMapping("get/groupeInvoiceDetails/{invoiceId}")
    public ResponseEntity<?> getGroupeInvoiceDetails(@PathVariable UUID invoiceId) {
        return groupeInvoiceService.getGroupeInvoiceDetails(invoiceId);
    }

    @GetMapping("get/pdf/{invoiceId}/{fileType}")
    public ResponseEntity<?> getPdf(@PathVariable UUID invoiceId, @PathVariable String fileType) {
        return groupeInvoiceService.getPdf(invoiceId, fileType);
    }

    @PutMapping(path = "/edit/groupeInvoice/{invoiceId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> editGroupeInvoice(
            @PathVariable UUID invoiceId,
            @RequestPart AddGroupeInvoiceDto invoice,
            @RequestPart(required = false) MultipartFile invoiceFile,
            @RequestPart(required = false) MultipartFile bankRemiseFile,
            @RequestPart(required = false) MultipartFile receiptFile
    ) {
        // Validation des fichiers PDF
        validatePdfFiles(invoiceFile, bankRemiseFile, receiptFile);

        return groupeInvoiceService.editGroupeInvoice(invoiceId, invoice, invoiceFile, bankRemiseFile, receiptFile);
    }

    /**
     * Validation des fichiers PDF
     */
    private void validatePdfFiles(MultipartFile... files) {
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                // Vérifier que c'est un PDF
                if (!isPdfFile(file)) {
                    throw new IllegalArgumentException(
                            "Le fichier " + file.getOriginalFilename() + " doit être un PDF");
                }

                // Vérifier la taille (max 10MB)
                if (file.getSize() > 10 * 1024 * 1024) {
                    throw new IllegalArgumentException(
                            "Le fichier " + file.getOriginalFilename() + " dépasse la taille limite de 10MB");
                }
            }
        }
    }

    private boolean isPdfFile(MultipartFile file) {
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();

        return (contentType != null && contentType.equals("application/pdf")) ||
                (filename != null && filename.toLowerCase().endsWith(".pdf"));
    }
}