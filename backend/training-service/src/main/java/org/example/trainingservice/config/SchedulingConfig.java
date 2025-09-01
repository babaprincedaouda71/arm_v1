package org.example.trainingservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulingConfig {
    // Configuration vide - l'annotation @EnableScheduling active les @Scheduled
}