package org.example.trainingservice.client.users;

import org.example.trainingservice.dto.evaluation.Participant;
import org.example.trainingservice.dto.evaluation.TeamEvaluationDetailsForUserDto;
import org.example.trainingservice.dto.evaluation.UserDto;
import org.example.trainingservice.dto.plan.ParticipantForCancel;
import org.example.trainingservice.dto.plan.ParticipantForPresenceList;
import org.example.trainingservice.model.Approver;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Set;

@FeignClient(name = "AUTH-SERVICE", fallback = AuthServiceServiceClientFallback.class)
public interface AuthServiceClient {
    @GetMapping("/api/users/get/approver/{approverId}")
    Approver getApproverById(@PathVariable Long approverId);

    @GetMapping("/api/users/get/my-team/{managerId}")
    List<Long> getMyTeam(@PathVariable Long managerId);

    @GetMapping("/api/users/get/participant/{userId}")
    TeamEvaluationDetailsForUserDto getParticipant(@PathVariable Long userId);

    @PostMapping("/api/users/get/participants")
    List<Participant> getParticipants(@RequestBody List<Long> participantIds);

    @GetMapping("/api/users/get/user-role/{userId}")
    UserDto getUserById(@PathVariable Long userId);

    @PostMapping("/api/users/get/participants-names")
    List<ParticipantForCancel> getParticipantsNames(@RequestBody Set<Long> participantIds);

    @PostMapping("/api/users/get/participants-emails")
    List<ParticipantForCancel> getParticipantsEmail(@RequestBody Set<Long> participantIds);

    @PostMapping("/api/users/get/participants-details")
    List<ParticipantForPresenceList> getParticipantsDetails(@RequestBody Set<Long> participantIds);
}