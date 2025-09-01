package org.example.notificationservice.repository;

import org.example.notificationservice.entity.EmailNotificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends JpaRepository<EmailNotificationRequest, Long> {
}