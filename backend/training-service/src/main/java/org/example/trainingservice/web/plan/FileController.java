package org.example.trainingservice.web.plan;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.service.plan.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/plan/file")
@Slf4j
public class FileController {
    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * Endpoint pour sauvegarder un PDF d'avis d'annulation sur MinIO
     */
    @PostMapping("/save-cancellation-notice")
    public ResponseEntity<Map<String, Object>> saveCancellationNoticePDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam("trainingId") String trainingId) {

        try {
            log.info("Réception du PDF d'avis d'annulation pour la formation ID: {}", trainingId);

            // Validation du fichier
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Le fichier PDF est vide"));
            }

            // Vérification du type de fichier
            String contentType = file.getContentType();
            if (contentType == null || !contentType.equals("application/pdf")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Le fichier doit être un PDF"));
            }

            // Générer un nom de fichier avec préfixe pour les avis d'annulation
            String originalFileName = file.getOriginalFilename();
            String fileName = "cancellation_notice_" + trainingId + "_" + System.currentTimeMillis() + ".pdf";

            // Créer un nouveau MultipartFile avec le nom personnalisé
            MultipartFile renamedFile = new MultipartFile() {
                @Override
                public String getName() {
                    return file.getName();
                }

                @Override
                public String getOriginalFilename() {
                    return fileName;
                }

                @Override
                public String getContentType() {
                    return file.getContentType();
                }

                @Override
                public boolean isEmpty() {
                    return file.isEmpty();
                }

                @Override
                public long getSize() {
                    return file.getSize();
                }

                @Override
                public byte[] getBytes() throws java.io.IOException {
                    return file.getBytes();
                }

                @Override
                public java.io.InputStream getInputStream() throws java.io.IOException {
                    return file.getInputStream();
                }

                @Override
                public void transferTo(java.io.File dest) throws java.io.IOException, IllegalStateException {
                    file.transferTo(dest);
                }
            };

            // Sauvegarder le fichier sur MinIO
            String storedFileName = fileStorageService.uploadFile(renamedFile);

            log.info("PDF d'avis d'annulation sauvegardé avec succès: {}", storedFileName);

            // Préparer la réponse
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "PDF d'avis d'annulation sauvegardé avec succès");
            response.put("fileName", storedFileName);
            response.put("trainingId", trainingId);
            response.put("uploadDate", System.currentTimeMillis());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erreur lors de la sauvegarde du PDF d'avis d'annulation", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Erreur lors de la sauvegarde du PDF");
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    /**
     * Endpoint pour récupérer un PDF sauvegardé
     */
    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> downloadPDF(@PathVariable String fileName) {
        try {
            byte[] fileData = fileStorageService.downloadFile(fileName);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                    .body(fileData);

        } catch (Exception e) {
            log.error("Erreur lors du téléchargement du PDF: {}", fileName, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint pour supprimer un PDF
     */
    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<Map<String, Object>> deletePDF(@PathVariable String fileName) {
        try {
            fileStorageService.deleteFile(fileName);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "PDF supprimé avec succès");
            response.put("fileName", fileName);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erreur lors de la suppression du PDF: {}", fileName, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Erreur lors de la suppression du PDF");
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
}