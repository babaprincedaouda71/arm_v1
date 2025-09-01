package org.example.trainingservice.service.groups;

import org.example.trainingservice.dto.group.AddOrEditGroupParticipantsDto;
import org.springframework.http.ResponseEntity;

public interface GroupParticipantsService {
    ResponseEntity<?> addGroupParticipants(Long needId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto);

    ResponseEntity<?> editGroupParticipants(Long groupId, AddOrEditGroupParticipantsDto addOrEditGroupParticipantsDto);
}