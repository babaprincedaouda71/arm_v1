package org.example.trainingservice.exceptions.plan.attendance;

public class AttendanceListNotFoundException extends RuntimeException {
    private String field;
    public AttendanceListNotFoundException(String listeNonTrouvée) {
    }
}