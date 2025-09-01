package org.example.notificationservice.web;

import org.example.notificationservice.dto.NotificationDto;
import org.example.notificationservice.entity.Notifications;
import org.example.notificationservice.service.NotificationsService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {
    private final NotificationsService notificationsService;

    public NotificationsController(NotificationsService notificationsService) {
        this.notificationsService = notificationsService;
    }

    @GetMapping("/get/all/{userId}")
    public List<NotificationDto> getAll(@PathVariable Long userId) {
        return notificationsService.findAll(userId);
    }

    @PostMapping("/add")
    public void save(@RequestBody Notifications notifications) {
        notificationsService.save(notifications);
    }

    @PutMapping("/markAsRead/{id}")
    public boolean markAsRead(@PathVariable Long id) {
        return notificationsService.markAsRead(id);
    }

//    @GetMapping("/notifs")
//    public SseEmitter streamNotifications() {
//        SseEmitter emitter = new SseEmitter();
//        ExecutorService executorService = Executors.newSingleThreadExecutor();
//        executorService.execute(() -> {
//            try {
//                for (int i = 0; i < 10; i++) {
//                    emitter.send("Nouvelle notification" + i, MediaType.TEXT_PLAIN);
//                    Thread.sleep(600);
//                }
//                emitter.complete();
//            } catch (IOException | InterruptedException e) {
//                emitter.completeWithError(e);
//            }
//        });
//        return emitter;
//    }
}