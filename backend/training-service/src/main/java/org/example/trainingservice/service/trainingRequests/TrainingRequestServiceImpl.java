package org.example.trainingservice.service.trainingRequests;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.cacheService.UserCacheService;
import org.example.trainingservice.dto.trainingRequest.AddMyTrainingRequestDto;
import org.example.trainingservice.dto.trainingRequest.UpdateTeamRequestStatusDto;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.entity.TrainingRequest;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.enums.TrainingRequestStatus;
import org.example.trainingservice.exceptions.TrainingRequestNotFoundException;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.repository.TrainingRequestRepository;
import org.example.trainingservice.utils.SecurityUtils;
import org.example.trainingservice.utils.TrainingRequestUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class TrainingRequestServiceImpl implements TrainingRequestService {
    private final TrainingRequestRepository trainingRequestRepository;
    private final NeedRepository needRepository;
    private final UserCacheService userCacheService;

    public TrainingRequestServiceImpl(TrainingRequestRepository trainingRequestRepository, NeedRepository needRepository, UserCacheService userCacheService) {
        this.trainingRequestRepository = trainingRequestRepository;
        this.needRepository = needRepository;
        this.userCacheService = userCacheService;
    }

    @Override
    public ResponseEntity<?> getMyRequests(Long userId) {
        List<TrainingRequest> byCompanyIdAndId = trainingRequestRepository.findByCompanyIdAndRequesterId(SecurityUtils.getCurrentCompanyId(), userId);
        return ResponseEntity.ok(byCompanyIdAndId);
    }

    @Override
    public ResponseEntity<?> getTeamRequests(Long managerId) {
        List<TrainingRequest> trainingRequests = trainingRequestRepository.findByCompanyIdAndManagerId(SecurityUtils.getCurrentCompanyId(), managerId);
        return ResponseEntity.ok(TrainingRequestUtilMethods.mapToTeamRequestsDto(trainingRequests));
    }

    @Override
    public ResponseEntity<?> addNewRequest(AddMyTrainingRequestDto newRequest) {
        log.info("Adding new training request");
        TrainingRequest trainingRequest = TrainingRequestUtilMethods.mapToTrainingRequest(newRequest, SecurityUtils.getCurrentCompanyId());
        log.info("Finished adding new training request");
        return ResponseEntity.ok().body(trainingRequestRepository.save(trainingRequest));
    }

    @Override
    public ResponseEntity<?> updateTeamRequestStatus(Long approverId, UpdateTeamRequestStatusDto updateTeamRequestStatusDto) {
        log.info("Updating team request status");

        TrainingRequest trainingRequest = trainingRequestRepository.findTrainingRequestByCompanyIdAndId(SecurityUtils.getCurrentCompanyId(), updateTeamRequestStatusDto
                .getId()).orElseThrow(() ->
                new TrainingRequestNotFoundException("Training request not found with ID : " + updateTeamRequestStatusDto.getId(), null));

        if (Objects.equals(updateTeamRequestStatusDto.getStatus(), "Rejected")) {
            trainingRequest.setStatus(TrainingRequestStatus.Rejected);
            trainingRequestRepository.save(trainingRequest);
            return ResponseEntity.ok().build();
        }

        trainingRequest.setStatus(TrainingRequestStatus.valueOf(updateTeamRequestStatusDto.getStatus()));

        TrainingRequest save = trainingRequestRepository.save(trainingRequest);
        log.info("Finished updating team request status");

        log.info("Creating need from training request");
        log.info("Getting site, department ans domain");
        log.info("Approving user id : {} ", approverId);
        String approverName = userCacheService.getApproverName(approverId);
        log.info("Approver name : {} ", approverName);

        Need need = TrainingRequestUtilMethods.convertTrainingRequestToNeed(save, approverId);
        Need newNeed = needRepository.save(need);

        if (newNeed.getNumberOfGroup() > 0) {
            List<Groupe> groupes = new ArrayList<>();
            for (int i = 0; i < newNeed.getNumberOfGroup(); i++) {
                Groupe groupe = Groupe.builder()
                        .need(newNeed)
                        .companyId(SecurityUtils.getCurrentCompanyId())
                        .name("Groupe " + (i + 1))
                        .status(GroupeStatusEnums.DRAFT)
                        .build();
                groupes.add(groupe);
            }
            newNeed.setGroupes(groupes);
        }
        needRepository.save(newNeed);
        log.info("Finished creating need from training request");
        return ResponseEntity.ok().build();
    }
}