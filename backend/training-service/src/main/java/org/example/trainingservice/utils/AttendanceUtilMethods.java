package org.example.trainingservice.utils;

import org.example.trainingservice.dto.plan.attendance.AttendanceListPerDateDto;
import org.example.trainingservice.entity.plan.attendance.AttendanceRecord;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class AttendanceUtilMethods {

    public static List<AttendanceListPerDateDto> mapToAttendanceListDtos(List<AttendanceRecord> attendanceRecords) {
        if (attendanceRecords == null || attendanceRecords.isEmpty()) {
            return Collections.emptyList();
        }
        return attendanceRecords.stream()
                .map(AttendanceUtilMethods::mapToAttendanceListDto)
                .collect(Collectors.toList());
    }

    public static AttendanceListPerDateDto mapToAttendanceListDto(AttendanceRecord attendanceRecord) {
        if (attendanceRecord == null) {
            return null;
        }

        return AttendanceListPerDateDto.builder()
                .id(attendanceRecord.getId())
                .userId(attendanceRecord.getUserId())
                .userFullName(attendanceRecord.getUserFullName())
                .userEmail(attendanceRecord.getUserEmail())
                .status(attendanceRecord.getStatus().getDescription())
                .build();
    }
}