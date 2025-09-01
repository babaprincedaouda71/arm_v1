package org.example.notificationservice.service;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.dto.NotificationDto;
import org.example.notificationservice.entity.Notifications;
import org.example.notificationservice.repository.NotificationsRepository;
import org.example.notificationservice.utils.TimeUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@Slf4j
public class NotificationsServiceImpl implements NotificationsService {
    private final NotificationsRepository notificationsRepository;

    public NotificationsServiceImpl(NotificationsRepository notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }

    @Override
    public List<NotificationDto> findAll(Long userId) {
        List<Notifications> allByUserId = notificationsRepository.findAllByUserId(userId);
        return allByUserId.stream()
                .map(this::convertToDto)
                .toList();
    }

    private NotificationDto convertToDto(Notifications notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .timeAgo(TimeUtils.formatTimeAgo(notification.getCreatedAt())) // Utilisation de TimeUtils
                .read(notification.isRead())
                .link(notification.getLink())
                .build();
    }

    @Override
    public void save(Notifications notifications) {
        notifications.setCreatedAt(LocalDateTime.now());
        notificationsRepository.save(notifications);
        System.out.println("Notifications saved!!!");
    }

    @Override
    public Notifications send(Notifications notifications) {
        return null;
    }

    @Override
    public boolean markAsRead(Long id) {
        Notifications notifications1 = notificationsRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification with id " + id + " not found"));
        notifications1.setRead(true);
        notificationsRepository.save(notifications1);
        return true;
    }
}