package org.example.trainingservice.service.plan;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.plan.AddGroupeInvoiceDto;
import org.example.trainingservice.entity.plan.GroupeInvoice;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.enums.GroupeInvoiceStatusEnums;
import org.example.trainingservice.exceptions.TrainingGroupeNotFoundException;
import org.example.trainingservice.repository.plan.GroupeInvoiceRepository;
import org.example.trainingservice.repository.plan.TrainingGroupeRepository;
import org.example.trainingservice.utils.GroupeInvoiceUtilMethods;
import org.example.trainingservice.utils.SecurityUtils;
import org.example.trainingservice.web.plan.UpdateGroupeInvoiceStatusDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class GroupeInvoiceServiceImpl implements GroupeInvoiceService {
    private final GroupeInvoiceRepository groupeInvoiceRepository;
    private final TrainingGroupeRepository trainingGroupeRepository;
    private final FileStorageService fileStorageService;

    public GroupeInvoiceServiceImpl(GroupeInvoiceRepository groupeInvoiceRepository, TrainingGroupeRepository trainingGroupeRepository, FileStorageService fileStorageService) {
        this.groupeInvoiceRepository = groupeInvoiceRepository;
        this.trainingGroupeRepository = trainingGroupeRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public ResponseEntity<?> getAll(Long groupId) {
        log.info("Recherche des factures pour le groupe {}", groupId);

        // Vérifier que le groupe existe
        if (!trainingGroupeRepository.existsById(groupId)) {
            throw new TrainingGroupeNotFoundException("Groupe de formation non trouvé avec l'ID: " + groupId, null);
        }

        List<GroupeInvoice> invoices = groupeInvoiceRepository.findByTrainingGroupeId(groupId);
        return ResponseEntity.ok(GroupeInvoiceUtilMethods.mapToGetGroupeInvoicesDto(invoices));
    }

    @Override
    public ResponseEntity<?> getGroupeInvoice(UUID groupeInvoiceId) {
        log.info("Recherche de la facture pour l'ID {}", groupeInvoiceId);

        Optional<GroupeInvoice> foundGroupeInvoice = groupeInvoiceRepository.findById(groupeInvoiceId);
        if (foundGroupeInvoice.isPresent()) {
            GroupeInvoice groupeInvoice = foundGroupeInvoice.get();
            return ResponseEntity.ok(GroupeInvoiceUtilMethods.mapSingleInvoiceToDto(groupeInvoice));
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<?> addGroupeInvoice(
            Long groupId, AddGroupeInvoiceDto createDto,
            MultipartFile invoiceFile,
            MultipartFile bankRemiseFile,
            MultipartFile receiptFile
    ) {
        log.info("Ajout d'une facture pour le groupe {}", groupId);

        // Vérifier que le groupe existe
        TrainingGroupe trainingGroupe = trainingGroupeRepository.findById(groupId)
                .orElseThrow(() -> new TrainingGroupeNotFoundException("Groupe de formation non trouvé avec l'ID: " + groupId, null));

        // Upload des fichiers vers MinIO
        String invoiceFileName = uploadFileIfPresent(invoiceFile, "invoice");
        String bankRemiseFileName = uploadFileIfPresent(bankRemiseFile, "bank-remise");
        String receiptFileName = uploadFileIfPresent(receiptFile, "receipt");

        try {
            // Créer l'entité GroupeInvoice
            GroupeInvoice invoice = GroupeInvoice.builder()
                    .trainingGroupe(trainingGroupe)
                    .companyId(SecurityUtils.getCurrentCompanyId())
                    .type(createDto.getType())
                    .creationDate(LocalDate.now())
                    .description(createDto.getDescription())
                    .amount(createDto.getAmount())
                    .status(GroupeInvoiceStatusEnums.NOT_PAID)
                    .paymentDate(createDto.getPaymentDate() != null ? createDto.getPaymentDate() : LocalDate.now())
                    .paymentMethod(createDto.getPaymentMethod())
                    .invoiceFile(invoiceFileName)
                    .bankRemiseFile(bankRemiseFileName)
                    .receiptFile(receiptFileName)
                    .build();

            // Sauvegarder en base
            GroupeInvoice savedInvoice = groupeInvoiceRepository.save(invoice);

            log.info("Facture créée avec succès - ID: {}", savedInvoice.getId());

            // Convertir en DTO et retourner
            return ResponseEntity.ok(GroupeInvoiceUtilMethods.mapSingleInvoiceToDto(savedInvoice));

        } catch (Exception e) {
            // En cas d'erreur, supprimer les fichiers uploadés
            log.error("Erreur lors de la création de la facture, suppression des fichiers uploadés", e);
            deleteFileIfPresent(invoiceFileName);
            deleteFileIfPresent(bankRemiseFileName);
            deleteFileIfPresent(receiptFileName);
            throw new RuntimeException("Erreur lors de la création de la facture: " + e.getMessage(), e);
        }
    }

    @Override
    public ResponseEntity<?> deleteGroupeInvoice(UUID groupeInvoiceId) {
        log.info("Suppression de la facture pour l'ID {}", groupeInvoiceId);
        Optional<GroupeInvoice> foundGroupeInvoice = groupeInvoiceRepository.findById(groupeInvoiceId);
        if (foundGroupeInvoice.isPresent()) {
            groupeInvoiceRepository.deleteById(groupeInvoiceId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    @Override
    public ResponseEntity<?> updateStatus(UpdateGroupeInvoiceStatusDto updateGroupeInvoiceStatusDto) {
        log.info("Tentative de mise à jour du statut de la facture de groupe.");

        UUID groupeInvoiceId = updateGroupeInvoiceStatusDto.getId();
        String statusString = updateGroupeInvoiceStatusDto.getStatus();

        // Vérification que les données d'entrée ne sont pas nulles ou vides
        if (groupeInvoiceId == null || statusString == null || statusString.trim().isEmpty()) {
            log.warn("ID de facture ou statut manquant dans la requête.");
            return ResponseEntity.badRequest().body("L'ID de la facture et le statut sont requis.");
        }

        // Recherche de la facture dans le dépôt
        Optional<GroupeInvoice> foundGroupeInvoiceOpt = groupeInvoiceRepository.findById(groupeInvoiceId);

        if (foundGroupeInvoiceOpt.isEmpty()) {
            log.warn("Aucune facture de groupe trouvée avec l'ID : {}", groupeInvoiceId);
            return ResponseEntity.notFound().build();
        }

        try {
            // Conversion de la chaîne de caractères du statut en énumération via la description
            GroupeInvoiceStatusEnums newStatus = GroupeInvoiceStatusEnums.fromDescription(statusString);

            GroupeInvoice groupeInvoice = foundGroupeInvoiceOpt.get();
            groupeInvoice.setStatus(newStatus);

            // Si le statut est "Réglée", on peut aussi mettre à jour la date de paiement
            if (newStatus == GroupeInvoiceStatusEnums.PAID) {
                groupeInvoice.setPaymentDate(java.time.LocalDate.now());
            }

            groupeInvoiceRepository.save(groupeInvoice);

            log.info("Le statut de la facture de groupe {} a été mis à jour avec succès à '{}'", groupeInvoiceId, newStatus);
            return ResponseEntity.ok().body("Statut mis à jour avec succès.");

        } catch (IllegalArgumentException e) {
            // Ce bloc est exécuté si fromDescription lève une exception (statut invalide)
            log.error("Statut invalide fourni : '{}'", statusString, e);
            return ResponseEntity.badRequest().body("Le statut fourni n'est pas valide : " + statusString);
        }
    }

    @Override
    public ResponseEntity<?> getGroupeInvoiceDetails(UUID invoiceId) {
        log.info("Get details for invoice {}", invoiceId);
        Optional<GroupeInvoice> foundGroupeInvoice = groupeInvoiceRepository.findById(invoiceId);
        if (foundGroupeInvoice.isPresent()) {
            GroupeInvoice groupeInvoice = foundGroupeInvoice.get();
            return ResponseEntity.ok(GroupeInvoiceUtilMethods.mapToGetGroupeInvoiceDetailsDto(groupeInvoice));
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<?> getPdf(UUID invoiceId, String fileType) {
        log.info("Get PDF for invoice {}", invoiceId);
        Optional<GroupeInvoice> foundGroupeInvoice = groupeInvoiceRepository.findById(invoiceId);
        if (foundGroupeInvoice.isPresent()) {
            GroupeInvoice groupeInvoice = foundGroupeInvoice.get();
            String fileNameByType = getFileNameByType(groupeInvoice, fileType);

            byte[] bytes = fileStorageService.downloadFile(fileNameByType);

            return ResponseEntity.ok(bytes);
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<?> editGroupeInvoice(
            UUID invoiceId, AddGroupeInvoiceDto updateDto,
            MultipartFile invoiceFile,
            MultipartFile bankRemiseFile,
            MultipartFile receiptFile
    ) {
        log.info("Modification de la facture {}", invoiceId);

        // Vérifier que la facture existe
        GroupeInvoice existingInvoice = groupeInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'ID: " + invoiceId));

        // Stocker les anciens noms de fichiers pour suppression si nécessaire
        String oldInvoiceFile = existingInvoice.getInvoiceFile();
        String oldBankRemiseFile = existingInvoice.getBankRemiseFile();
        String oldReceiptFile = existingInvoice.getReceiptFile();

        // Upload des nouveaux fichiers et gestion du remplacement
        String newInvoiceFileName = handleFileUpdate(invoiceFile, oldInvoiceFile, "invoice");
        String newBankRemiseFileName = handleFileUpdate(bankRemiseFile, oldBankRemiseFile, "bank-remise");
        String newReceiptFileName = handleFileUpdate(receiptFile, oldReceiptFile, "receipt");

        try {
            // Mettre à jour les données de base
            existingInvoice.setType(updateDto.getType());
            existingInvoice.setDescription(updateDto.getDescription());
            existingInvoice.setAmount(updateDto.getAmount());
            existingInvoice.setPaymentMethod(updateDto.getPaymentMethod());
            existingInvoice.setPaymentDate(updateDto.getPaymentDate() != null ? updateDto.getPaymentDate() : existingInvoice.getPaymentDate());

            // Mettre à jour les fichiers
            existingInvoice.setInvoiceFile(newInvoiceFileName);
            existingInvoice.setBankRemiseFile(newBankRemiseFileName);
            existingInvoice.setReceiptFile(newReceiptFileName);

            // Sauvegarder en base
            GroupeInvoice savedInvoice = groupeInvoiceRepository.save(existingInvoice);

            log.info("Facture modifiée avec succès - ID: {}", savedInvoice.getId());

            // Convertir en DTO et retourner
            return ResponseEntity.ok(GroupeInvoiceUtilMethods.mapSingleInvoiceToDto(savedInvoice));

        } catch (Exception e) {
            // En cas d'erreur, supprimer les nouveaux fichiers uploadés
            log.error("Erreur lors de la modification de la facture, suppression des nouveaux fichiers", e);
            if (!newInvoiceFileName.equals(oldInvoiceFile)) {
                deleteFileIfPresent(newInvoiceFileName);
            }
            if (!newBankRemiseFileName.equals(oldBankRemiseFile)) {
                deleteFileIfPresent(newBankRemiseFileName);
            }
            if (!newReceiptFileName.equals(oldReceiptFile)) {
                deleteFileIfPresent(newReceiptFileName);
            }
            throw new RuntimeException("Erreur lors de la modification de la facture: " + e.getMessage(), e);
        }
    }

    /**
     * Gère la mise à jour d'un fichier (upload nouveau ou conservation ancien)
     */
    private String handleFileUpdate(MultipartFile newFile, String oldFileName, String prefix) {
        if (newFile != null && !newFile.isEmpty()) {
            // Nouveau fichier fourni - uploader et supprimer l'ancien
            String newFileName = fileStorageService.uploadFile(newFile);

            // Supprimer l'ancien fichier s'il existe
            if (oldFileName != null && !oldFileName.trim().isEmpty()) {
                deleteFileIfPresent(oldFileName);
            }

            return newFileName;
        } else {
            // Pas de nouveau fichier - conserver l'ancien
            return oldFileName;
        }
    }


    /*************************************************************/
    /**
     * Upload un fichier vers MinIO si présent
     */
    private String uploadFileIfPresent(MultipartFile file, String prefix) {
        if (file != null && !file.isEmpty()) {
            log.debug("Upload du fichier {} de type {}", file.getOriginalFilename(), prefix);
            return fileStorageService.uploadFile(file);
        }
        return null;
    }

    /**
     * Supprimer un fichier de MinIO si présent
     */
    private void deleteFileIfPresent(String fileName) {
        if (fileName != null && !fileName.trim().isEmpty()) {
            try {
                fileStorageService.deleteFile(fileName);
                log.debug("Fichier supprimé: {}", fileName);
            } catch (Exception e) {
                log.warn("Erreur lors de la suppression du fichier {}: {}", fileName, e.getMessage());
            }
        }
    }

    /**
     * Récupérer le nom de fichier selon le type
     */
    private String getFileNameByType(GroupeInvoice invoice, String fileType) {
        return switch (fileType.toLowerCase()) {
            case "invoice", "facture" -> invoice.getInvoiceFile();
            case "bankremise", "remise" -> invoice.getBankRemiseFile();
            case "receipt", "recu" -> invoice.getReceiptFile();
            default -> null;
        };
    }
    /*************************************************************/
}