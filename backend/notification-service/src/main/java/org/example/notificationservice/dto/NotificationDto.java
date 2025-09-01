package org.example.notificationservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationDto {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String timeAgo;
    private boolean read;
    private String link;
}