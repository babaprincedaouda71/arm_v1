package org.example.trainingservice.client.users;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.evaluation.Participant;
import org.example.trainingservice.dto.evaluation.TeamEvaluationDetailsForUserDto;
import org.example.trainingservice.dto.evaluation.UserDto;
import org.example.trainingservice.dto.plan.ParticipantForCancel;
import org.example.trainingservice.dto.plan.ParticipantForPresenceList;
import org.example.trainingservice.model.Approver;

import java.util.List;
import java.util.Set;

@Slf4j
public class AuthServiceServiceClientFallback implements AuthServiceClient {
    @Override
    public Approver getApproverById(Long approverId) {
        log.error("Error while calling getApproverById");
        return null;
    }

    @Override
    public List<Long> getMyTeam(Long managerId) {
        log.error("Error while calling getMyTeam");
        return List.of();
    }

    @Override
    public TeamEvaluationDetailsForUserDto getParticipant(Long userId) {
        log.error("Error while calling getParticipant");
        return null;
    }

    @Override
    public List<Participant> getParticipants(List<Long> participantIds) {
        log.error("Error while calling getParticipants");
        return List.of();
    }

    @Override
    public UserDto getUserById(Long userId) {
        log.error("Error while calling getUserById");
        return null;
    }

    @Override
    public List<ParticipantForCancel> getParticipantsNames(Set<Long> participantIds) {
        log.error("Error while calling getParticipantsNames");
        return List.of();
    }

    @Override
    public List<ParticipantForCancel> getParticipantsEmail(Set<Long> participantIds) {
        log.error("Error while calling getParticipantsEmail");
        return List.of();
    }

    @Override
    public List<ParticipantForPresenceList> getParticipantsDetails(Set<Long> participantIds) {
        log.error("Error while calling getParticipantsDetails");
        return List.of();
    }
}