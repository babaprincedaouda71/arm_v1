package org.example.trainingservice.service.ocf;

import org.example.trainingservice.dto.ocf.OCFCreateDto;
import org.example.trainingservice.dto.ocf.OCFUpdateDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface OCFService {
    ResponseEntity<?> getAllOcf();

    ResponseEntity<?> getOcfAddOrEditGroup();

    ResponseEntity<?> createOCF(
            OCFCreateDto ocfCreateDto,
            MultipartFile legalStatusFile,
            MultipartFile eligibilityCertificateFile,
            MultipartFile jrcTemplateFile,
            MultipartFile insurancePolicyFile,
            MultipartFile taxComplianceCertificateFile,
            MultipartFile bankStatementCertificateFile,
            MultipartFile termsAndConditionsFile,
            MultipartFile otherCertificationsFile
    );

    ResponseEntity<?> updateOCF(
            Long ocfId,
            OCFUpdateDto ocfUpdateDto,
            MultipartFile legalStatusFile,
            MultipartFile eligibilityCertificateFile,
            MultipartFile jrcTemplateFile,
            MultipartFile insurancePolicyFile,
            MultipartFile taxComplianceCertificateFile,
            MultipartFile bankStatementCertificateFile,
            MultipartFile termsAndConditionsFile,
            MultipartFile otherCertificationsFile
    );

    ResponseEntity<?> updateStatus(Long id);

    ResponseEntity<byte[]> getPdf(Long ocfId, String fileType);

    ResponseEntity<?> deleteOCF(Long ocfId);

    ResponseEntity<?> getDetails(Long id);
}