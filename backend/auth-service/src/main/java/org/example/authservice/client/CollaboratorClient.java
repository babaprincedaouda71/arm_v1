package org.example.authservice.client;

import org.example.authservice.dto.AddCollaboratorRequest;
import org.example.authservice.dto.CompanyResponse;
import org.example.authservice.dto.CompanyTest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "COLLABORATOR-SERVICE")
public interface CollaboratorClient {
    @GetMapping("/api/collaborator/get/{id}")
    ResponseEntity<?> getCollaboratorById(@PathVariable("id") Long collaboratorId);

    @PostMapping("/api/collaborator/add-first")
    AddCollaboratorRequest addFirstCollaborator(@RequestBody AddCollaboratorRequest addCollaboratorRequest);
}