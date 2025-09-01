package org.example.trainingservice.cacheService;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.client.company.CompanyServiceClient;
import org.example.trainingservice.dto.need.SiteDto;
import org.example.trainingservice.entity.campaign.CampaignEvaluation;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EvaluationCacheService {

    private final CompanyServiceClient companyServiceClient;

    public EvaluationCacheService(CompanyServiceClient companyServiceClient) {
        this.companyServiceClient = companyServiceClient;
    }

    @Cacheable(value = "sites", key = "#campaignEvaluation.siteIds")
    @CircuitBreaker(name = "companyService", fallbackMethod = "getSiteNamesFallback")
    @Retry(name = "companyServiceRetry")
    public List<String> getSiteNamesForNeed(CampaignEvaluation campaignEvaluation) {
        if (campaignEvaluation.getSiteIds() != null && !campaignEvaluation.getSiteIds().isEmpty()) {
            log.info("Fetching site names for need with ID {}.", campaignEvaluation.getId());
            List<SiteDto> siteDtos = companyServiceClient.getSitesByIds(campaignEvaluation.getSiteIds());
            return siteDtos.stream()
                    .map(SiteDto::getLabel)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    // Méthode de repli pour CircuitBreaker
    public List<String> getSiteNamesFallback(CampaignEvaluation campaignEvaluation, Throwable t) {
        // Log l'erreur
        log.error("Erreur lors de la récupération des noms des sites pour le besoin {}: {}", campaignEvaluation.getId(), t.getMessage());
        // Retourne une liste de noms par défaut ou vide
        return Collections.emptyList();
    }

    // Méthode pour récupérer un nom de site individuel (avec cache et gestion des pannes)
    @Cacheable(value = "sites", key = "#siteId")
    @CircuitBreaker(name = "companyService", fallbackMethod = "getSiteNameFallback")
    @Retry(name = "companyServiceRetry")
    public String getSiteName(Long siteId) {
        SiteDto site = companyServiceClient.getSiteById(siteId);
        return site != null ? site.getLabel() : null;
    }

    // Méthode de repli pour CircuitBreaker (site individuel)
    public String getSiteNameFallback(Long siteId, Throwable t) {
        log.error("Erreur lors de la récupération du nom du site avec ID {}: {}", siteId, t.getMessage());
        return null; // Ou une valeur par défaut
    }
}