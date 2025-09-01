package org.example.notificationservice.utils;

import java.time.Duration;
import java.time.LocalDateTime;

public class TimeUtils {
    public static String formatTimeAgo(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(dateTime, now);

        long seconds = duration.getSeconds();
        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (seconds < 60) {
            return "Il y a " + seconds + " seconde" + (seconds > 1 ? "s" : "");
        } else if (minutes < 60) {
            return "Il y a " + minutes + " minute" + (minutes > 1 ? "s" : "");
        } else if (hours < 24) {
            return "Il y a " + hours + " heure" + (hours > 1 ? "s" : "");
        } else {
            return "Il y a " + days + " jour" + (days > 1 ? "s" : "");
        }
    }
}