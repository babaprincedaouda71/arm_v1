package org.example.authservice.utils;

import org.example.authservice.dto.ApproverDto;
import org.example.authservice.dto.TrainersDto;
import org.example.authservice.dto.user.CampaignEvaluationParticipantsDto;
import org.example.authservice.dto.user.MyProfileDto;
import org.example.authservice.dto.user.PersonalInfos;
import org.example.authservice.dto.user.ProfessionalInfos;
import org.example.authservice.entity.User;
import org.example.authservice.exceptions.UserNotFoundException;
import org.example.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserUtilMethods {
    private static UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        UserUtilMethods.userRepository = userRepository;
    }

    public static List<TrainersDto> mapToTrainersDto(List<User> trainers) {
        return trainers.stream()
                .map(user -> TrainersDto.builder()
                        .id(user.getId())
                        .name(user.getFirstName() + " " + user.getLastName())
                        .build())
                .collect(Collectors.toList());
    }

    public static TrainersDto mapToTrainerDto(User user) {
        return TrainersDto.builder()
                .id(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .build();
    }

    public static MyProfileDto mapToMyProfileDto(User user) {
        MyProfileDto myProfileDto = new MyProfileDto();
        myProfileDto.setId(user.getId());
        myProfileDto.setCompanyId(user.getCompanyId());
        myProfileDto.setCreationDate(user.getCreationDate());
        myProfileDto.setPersonalInfos(PersonalInfos.builder()
                .fullName(user.getFirstName() + " " + user.getLastName())
                .gender(user.getGender())
                .birthDate(user.getBirthDate())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .cin(user.getCin())
                .build());
        myProfileDto.setProfessionalInfos(ProfessionalInfos.builder()
                .collaboratorCode(user.getCollaboratorCode())
                .hiringDate(user.getHiringDate())
                .department(user.getDepartment())
                .position(user.getPosition())
                .socialSecurityNumber(user.getSocialSecurityNumber())
                .certificates(List.of("AWS Certificates Developer", "React Advanced", "Scrum Master"))
                .competences(List.of("React", "Node.js", "Typescript", "AWS"))
                .build());
        return myProfileDto;
    }

    public static ApproverDto mapToApproverDto(User user) {
        return ApproverDto.builder()
                .id(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .build();
    }

    public static CampaignEvaluationParticipantsDto mapToCampaignEvaluationParticipantsDto(User user) {
        String managerName = "Pas de manager";
        Long managerId = user.getManagerId();
        if (managerId != null) {
            User manager = userRepository.findById(managerId)
                    .orElseThrow(() -> new UserNotFoundException("Manager introuvable pour l'utilisateur avec l'ID : " + user.getId(), null));
            managerName = manager.getFirstName() + " " + manager.getLastName();
        }

        return CampaignEvaluationParticipantsDto.builder()
                .id(user.getId())
                .collaboratorCode(user.getCollaboratorCode())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .position(user.getPosition())
                .level("") // Tu peux adapter ceci si tu as l'information du level
                .manager(managerName)
                .department(user.getDepartment())
                .groupe(user.getGroupe().getName()) // J'ai ajouté le groupe ici car il était dans l'autre DTO
                .build();
    }
}