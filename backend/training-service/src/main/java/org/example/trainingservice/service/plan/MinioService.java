package org.example.trainingservice.service.plan;

import org.springframework.web.multipart.MultipartFile;

public interface MinioService {
    String uploadFile(MultipartFile file, String folderPath, String fileName) throws Exception;
    byte[] downloadFile(String filePath) throws Exception;
    void deleteFile(String filePath) throws Exception;
}