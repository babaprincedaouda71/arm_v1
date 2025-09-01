package org.example.trainingservice.service.plan;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {
    @Value("${minio.bucket-name}")
    private String bucketName;

    private final MinioClient minioClient;

    public FileStorageService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    /**
     * Envoie un fichier vers MinIO.
     *
     * @param file Le fichier à envoyer.
     * @return Le nom unique du fichier stocké.
     */
    public String uploadFile(MultipartFile file) {
        try {
            log.error("Envoi du fichier {} de type {}", file.getOriginalFilename(), file.getContentType());
            String uniqueFileName = generateUniqueFileName(file.getOriginalFilename());
            InputStream inputStream = file.getInputStream();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(uniqueFileName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            inputStream.close();
            return uniqueFileName;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du stockage du fichier : " + e.getMessage(), e);
        }
    }

    /**
     * Télécharge un fichier depuis MinIO.
     *
     * @param objectName Le nom unique du fichier à télécharger.
     * @return Le contenu du fichier en tant que tableau de bytes.
     */
    public byte[] downloadFile(String objectName) {
        try (InputStream stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .build())) {
            return stream.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du téléchargement du fichier : " + e.getMessage(), e);
        }
    }

    /**
     * Supprime un fichier de MinIO.
     *
     * @param objectName Le nom unique du fichier à supprimer.
     */
    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            // Dans une vraie application, il faudrait logger cette erreur
            System.err.println("Erreur lors de la suppression du fichier " + objectName + ": " + e.getMessage());
        }
    }


    private String generateUniqueFileName(String originalFilename) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return originalFilename+" - "+UUID.randomUUID().toString() + extension;
    }
}