package org.example.trainingservice.service.ocf;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.ocf.OCFCreateDto;
import org.example.trainingservice.dto.ocf.OCFUpdateDto;
import org.example.trainingservice.entity.OCF;
import org.example.trainingservice.enums.OCFStatusEnum;
import org.example.trainingservice.repository.OCFRepository;
import org.example.trainingservice.service.plan.FileStorageService;
import org.example.trainingservice.utils.OCFUtilMethods;
import org.example.trainingservice.utils.SecurityUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class OCFServiceImpl implements OCFService {
    private final OCFRepository ocfRepository;
    private final FileStorageService fileStorageService;


    public OCFServiceImpl(OCFRepository ocfRepository, FileStorageService fileStorageService) {
        this.ocfRepository = ocfRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public ResponseEntity<?> getAllOcf() {
        List<OCF> ocfs = ocfRepository.findByCompanyId(SecurityUtils.getCurrentCompanyId());
        return ResponseEntity.ok(OCFUtilMethods.mapToOCFDashboardDataDto(ocfs));
    }

    @Override
    public ResponseEntity<?> getOcfAddOrEditGroup() {
        List<OCF> byCompanyId = ocfRepository.findByCompanyId(SecurityUtils.getCurrentCompanyId());
        return ResponseEntity.ok(OCFUtilMethods.mapToOCFAddOrEditGroupDto(byCompanyId));
    }

    @Override
    public ResponseEntity<?> createOCF(
            OCFCreateDto ocfCreateDto,
            MultipartFile legalStatusFile,
            MultipartFile eligibilityCertificateFile,
            MultipartFile jrcTemplateFile,
            MultipartFile insurancePolicyFile,
            MultipartFile taxComplianceCertificateFile,
            MultipartFile bankStatementCertificateFile,
            MultipartFile termsAndConditionsFile,
            MultipartFile otherCertificationsFile
    ) {
        log.info("Starting creating OCF : {}", ocfCreateDto);

        try {
            Long companyId = SecurityUtils.getCurrentCompanyId();

            OCF ocf = OCFUtilMethods.mapToOCF(ocfCreateDto, companyId);

            // Traitement des fichiers
            uploadAndSetFiles(ocf, legalStatusFile, eligibilityCertificateFile,
                    jrcTemplateFile, insurancePolicyFile, taxComplianceCertificateFile,
                    bankStatementCertificateFile, termsAndConditionsFile, otherCertificationsFile);

            ocfRepository.save(ocf);

            log.info("OCF created successfully with ID: {}", ocf.getId());
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Error creating OCF: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la création de l'OCF: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> updateOCF(
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
    ) {
        log.info("Starting updating OCF with ID: {}", ocfId);

        try {
            Optional<OCF> ocfOptional = ocfRepository.findById(ocfId);

            if (ocfOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            OCF existingOcf = ocfOptional.get();

            // Vérifier que l'OCF appartient à la même compagnie
            if (!existingOcf.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
                return ResponseEntity.badRequest().build();
            }

            // Mettre à jour les informations de base
            updateOcfBasicInfo(existingOcf, ocfUpdateDto);

            // Traitement des nouveaux fichiers (remplace les anciens si fournis)
            uploadAndSetFiles(existingOcf, legalStatusFile, eligibilityCertificateFile,
                    jrcTemplateFile, insurancePolicyFile, taxComplianceCertificateFile,
                    bankStatementCertificateFile, termsAndConditionsFile, otherCertificationsFile);

            ocfRepository.save(existingOcf);

            log.info("OCF updated successfully with ID: {}", ocfId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Error updating OCF: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la modification de l'OCF: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> updateStatus(Long id) {
        try {
            Optional<OCF> ocfOptional = ocfRepository.findById(id);

            if (ocfOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            OCF ocf = ocfOptional.get();

            // Vérifier que l'OCF appartient à la même compagnie
            if (!ocf.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
                return ResponseEntity.badRequest().build();
            }

            // Basculer le statut
            OCFStatusEnum newStatus = ocf.getStatus() == OCFStatusEnum.ACTIVE
                    ? OCFStatusEnum.INACTIVE
                    : OCFStatusEnum.ACTIVE;

            ocf.setStatus(newStatus);
            ocfRepository.save(ocf);

            log.info("OCF status updated successfully. ID: {}, New status: {}", id, newStatus);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Error updating OCF status: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la mise à jour du statut: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<byte[]> getPdf(Long ocfId, String fileType) {
        try {
            Optional<OCF> ocfOptional = ocfRepository.findById(ocfId);

            if (ocfOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            OCF ocf = ocfOptional.get();

            // Vérifier que l'OCF appartient à la même compagnie
            if (!ocf.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
                return ResponseEntity.status(403).build();
            }

            String fileName = getFileNameByType(ocf, fileType);

            if (fileName == null) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = fileStorageService.downloadFile(fileName);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", fileName);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);

        } catch (Exception e) {
            log.error("Error downloading PDF: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<?> deleteOCF(Long ocfId) {
        try {
            Optional<OCF> ocfOptional = ocfRepository.findById(ocfId);

            if (ocfOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            OCF ocf = ocfOptional.get();

            // Vérifier que l'OCF appartient à la même compagnie
            if (!ocf.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
                return ResponseEntity.badRequest().build();
            }

            // Supprimer les fichiers associés
            deleteAssociatedFiles(ocf);

            // Supprimer l'OCF de la base de données
            ocfRepository.delete(ocf);

            log.info("OCF deleted successfully with ID: {}", ocfId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Error deleting OCF: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la suppression de l'OCF: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getDetails(Long id) {
        log.info("Starting getting OCF details with ID: {}", id);
        OCF ocf = ocfRepository.findById(id).orElseThrow(() -> new RuntimeException("OCF not found with ID: " + id));
        if (ocf.getCompanyId().equals(SecurityUtils.getCurrentCompanyId())) {
            return ResponseEntity.ok(OCFUtilMethods.mapToOCFDetailsDto(ocf));
        }
        return ResponseEntity.status(403).build();
    }

    /**
     * Upload et définit les fichiers pour un OCF
     */
    private OCF uploadAndSetFiles(OCF ocf, MultipartFile... files) {
        String[] fileFields = {
                "legalStatusFile", "eligibilityCertificateFile", "jrcTemplateFile",
                "insurancePolicyFile", "taxComplianceCertificateFile", "bankStatementCertificateFile",
                "termsAndConditionsFile", "otherCertificationsFile"
        };

        for (int i = 0; i < files.length && i < fileFields.length; i++) {
            MultipartFile file = files[i];
            String fieldName = fileFields[i];

            if (file != null && !file.isEmpty()) {
                try {
                    // Supprimer l'ancien fichier s'il existe
                    String oldFileName = getFieldValue(ocf, fieldName);
                    if (oldFileName != null) {
                        fileStorageService.deleteFile(oldFileName);
                    }

                    // Upload du nouveau fichier
                    String newFileName = fileStorageService.uploadFile(file);
                    setFieldValue(ocf, fieldName, newFileName);

                    log.debug("File uploaded successfully: {} -> {}", fieldName, newFileName);

                } catch (Exception e) {
                    log.error("Error uploading file {}: {}", fieldName, e.getMessage());
                    throw new RuntimeException("Erreur lors de l'upload du fichier " + fieldName, e);
                }
            }
        }

        return ocf;
    }

    /**
     * Met à jour les informations de base d'un OCF
     */
    private void updateOcfBasicInfo(OCF existingOcf, OCFUpdateDto updateDto) {
        existingOcf.setCorporateName(updateDto.getCorporateName());
        existingOcf.setAddress(updateDto.getAddress());
        existingOcf.setPhone(updateDto.getPhone());
        existingOcf.setEmail(updateDto.getEmail());
        existingOcf.setWebsite(updateDto.getWebsite());
        existingOcf.setStaff(updateDto.getStaff());
        existingOcf.setCreationDate(updateDto.getCreationDate());
        existingOcf.setLegalForm(updateDto.getLegalForm());
        existingOcf.setIce(updateDto.getIce());
        existingOcf.setRc(updateDto.getRc());
        existingOcf.setPatent(updateDto.getPatent());
        existingOcf.setIfValue(updateDto.getIfValue());
        existingOcf.setCnss(updateDto.getCnss());
        existingOcf.setPermanentStaff(updateDto.getPermanentStaff());
        existingOcf.setNameLegalRepresentant(updateDto.getNameLegalRepresentant());
        existingOcf.setPositionLegalRepresentant(updateDto.getPositionLegalRepresentant());
        existingOcf.setPhoneLegalRepresentant(updateDto.getPhoneLegalRepresentant());
        existingOcf.setEmailLegalRepresentant(updateDto.getEmailLegalRepresentant());
        existingOcf.setNameMainContact(updateDto.getNameMainContact());
        existingOcf.setPositionMainContact(updateDto.getPositionMainContact());
        existingOcf.setPhoneMainContact(updateDto.getPhoneMainContact());
        existingOcf.setEmailMainContact(updateDto.getEmailMainContact());
    }

    /**
     * Récupère le nom de fichier par type
     */
    private String getFileNameByType(OCF ocf, String fileType) {
        return switch (fileType) {
            case "legalStatusFile" -> ocf.getLegalStatusFile();
            case "eligibilityCertificateFile" -> ocf.getEligibilityCertificateFile();
            case "jrcTemplateFile" -> ocf.getJrcTemplateFile();
            case "insurancePolicyFile" -> ocf.getInsurancePolicyFile();
            case "taxComplianceCertificateFile" -> ocf.getTaxComplianceCertificateFile();
            case "bankStatementCertificateFile" -> ocf.getBankStatementCertificateFile();
            case "termsAndConditionsFile" -> ocf.getTermsAndConditionsFile();
            case "otherCertificationsFile" -> ocf.getOtherCertificationsFile();
            default -> null;
        };
    }

    /**
     * Récupère la valeur d'un champ de fichier
     */
    private String getFieldValue(OCF ocf, String fieldName) {
        return switch (fieldName) {
            case "legalStatusFile" -> ocf.getLegalStatusFile();
            case "eligibilityCertificateFile" -> ocf.getEligibilityCertificateFile();
            case "jrcTemplateFile" -> ocf.getJrcTemplateFile();
            case "insurancePolicyFile" -> ocf.getInsurancePolicyFile();
            case "taxComplianceCertificateFile" -> ocf.getTaxComplianceCertificateFile();
            case "bankStatementCertificateFile" -> ocf.getBankStatementCertificateFile();
            case "termsAndConditionsFile" -> ocf.getTermsAndConditionsFile();
            case "otherCertificationsFile" -> ocf.getOtherCertificationsFile();
            default -> null;
        };
    }

    /**
     * Définit la valeur d'un champ de fichier
     */
    private void setFieldValue(OCF ocf, String fieldName, String fileName) {
        switch (fieldName) {
            case "legalStatusFile" -> ocf.setLegalStatusFile(fileName);
            case "eligibilityCertificateFile" -> ocf.setEligibilityCertificateFile(fileName);
            case "jrcTemplateFile" -> ocf.setJrcTemplateFile(fileName);
            case "insurancePolicyFile" -> ocf.setInsurancePolicyFile(fileName);
            case "taxComplianceCertificateFile" -> ocf.setTaxComplianceCertificateFile(fileName);
            case "bankStatementCertificateFile" -> ocf.setBankStatementCertificateFile(fileName);
            case "termsAndConditionsFile" -> ocf.setTermsAndConditionsFile(fileName);
            case "otherCertificationsFile" -> ocf.setOtherCertificationsFile(fileName);
        }
    }

    /**
     * Supprime tous les fichiers associés à un OCF
     */
    private void deleteAssociatedFiles(OCF ocf) {
        String[] fileNames = {
                ocf.getLegalStatusFile(),
                ocf.getEligibilityCertificateFile(),
                ocf.getJrcTemplateFile(),
                ocf.getInsurancePolicyFile(),
                ocf.getTaxComplianceCertificateFile(),
                ocf.getBankStatementCertificateFile(),
                ocf.getTermsAndConditionsFile(),
                ocf.getOtherCertificationsFile()
        };

        for (String fileName : fileNames) {
            if (fileName != null) {
                try {
                    fileStorageService.deleteFile(fileName);
                } catch (Exception e) {
                    log.warn("Could not delete file {}: {}", fileName, e.getMessage());
                }
            }
        }
    }
}