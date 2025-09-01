package org.example.authservice.web;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.authservice.dto.user.*;
import org.example.authservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal connectedUser) {
        userService.changePassword(request, connectedUser);
        return ResponseEntity.ok().body("Password updated successfully.");
    }

    @GetMapping("/get/all")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> getAllUsers(Principal connectedUser) {
        return userService.getAllUsers();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updateUserStatus(@Valid @RequestBody UpdateStatusRequest request) {
        return userService.updateStatus(request);
    }

    @PutMapping("/change-role")
    public ResponseEntity<?> changeRole(@Valid @RequestBody ChangeRoleRequest request) {
        return userService.changeRole(request);
    }

    @PutMapping("/update-manager")
    public ResponseEntity<?> updateManager(@Valid @RequestBody UpdateManagerRequest request) {
        return userService.updateManager(request);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importCollaborators(@RequestBody List<UserImportRequest> collaborators) {
        return userService.importCollaborators(collaborators);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody UserDetailsRequest request) {
        return userService.addUser(request);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDetailsRequest request) {
        return userService.updateUser(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @PutMapping("/update-profile/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody UserDetailsRequest request) {
        return userService.updateProfile(id, request);
    }

    @GetMapping("/trainers/get/all")
    public ResponseEntity<?> getAllTrainers() {
        return userService.getAllTrainers();
    }

    @GetMapping("/trainers/get/trainerName/{trainerId}")
    public ResponseEntity<?> getTrainerName(@PathVariable Long trainerId) {
        return userService.getTrainerName(trainerId);
    }

    @GetMapping("/get/my-profile/{userId}")
    public ResponseEntity<?> getMyProfile(@PathVariable Long userId) {
        log.info("Getting my-profile for user {}", userId);
        return userService.getMyProfile(userId);
    }

    @GetMapping("/get/approver/{approverId}")
    public ResponseEntity<?> getApproverById(@PathVariable Long approverId) {
        log.warn("Arriving request to get approver by id {} ", approverId);
        return userService.getApproverById(approverId);
    }

    @GetMapping("/campaign-evaluation/get/participants")
    public ResponseEntity<?> getCampaignEvaluationParticipants() {
        return userService.getCampaignEvaluationParticipants();
    }

    @GetMapping("/get/my-team/{managerId}")
    public ResponseEntity<?> getMyTeamIds(@PathVariable Long managerId) {
        return userService.getMyTeamIds(managerId);
    }

    @GetMapping("/get/participant/{userId}")
    public ResponseEntity<?> getParticipant(@PathVariable Long userId) {
        return userService.getTeamEvaluationParticipant(userId);
    }

    @PostMapping("/get/participants")
    public ResponseEntity<?> getParticipants(@RequestBody List<Long> participantIds) {
        return userService.fetchCampaignEvaluationParticipants(participantIds);
    }

    @GetMapping("/get/user-role/{userId}")
    public ResponseEntity<?> getUserRole(@PathVariable Long userId) {
        return userService.getUserRole(userId);
    }

    @PostMapping("/get/participants-names")
    public ResponseEntity<?> getParticipantsNames(@RequestBody Set<Long> participantIds) {
        return userService.getParticipantsNames(participantIds);
    }

    @PostMapping("/get/participants-emails")
    public ResponseEntity<?> getParticipantsEmails(@RequestBody Set<Long> participantIds) {
        return userService.getParticipantsEmails(participantIds);
    }

    @PostMapping("/get/participants-details")
    public ResponseEntity<?> getParticipantsDetails(@RequestBody Set<Long> participantIds) {
        return userService.getParticipantsDetails(participantIds);
    }
}