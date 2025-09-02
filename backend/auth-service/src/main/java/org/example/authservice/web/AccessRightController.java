package org.example.authservice.web;

import org.example.authservice.dto.GroupAccessRightsResponse;
import org.example.authservice.dto.UpdateAccessRightsRequest;
import org.example.authservice.dto.UserPermissionCheckRequest;
import org.example.authservice.dto.UserPermissionResponse;
import org.example.authservice.service.AccessRightService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/access-rights")
public class AccessRightController {

    private final AccessRightService accessRightService;

    public AccessRightController(AccessRightService accessRightService) {
        this.accessRightService = accessRightService;
    }

    /**
     * Récupère les droits d'accès d'un groupe pour un module spécifique
     */
    @GetMapping("/group/{groupeId}/module/{module}")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<GroupAccessRightsResponse> getGroupAccessRights(
            @PathVariable Long groupeId,
            @PathVariable String module) {

        GroupAccessRightsResponse response = accessRightService.getGroupAccessRights(groupeId, module);
        return ResponseEntity.ok(response);
    }

    /**
     * Met à jour les droits d'accès d'un groupe pour un module
     */
    @PutMapping("/update")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<GroupAccessRightsResponse> updateAccessRights(
            @RequestBody UpdateAccessRightsRequest request) {

        GroupAccessRightsResponse response = accessRightService.updateAccessRights(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Vérifie si un utilisateur a la permission pour une action
     */
    @PostMapping("/check-permission")
    public ResponseEntity<UserPermissionResponse> checkPermission(
            @RequestBody UserPermissionCheckRequest request) {

        UserPermissionResponse response = accessRightService.checkUserPermission(
                request.getUserId(), request.getModule(), request.getAction());
        return ResponseEntity.ok(response);
    }

    /**
     * Récupère tous les modules et actions disponibles
     */
    @GetMapping("/modules-actions")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<Map<String, Map<String, String>>> getAllModuleActions() {
        Map<String, Map<String, String>> moduleActions = accessRightService.getAllModuleActions();
        return ResponseEntity.ok(moduleActions);
    }

    /**
     * Supprime tous les droits d'accès d'un groupe
     */
    @DeleteMapping("/group/{groupeId}")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<Void> deleteGroupAccessRights(@PathVariable Long groupeId) {
        accessRightService.deleteGroupAccessRights(groupeId);
        return ResponseEntity.ok().build();
    }
}