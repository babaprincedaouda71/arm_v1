package org.example.trainingservice.web.groups;

import org.example.trainingservice.dto.group.AddOrEditGroupExternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupInternalProviderDto;
import org.example.trainingservice.dto.group.AddOrEditGroupParticipantsDto;
import org.example.trainingservice.dto.group.AddOrEditGroupPlanningDto;
import org.example.trainingservice.service.GroupeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/needs/groups")
public class GroupController {
    private final GroupeService groupeService;

    public GroupController(GroupeService groupeService) {
        this.groupeService = groupeService;
    }

    @PostMapping("/duplicate/group/{id}")
    public ResponseEntity<?> duplicateGroup(@PathVariable Long id) {
        return groupeService.duplicateGroup(id);
    }

    @PostMapping("/add/groupPlanning/{needId}")
    public ResponseEntity<?> addGroupPlanning(@PathVariable Long needId, @RequestBody AddOrEditGroupPlanningDto addOrEditGroupPlanningDto) {
        return groupeService.addGroupPlanning(needId, addOrEditGroupPlanningDto);
    }

    @PutMapping("/edit/groupPlanning/{groupId}")
    public ResponseEntity<?> editGroupPlanning(@PathVariable Long groupId, @RequestBody AddOrEditGroupPlanningDto addOrEditGroupPlanningDto) {
        return groupeService.editGroupPlanning(groupId, addOrEditGroupPlanningDto);
    }

    @PostMapping("/add/groupParticipants/{needId}")
    public ResponseEntity<?> addGroupParticipants(@PathVariable Long needId, @RequestBody AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto) {
        return groupeService.addGroupParticipants(needId, addOrEditGroupParticipantsDto);
    }

    @PutMapping("/edit/groupParticipants/{groupId}")
    public ResponseEntity<?> editGroupParticipants(@PathVariable Long groupId, @RequestBody AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto) {
        return groupeService.editGroupParticipants(groupId, addOrEditGroupParticipantsDto);
    }

    @PostMapping("/add/groupInternalProvider/{needId}")
    public ResponseEntity<?> addGroupInternalProvider(@PathVariable Long needId, @RequestBody AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto) {
        return groupeService.addGroupInternalProvider(needId, addOrEditGroupInternalProviderDto);
    }

    @PutMapping("/edit/groupInternalProvider/{groupId}")
    public ResponseEntity<?> editGroupInternalProvider(@PathVariable Long groupId, @RequestBody AddOrEditGroupInternalProviderDto addOrEditGroupInternalProviderDto) {
        return groupeService.editGroupInternalProvider(groupId, addOrEditGroupInternalProviderDto);
    }

    @PostMapping("/add/groupExternalProvider/{needId}")
    public ResponseEntity<?> addGroupExternalProvider(@PathVariable Long needId, @RequestBody AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto) {
        return groupeService.addGroupExternalProvider(needId, addOrEditGroupExternalProviderDto);
    }

    @PutMapping("/edit/groupExternalProvider/{groupId}")
    public ResponseEntity<?> editGroupExternalProvider(@PathVariable Long groupId, @RequestBody AddOrEditGroupExternalProviderDto addOrEditGroupExternalProviderDto) {
        return groupeService.editGroupExternalProvider(groupId, addOrEditGroupExternalProviderDto);
    }

    @GetMapping("/get/groupToAddOrEdit/{groupId}")
    public ResponseEntity<?> getGroupToAddOrEdit(@PathVariable Long groupId) {
        return groupeService.getGroupToAddOrEdit(groupId);
    }

    @DeleteMapping("/delete/group/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long groupId) {
        return groupeService.deleteGroup(groupId);
    }

    @GetMapping("/get/getParticipants/{groupId}")
    public ResponseEntity<?> getParticipants(@PathVariable Long groupId) {
        return groupeService.getParticipants(groupId);
    }

    @DeleteMapping("/remove/groupParticipant/{groupeId}/{participantId}")
    public ResponseEntity<?> removeGroupeParticipant(@PathVariable Long groupeId, @PathVariable Long participantId) {
        return groupeService.removeGroupeParticipant(groupeId, participantId);
    }
}