package org.example.trainingservice.cacheService;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.model.Approver;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserCacheService {
    private final AuthServiceClient authServiceClient;

    public UserCacheService(AuthServiceClient authServiceClient) {
        this.authServiceClient = authServiceClient;
    }

    @Cacheable(value = "approver", key = "#approverId")
    @CircuitBreaker(name = "authService", fallbackMethod = "getApproverNameFallback")
    @Retry(name = "authServiceRetry")
    public String getApproverName(Long approverId) {
        log.info("Fetching approver name for ID {}.", approverId);
        Approver approverById = authServiceClient.getApproverById(approverId);
        log.info("Name: {}", approverById.getName());
        return approverById.getName();
    }

    public String getApproverNameFallback(Long approverId, Throwable t) {
        log.error("Erreur lors de l'appel à getApproverById pour l'ID {}: {}", approverId, t.getMessage(), t);
        return null;
    }
}