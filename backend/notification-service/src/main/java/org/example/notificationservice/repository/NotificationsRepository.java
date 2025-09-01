package org.example.notificationservice.repository;

import org.example.notificationservice.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationsRepository extends JpaRepository<Notifications, Long> {
    List<Notifications> findAllByUserId(Long userId);
}