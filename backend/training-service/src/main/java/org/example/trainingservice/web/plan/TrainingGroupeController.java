package org.example.trainingservice.web.plan;

import org.example.trainingservice.dto.group.AddOrEditGroupExternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupInternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupParticipantsDto;
import org.example.trainingservice.dto.group.AddOrEditGroupPlanningDto;
import org.example.trainingservice.dto.plan.SendInvitationDto;
import org.example.trainingservice.service.plan.TrainingGroupeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/plan/trainings/training-groups")
public class TrainingGroupeController {
    private final TrainingGroupeService trainingGroupeService;

    public TrainingGroupeController(TrainingGroupeService trainingGroupeService) {
        this.trainingGroupeService = trainingGroupeService;
    }

    @GetMapping("/getTrainingGroupToAddOrEdit/{groupId}")
    public ResponseEntity<?> getTrainingGroupToAddOrEdit(@PathVariable Long groupId) {
        return trainingGroupeService.getTrainingGroupToAddOrEdit(groupId);
    }

    @PostMapping("/add/groupPlanning/{trainingId}")
    public ResponseEntity<?> addGroupPlanning(@PathVariable UUID trainingId, @RequestBody AddOrEditGroupPlanningDto addOrEditGroupPlanningDto) {
        return trainingGroupeService.addGroupPlanning(trainingId, addOrEditGroupPlanningDto);
    }

    @PutMapping("/edit/groupPlanning/{groupId}")
    public ResponseEntity<?> editGroupPlanning(@PathVariable Long groupId, @RequestBody AddOrEditGroupPlanningDto addOrEditGroupPlanningDto) {
        return trainingGroupeService.editGroupPlanning(groupId, addOrEditGroupPlanningDto);
    }

    @PostMapping("/add/groupParticipants/{trainingId}")
    public ResponseEntity<?> addGroupParticipants(@PathVariable UUID trainingId, @RequestBody AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto) {
        return trainingGroupeService.addGroupParticipants(trainingId, addOrEditGroupParticipantsDto);
    }

    @PutMapping("/edit/groupParticipants/{groupId}")
    public ResponseEntity<?> editGroupParticipants(@PathVariable Long groupId, @RequestBody AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto) {
        return trainingGroupeService.editGroupParticipants(groupId, addOrEditGroupParticipantsDto);
    }

    @PostMapping("/add/groupInternalProvider/{trainingId}")
    public ResponseEntity<?> addGroupInternalProvider(@PathVariable UUID trainingId, @RequestBody AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto) {
        return trainingGroupeService.addGroupInternalProvider(trainingId, addOrEditGroupInternalProviderDto);
    }

    @PutMapping("/edit/groupInternalProvider/{groupId}")
    public ResponseEntity<?> editGroupInternalProvider(@PathVariable Long groupId, @RequestBody AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto) {
        return trainingGroupeService.editGroupInternalProvider(groupId, addOrEditGroupInternalProviderDto);
    }

    @PostMapping("/add/groupExternalProvider/{trainingId}")
    public ResponseEntity<?> addGroupExternalProvider(@PathVariable UUID trainingId, @RequestBody AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto) {
        return trainingGroupeService.addGroupExternalProvider(trainingId, addOrEditGroupExternalProviderDto);
    }

    @PutMapping("/edit/groupExternalProvider/{groupId}")
    public ResponseEntity<?> editGroupExternalProvider(@PathVariable Long groupId, @RequestBody AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto) {
        return trainingGroupeService.editGroupExternalProvider(groupId, addOrEditGroupExternalProviderDto);
    }

    @PostMapping("/send-invitations/{groupId}")
    public ResponseEntity<?> sendInvitations(@PathVariable Long groupId, @RequestBody SendInvitationDto sendInvitationDto) {
        return trainingGroupeService.sendInvitations(groupId, sendInvitationDto);
    }

    @GetMapping("/get/getParticipants/{groupId}")
    public ResponseEntity<?> getParticipantsForTrainingInvitation(@PathVariable Long groupId) {
        return trainingGroupeService.getParticipantsForTrainingInvitation(groupId);
    }

    @GetMapping("/get/getParticipantsForList/{groupId}")
    public ResponseEntity<?> getParticipantsForList(@PathVariable Long groupId) {
        return trainingGroupeService.getParticipantsForList(groupId);
    }

    @GetMapping("/get/getGroupDetailsForSendInvitationToTrainer/{groupId}")
    public ResponseEntity<?> getGroupDetailsForSendInvitationToTrainer(@PathVariable Long groupId) {
        return trainingGroupeService.getGroupDetailsForSendInvitationToTrainer(groupId);
    }

    @GetMapping("/get/getGroupDates/{groupId}")
    public ResponseEntity<?> getGroupDates(@PathVariable Long groupId) {
        return trainingGroupeService.getGroupDates(groupId);
    }

    @GetMapping("/get/planning/{userId}")
    public ResponseEntity<?> getUserPlanning(@PathVariable Long userId) {
        return trainingGroupeService.getUserPlanning(userId);
    }

    @GetMapping("/get/trainingHistory/{userId}")
    public ResponseEntity<?> getUserTrainingHistory(@PathVariable Long userId) {
        return trainingGroupeService.getUserTrainingHistory(userId);
    }
}