package org.example.authservice.interceptor;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Configuration
public class FeignClientConfig implements RequestInterceptor {
    @Value("${feign.unsecured-urls}")
    private List<String> unsecuredUrls;

    @Override
    public void apply(RequestTemplate requestTemplate) {
        // Vérifier si l'URL est dans la liste des URLs non sécurisées
        String url = requestTemplate.url();
        if (isUnsecuredUrl(url)) {
            System.out.println("ça devrait passer");
            return; // Ne rien faire pour les URLs non sécurisées
        }

        // Pour les autres URLs, ajouter le header d'autorisation
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            String authorizationHeader = attributes.getRequest().getHeader("Authorization");
            if (authorizationHeader != null) {
                // Propagation du token d'authentification
                requestTemplate.header("Authorization", authorizationHeader);
            }
        }
    }

    private boolean isUnsecuredUrl(String url) {
        return unsecuredUrls.stream().anyMatch(url::contains);
    }
}