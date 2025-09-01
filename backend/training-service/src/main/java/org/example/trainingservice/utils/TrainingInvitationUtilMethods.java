package org.example.trainingservice.utils;

import org.example.trainingservice.dto.plan.TrainingInvitationDto;
import org.example.trainingservice.dto.plan.UserInvitationDto;
import org.example.trainingservice.entity.plan.TrainingInvitation;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class TrainingInvitationUtilMethods {
    public static List<TrainingInvitationDto> mapToTrainingInvitationDtos(List<TrainingInvitation> byTrainingGroupeId) {
        if (byTrainingGroupeId == null || byTrainingGroupeId.isEmpty()) {
            return Collections.emptyList();
        }
        return byTrainingGroupeId.stream()
                .map(TrainingInvitationUtilMethods::mapToTrainingInvitationDto)
                .collect(Collectors.toList());
    }

    private static TrainingInvitationDto mapToTrainingInvitationDto(TrainingInvitation trainingInvitation) {
        if (trainingInvitation == null) {
            return null;
        }

        return TrainingInvitationDto.builder()
                .id(trainingInvitation.getId())
                .userId(trainingInvitation.getUserId())
                .userFullName(trainingInvitation.getUserFullName())
                .userEmail(trainingInvitation.getUserEmail())
                .invitationDate(trainingInvitation.getInvitationDate())
                .status(trainingInvitation.getStatus().getDescription())
                .build();
    }

    public static List<UserInvitationDto> mapToUserInvitationDtos(List<TrainingInvitation> userInvitations) {
        if (userInvitations == null || userInvitations.isEmpty()) {
            return Collections.emptyList();
        }
        return userInvitations.stream()
                .map(TrainingInvitationUtilMethods::mapToUserInvitationDto)
                .collect(Collectors.toList());
    }

    public static UserInvitationDto mapToUserInvitationDto(TrainingInvitation trainingInvitation) {
        if (trainingInvitation == null) {
            return null;
        }
        return UserInvitationDto.builder()
                .id(trainingInvitation.getId())
                .trainingTheme(trainingInvitation.getTrainingTheme())
                .trainingId(trainingInvitation.getTrainingId())
                .participantCount(trainingInvitation.getParticipantCount())
                .invitationDate(trainingInvitation.getInvitationDate().toString())
                .status(trainingInvitation.getStatus().getDescription())
                .trainerName(trainingInvitation.getTrainerName())
                .location(trainingInvitation.getLocation())
                .city(trainingInvitation.getCity())
                .dates(trainingInvitation.getDates())
                .build();
    }
}