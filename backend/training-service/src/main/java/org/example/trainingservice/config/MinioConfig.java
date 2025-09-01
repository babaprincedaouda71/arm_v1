package org.example.trainingservice.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    // Injecte la valeur de "minio.endpoint" depuis application.properties
    @Value("${minio.endpoint}")
    private String endpoint;

    // Injecte la valeur de "minio.access-key"
    @Value("${minio.access-key}")
    private String accessKey;

    // Injecte la valeur de "minio.secret-key"
    @Value("${minio.secret-key}")
    private String secretKey;

    /**
     * Crée un "Bean" MinioClient.
     * Spring va gérer cet objet et vous pourrez l'injecter
     * n'importe où avec @Autowired.
     */
    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}