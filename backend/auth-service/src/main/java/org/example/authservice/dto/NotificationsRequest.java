package org.example.authservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationsRequest {
    private Long userId;
    private String title;
    private String message;
    private String link;
}