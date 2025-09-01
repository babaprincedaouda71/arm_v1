package org.example.trainingservice.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
public class FileUtilMethods {

    /**
     * Validation des fichiers PDF
     */
    public static void validatePdfFiles(MultipartFile... files) {
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

    public static boolean isPdfFile(MultipartFile file) {
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();

        return (contentType != null && contentType.equals("application/pdf")) ||
                (filename != null && filename.toLowerCase().endsWith(".pdf"));
    }
}