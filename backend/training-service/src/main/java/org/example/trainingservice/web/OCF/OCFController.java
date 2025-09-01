package org.example.trainingservice.web.OCF;

import org.example.trainingservice.dto.ocf.OCFCreateDto;
import org.example.trainingservice.dto.ocf.OCFUpdateDto;
import org.example.trainingservice.service.ocf.OCFService;
import org.example.trainingservice.utils.FileUtilMethods;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ocf")
public class OCFController {
    private final OCFService ocfService;

    public OCFController(OCFService ocfService) {
        this.ocfService = ocfService;
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return ocfService.getAllOcf();
    }

    @GetMapping("/get/ocfAddOrEditGroup")
    public ResponseEntity<?> getOcfAddOrEditGroup() {
        return ocfService.getOcfAddOrEditGroup();
    }

    @PostMapping(path = "/add/ocf", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createOcf(
            @RequestPart OCFCreateDto ocfCreateDto,
            @RequestPart(required = false) MultipartFile legalStatusFile,
            @RequestPart(required = false) MultipartFile eligibilityCertificateFile,
            @RequestPart(required = false) MultipartFile jrcTemplateFile,
            @RequestPart(required = false) MultipartFile insurancePolicyFile,
            @RequestPart(required = false) MultipartFile taxComplianceCertificateFile,
            @RequestPart(required = false) MultipartFile bankStatementCertificateFile,
            @RequestPart(required = false) MultipartFile termsAndConditionsFile,
            @RequestPart(required = false) MultipartFile otherCertificationsFile
    ) {
        // Validation des fichiers pdf
        FileUtilMethods.validatePdfFiles(
                legalStatusFile,
                eligibilityCertificateFile,
                jrcTemplateFile,
                insurancePolicyFile,
                taxComplianceCertificateFile,
                bankStatementCertificateFile,
                termsAndConditionsFile,
                otherCertificationsFile
        );
        return ocfService.createOCF(
                ocfCreateDto,
                legalStatusFile,
                eligibilityCertificateFile,
                jrcTemplateFile,
                insurancePolicyFile,
                taxComplianceCertificateFile,
                bankStatementCertificateFile,
                termsAndConditionsFile,
                otherCertificationsFile
        );
    }

    /**
     * Met à jour un OCF existant
     */
    @PutMapping(path = "/edit/{ocfId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateOcf(
            @PathVariable Long ocfId,
            @RequestPart OCFUpdateDto ocfUpdateDto,
            @RequestPart(required = false) MultipartFile legalStatusFile,
            @RequestPart(required = false) MultipartFile eligibilityCertificateFile,
            @RequestPart(required = false) MultipartFile jrcTemplateFile,
            @RequestPart(required = false) MultipartFile insurancePolicyFile,
            @RequestPart(required = false) MultipartFile taxComplianceCertificateFile,
            @RequestPart(required = false) MultipartFile bankStatementCertificateFile,
            @RequestPart(required = false) MultipartFile termsAndConditionsFile,
            @RequestPart(required = false) MultipartFile otherCertificationsFile
    ) {
        // Validation des fichiers PDF
        FileUtilMethods.validatePdfFiles(
                legalStatusFile,
                eligibilityCertificateFile,
                jrcTemplateFile,
                insurancePolicyFile,
                taxComplianceCertificateFile,
                bankStatementCertificateFile,
                termsAndConditionsFile,
                otherCertificationsFile
        );

        return ocfService.updateOCF(
                ocfId,
                ocfUpdateDto,
                legalStatusFile,
                eligibilityCertificateFile,
                jrcTemplateFile,
                insurancePolicyFile,
                taxComplianceCertificateFile,
                bankStatementCertificateFile,
                termsAndConditionsFile,
                otherCertificationsFile
        );
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id) {
        return ocfService.updateStatus(id);
    }

    @GetMapping("/get/details/ocf/{id}")
    public ResponseEntity<?> getDetails(@PathVariable Long id) {
        return ocfService.getDetails(id);
    }

     /* Récupère un fichier PDF d'un OCF */
    @GetMapping("/get/pdf/{ocfId}/{fileType}")
    public ResponseEntity<byte[]> getPdf(
            @PathVariable Long ocfId,
            @PathVariable String fileType
    ) {
        return ocfService.getPdf(ocfId, fileType);
    }

    /**
     * Supprime un OCF et ses fichiers associés
     */
    @DeleteMapping("/delete/{ocfId}")
    public ResponseEntity<?> deleteOcf(@PathVariable Long ocfId) {
        return ocfService.deleteOCF(ocfId);
    }
}