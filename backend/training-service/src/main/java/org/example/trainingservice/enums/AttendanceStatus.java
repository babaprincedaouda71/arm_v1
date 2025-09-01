package org.example.trainingservice.enums;

import lombok.Getter;

@Getter
public enum AttendanceStatus {
    ABSENT("Absent"),
    PRESENT("Présent");

    private final String description;

    AttendanceStatus(String description) {
        this.description = description;
    }

}