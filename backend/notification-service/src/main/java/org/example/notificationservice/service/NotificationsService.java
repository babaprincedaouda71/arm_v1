package org.example.notificationservice.service;

import org.example.notificationservice.dto.NotificationDto;
import org.example.notificationservice.entity.Notifications;

import java.util.List;

public interface NotificationsService {
    List<NotificationDto> findAll(Long userId);

    void save(Notifications notifications);

    Notifications send(Notifications notifications);

    boolean markAsRead(Long id);
}