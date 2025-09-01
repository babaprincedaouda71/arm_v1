package org.example.notificationservice;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.example.notificationservice.config.TwilioConfig;
import org.example.notificationservice.entity.Notifications;
import org.example.notificationservice.repository.NotificationsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
@ConfigurationProperties
public class NotificationServiceApplication {
    private final TwilioConfig twilioConfig;

    public NotificationServiceApplication(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
    }

    @PostConstruct
    public void setup() {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
    }

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }

//    @Bean
//    CommandLineRunner init(NotificationsRepository notificationsRepository) {
//        return args -> {
//            Notifications notifications = Notifications.builder()
//                    .title("Completion de profil")
//                    .message("Veuillez completer votre profil")
//                    .time("Il y a 1 mns")
//                    .read(false)
//                    .build();
//            notificationsRepository.save(notifications);
//        };
//    }

}