package org.example.trainingservice.service.groups;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.group.AddOrEditGroupPlanningDto;
import org.example.trainingservice.dto.group.GroupToAddOrEditDto;
import org.example.trainingservice.dto.need.DepartmentDto;
import org.example.trainingservice.dto.need.SiteDto;
import org.example.trainingservice.entity.Groupe;
import org.example.trainingservice.entity.Need;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.exceptions.GroupeNotFoundException;
import org.example.trainingservice.exceptions.NeedNotFoundException;
import org.example.trainingservice.repository.GroupeRepository;
import org.example.trainingservice.repository.NeedRepository;
import org.example.trainingservice.service.completion.CompletionUtilMethods;
import org.example.trainingservice.service.plan.GroupeCompletionService;
import org.example.trainingservice.utils.GroupUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Slf4j
public class GroupPlanningServiceImpl implements GroupPlanningService {
    private final GroupeRepository groupeRepository;
    private final NeedRepository needRepository;
    private final GroupeCompletionService groupeCompletionService;
    private final CompletionUtilMethods completionUtilMethods;

    public GroupPlanningServiceImpl(
            GroupeRepository groupeRepository,
            NeedRepository needRepository,
            GroupeCompletionService groupeCompletionService,
            CompletionUtilMethods completionUtilMethods
    ) {
        this.groupeRepository = groupeRepository;
        this.needRepository = needRepository;
        this.groupeCompletionService = groupeCompletionService;
        this.completionUtilMethods = completionUtilMethods;
    }

    @Override
    public ResponseEntity<?> addGroupPlanning(Long needId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto) {
        Need need = needRepository.findById(needId).orElseThrow(() -> new NeedNotFoundException("Need not found with ID : " + needId, null));

        // Création du groupe
        Groupe groupe = Groupe.builder()
                .need(need)
                .siteIds(addOrEditGroupPlanningDto.getSite().stream().map(SiteDto::getId).collect(Collectors.toList()))
                .departmentIds(addOrEditGroupPlanningDto.getDepartment().stream().map(DepartmentDto::getId).collect(Collectors.toList()))
                .location(addOrEditGroupPlanningDto.getLocation())
                .city(addOrEditGroupPlanningDto.getCity())
                .dates(addOrEditGroupPlanningDto.getDates())
                .morningStartTime(addOrEditGroupPlanningDto.getMorningStartTime())
                .morningEndTime(addOrEditGroupPlanningDto.getMorningEndTime())
                .afternoonStartTime(addOrEditGroupPlanningDto.getAfternoonStartTime())
                .afternoonEndTime(addOrEditGroupPlanningDto.getAfternoonEndTime())
                .name("Groupe " + ((need.getNumberOfGroup()) + 1))
                .dayCount(addOrEditGroupPlanningDto.getDates().size())
                .status(GroupeStatusEnums.DRAFT)
                .build();

        // Vérification si le groupe est complet
        groupe = groupeCompletionService.updateCompletionStatus(groupe);

        Groupe save = groupeRepository.save(groupe);

        need.setNumberOfGroup(need.getNumberOfGroup() + 1);
        need.setSiteIds(groupe.getSiteIds());
        need.setSiteNames(addOrEditGroupPlanningDto.getSite().stream().map(SiteDto::getLabel).collect(Collectors.toList()));
        need.setDepartmentIds(groupe.getDepartmentIds());
        need.setDepartmentNames(addOrEditGroupPlanningDto.getDepartment().stream().map(DepartmentDto::getName).collect(Collectors.toList()));
        needRepository.save(need);

        // Vérifier la complétion du besoin
        completionUtilMethods.checkAndUpdateNeedCompletion(save);

        GroupToAddOrEditDto groupToAddOrEditDto = GroupUtilMethods.convertToGroupToAddOrEditDto(save);
        return ResponseEntity.ok().body(groupToAddOrEditDto);
    }

    @Override
    public ResponseEntity<?> editGroupPlanning(Long groupId, AddOrEditGroupPlanningDto addOrEditGroupPlanningDto) {
        Groupe groupe = groupeRepository.findById(groupId).orElseThrow(() -> new GroupeNotFoundException("Groupe not found with ID : " + groupId, null));
        Need need = groupe.getNeed();
        groupe.setSiteIds(addOrEditGroupPlanningDto.getSite().stream().map(SiteDto::getId).collect(Collectors.toList()));
        groupe.setDepartmentIds(addOrEditGroupPlanningDto.getDepartment().stream().map(DepartmentDto::getId).collect(Collectors.toList()));
        groupe.setLocation(addOrEditGroupPlanningDto.getLocation());
        groupe.setCity(addOrEditGroupPlanningDto.getCity());
        groupe.setDates(addOrEditGroupPlanningDto.getDates());
        groupe.setMorningStartTime(addOrEditGroupPlanningDto.getMorningStartTime());
        groupe.setMorningEndTime(addOrEditGroupPlanningDto.getMorningEndTime());
        groupe.setAfternoonStartTime(addOrEditGroupPlanningDto.getAfternoonStartTime());
        groupe.setAfternoonEndTime(addOrEditGroupPlanningDto.getAfternoonEndTime());
        groupe.setDayCount(addOrEditGroupPlanningDto.getDates().size());

        // Vérification si le groupe est complet
        groupe = groupeCompletionService.updateCompletionStatus(groupe);

        Groupe save = groupeRepository.save(groupe);

        need.setSiteIds(groupe.getSiteIds());
        need.setDepartmentIds(groupe.getDepartmentIds());
        need.setSiteNames(addOrEditGroupPlanningDto.getSite().stream().map(SiteDto::getLabel).collect(Collectors.toList()));
        need.setDepartmentNames(addOrEditGroupPlanningDto.getDepartment().stream().map(DepartmentDto::getName).collect(Collectors.toList()));
        needRepository.save(need);

        // Vérifier la complétion du besoin
        completionUtilMethods.checkAndUpdateNeedCompletion(save);

        return ResponseEntity.ok().body(GroupUtilMethods.convertToGroupToAddOrEditDto(save));
    }
}