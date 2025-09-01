package org.example.authservice.service;

import jakarta.validation.Valid;
import org.example.authservice.dto.user.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;
import java.util.Set;

public interface UserService {
    ResponseEntity<?> changePassword(ChangePasswordRequest request, Principal connectedUser);

    ResponseEntity<?> getAllUsers();

    ResponseEntity<?> updateStatus(UpdateStatusRequest request);

    ResponseEntity<?> importCollaborators(List<UserImportRequest> collaborators);

    ResponseEntity<?> changeRole(@Valid ChangeRoleRequest request);

    ResponseEntity<?> updateManager(@Valid UpdateManagerRequest request);

    ResponseEntity<?> getUserById(Long id);

    ResponseEntity<?> addUser(UserDetailsRequest request);

    ResponseEntity<?> updateUser(Long id, UserDetailsRequest request);

    ResponseEntity<?> deleteUser(Long id);

    ResponseEntity<?> updateProfile(Long id, UserDetailsRequest request);

    ResponseEntity<?> getAllTrainers();

    ResponseEntity<?> getTrainerName(Long trainerId);

    ResponseEntity<?> getMyProfile(Long userId);

    ResponseEntity<?> getApproverById(Long approverId);

    ResponseEntity<?> getCampaignEvaluationParticipants();

    ResponseEntity<?> getMyTeamIds(Long managerId);

    ResponseEntity<?> getTeamEvaluationParticipant(Long userId);

    ResponseEntity<?> fetchCampaignEvaluationParticipants(List<Long> participantIds);

    ResponseEntity<?> getUserRole(Long userId);

    ResponseEntity<?> getParticipantsNames(Set<Long> participantIds);

    ResponseEntity<?> getParticipantsEmails(Set<Long> participantIds);

    ResponseEntity<?> getParticipantsDetails(Set<Long> participantIds);
}