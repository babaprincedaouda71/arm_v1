package org.example.gatewayservice.config;

import org.example.gatewayservice.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${gateway.company-service.public}")
    private String[] companyServicePublicPaths;

    @Value("${gateway.company-service.protected}")
    private String[] companyServiceProtectedPaths;

    @Value("${gateway.training-service.public}")
    private String[] trainingServicePublicPaths;

    @Value("${gateway.training-service.protected}")
    private String[] trainingServiceProtectedPaths;

    @Value("${gateway.auth-service.public}")
    private String[] authServicePublicPaths;

    @Value("${gateway.auth-service.protected}")
    private String[] authServiceProtectedPaths;

    @Value("${gateway.collaborator-service.protected}")
    private String[] collaboratorServiceProtectedPaths;

    @Value("${gateway.notification-service.public}")
    private String[] notificationServicePublicPaths;

    public GatewayConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, JwtAuthenticationFilter jwtAuthenticationFilter) {
        return builder.routes()
                // Routes publiques pour COMPANY-SERVICE
                .route("company-service-public", r -> r
                        .path(companyServicePublicPaths)
                        .uri("lb://COMPANY-SERVICE"))

                // Routes protégées pour COMPANY-SERVICE
                .route("company-service-protected", r -> r
                        .path(companyServiceProtectedPaths)
                        .filters(f -> f.filter(jwtAuthenticationFilter))
                        .uri("lb://COMPANY-SERVICE"))

                // Routes publiques pour AUTH-SERVICE
                .route("auth-service-public", r -> r
                        .path(authServicePublicPaths)
                        .uri("lb://AUTH-SERVICE"))

                // Routes protégées pour AUTH-SERVICE
                .route("auth-service-protected", r -> r
                        .path(authServiceProtectedPaths)
                        .filters(f -> f.filter(jwtAuthenticationFilter))
                        .uri("lb://AUTH-SERVICE"))

                // Routes publiques pour TRAINING-SERVICE
                .route("training-service-public", r -> r
                        .path(trainingServicePublicPaths)
                        .uri("lb://TRAINING-SERVICE"))

                // Routes protégées pour TRAINING-SERVICE
                .route("training-service-protected", r -> r
                        .path(trainingServiceProtectedPaths)
                        .filters(f -> f.filter(jwtAuthenticationFilter))
                        .uri("lb://TRAINING-SERVICE"))

                // Routes protégées pour COLLABORATOR-SERVICE
                .route("collaborator-service", r -> r
                        .path(collaboratorServiceProtectedPaths)
                        .filters(f -> f.filter(jwtAuthenticationFilter))
                        .uri("lb://COLLABORATOR-SERVICE"))

                // Routes public pour NOTIFICATIONS-SERVICE
                .route("notification-service", r -> r
                        .path(notificationServicePublicPaths)
                        .uri("lb://NOTIFICATION-SERVICE"))
                .build();
    }
}