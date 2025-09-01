package org.example.trainingservice.service.plan.attendance;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.client.users.AuthServiceClient;
import org.example.trainingservice.dto.plan.ParticipantForCancel;
import org.example.trainingservice.dto.plan.attendance.*;
import org.example.trainingservice.entity.plan.TrainingGroupe;
import org.example.trainingservice.entity.plan.attendance.AttendanceList;
import org.example.trainingservice.entity.plan.attendance.AttendanceRecord;
import org.example.trainingservice.enums.AttendanceStatus;
import org.example.trainingservice.exceptions.TrainingGroupeNotFoundException;
import org.example.trainingservice.exceptions.plan.attendance.AttendanceListNotFoundException;
import org.example.trainingservice.exceptions.plan.attendance.AttendanceRecordNotFoundException;
import org.example.trainingservice.repository.TrainingInvitationRepository;
import org.example.trainingservice.repository.plan.TrainingGroupeRepository;
import org.example.trainingservice.repository.plan.attendance.AttendanceListRepository;
import org.example.trainingservice.repository.plan.attendance.AttendanceRecordRepository;
import org.example.trainingservice.service.plan.FileStorageService;
import org.example.trainingservice.utils.AttendanceUtilMethods;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceListRepository attendanceListRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final TrainingGroupeRepository trainingGroupeRepository;
    private final TrainingInvitationRepository trainingInvitationRepository;
    private final AuthServiceClient authServiceClient;
    private final FileStorageService fileStorageService; // Injection directe de votre service existant


    public AttendanceServiceImpl(
            AttendanceListRepository attendanceListRepository,
            AttendanceRecordRepository attendanceRecordRepository,
            TrainingGroupeRepository trainingGroupeRepository,
            TrainingInvitationRepository trainingInvitationRepository,
            AuthServiceClient authServiceClient, FileStorageService fileStorageService
    ) {
        this.attendanceListRepository = attendanceListRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.trainingGroupeRepository = trainingGroupeRepository;
        this.trainingInvitationRepository = trainingInvitationRepository;
        this.authServiceClient = authServiceClient;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public ResponseEntity<?> saveAttendanceList(SaveAttendanceListRequest request) {
        try {
            log.info("Saving attendance list for group {} on date {}",
                    request.getGroupId(), request.getAttendanceDate());

            // 1. Valider les données d'entrée
            validateSaveRequest(request);

            // 2. Récupérer le groupe de formation
            TrainingGroupe groupe = getTrainingGroupe(request.getGroupId());

            // 3. Valider que la date fait partie des dates de formation
            validateAttendanceDate(groupe, request.getAttendanceDate());

            // 4. Supprimer l'ancienne liste si elle existe
            deleteExistingAttendanceList(request.getGroupId(),
                    request.getAttendanceDate(),
                    request.getListType());

            // 5. Récupérer les détails des participants via leurs IDs
            List<ParticipantForAttendance> participants =
                    getParticipantDetails(request.getParticipantIds());

            if (participants.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Aucun participant trouvé");
            }

            // 6. Créer la nouvelle AttendanceList avec le token fourni
            AttendanceList attendanceList = createAttendanceListFromRequest(groupe, request);
            attendanceList = attendanceListRepository.save(attendanceList);

            // 7. Créer les AttendanceRecord (statut ABSENT par défaut)
            createAttendanceRecords(attendanceList, participants);

            // 8. Sauvegarder le PDF dans MinIO
            String pdfPath = savePDFToStorage(attendanceList, request.getPdfFile());

            // 9. Mettre à jour le chemin du PDF
            attendanceList.setPdfFilePath(pdfPath);
            attendanceListRepository.save(attendanceList);

            log.info("Attendance list saved successfully with {} participants",
                    participants.size());

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Liste de présence sauvegardée avec succès",
                            "qrCodeToken", attendanceList.getQrCodeToken(),
                            "participantsCount", participants.size()
                    ));

        } catch (Exception e) {
            log.error("Error saving attendance list", e);
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la sauvegarde de la liste de présence");
        }
    }

    @Override
    public ResponseEntity<AttendanceListDto> getAttendanceListByToken(String qrCodeToken) {
        try {
            log.info("Retrieving attendance list by token: {}", qrCodeToken);

            // 1. Récupérer la liste par token
            AttendanceList attendanceList = attendanceListRepository
                    .findByQrCodeToken(qrCodeToken)
                    .orElseThrow(() -> new AttendanceListNotFoundException("Liste non trouvée"));

            // 2. Valider que c'est le bon jour (date actuelle = date de formation)
            LocalDate today = LocalDate.now();
            if (!today.equals(attendanceList.getAttendanceDate())) {
                return ResponseEntity.badRequest()
                        .build(); // Ou un message d'erreur approprié
            }

            // 3. Convertir en DTO
            AttendanceListDto dto = convertToAttendanceListDto(attendanceList);

            return ResponseEntity.ok(dto);

        } catch (AttendanceListNotFoundException e) {
            log.warn("Attendance list not found: {}", qrCodeToken);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retrieving attendance list by token", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<QRScanResponseDto> scanQRCode(String qrCodeToken) {
        try {
            log.info("Scanning QR code: {}", qrCodeToken);

            // 1. Récupérer la liste par token
            Optional<AttendanceList> attendanceListOpt = attendanceListRepository
                    .findByQrCodeToken(qrCodeToken);

            if (attendanceListOpt.isEmpty()) {
                return ResponseEntity.ok(QRScanResponseDto.builder()
                        .valid(false)
                        .message("QR Code invalide ou expiré")
                        .errorCode("INVALID_TOKEN")
                        .build());
            }

            AttendanceList attendanceList = attendanceListOpt.get();

            // 2. Valider que c'est le bon jour
            LocalDate today = LocalDate.now();
            if (!today.equals(attendanceList.getAttendanceDate())) {
                return ResponseEntity.ok(QRScanResponseDto.builder()
                        .valid(false)
                        .message("Cette liste de présence n'est accessible que le " +
                                attendanceList.getAttendanceDate().toString())
                        .errorCode("WRONG_DATE")
                        .build());
            }

            // 3. Convertir en DTO pour la réponse
            AttendanceListDto listDto = convertToAttendanceListDto(attendanceList);

            return ResponseEntity.ok(QRScanResponseDto.builder()
                    .valid(true)
                    .message("Accès autorisé à la liste de présence")
                    .attendanceList(listDto)
                    .build());

        } catch (Exception e) {
            log.error("Error scanning QR code: {}", qrCodeToken, e);
            return ResponseEntity.ok(QRScanResponseDto.builder()
                    .valid(false)
                    .message("Erreur lors du scan du QR code")
                    .errorCode("SCAN_ERROR")
                    .build());
        }
    }

    @Override
    @Transactional
    public ResponseEntity<MarkAttendanceResponseDto> markAttendance(MarkAttendanceRequest request) {
        try {
            log.info("Marking attendance for user {} with status {}",
                    request.getUserId(), request.getStatus());

            // 1. Récupérer la liste par token
            AttendanceList attendanceList = attendanceListRepository
                    .findByQrCodeToken(request.getQrCodeToken())
                    .orElseThrow(() -> new AttendanceListNotFoundException("Liste non trouvée"));

            // 2. Valider que c'est le bon jour
            LocalDate today = LocalDate.now();
            if (!today.equals(attendanceList.getAttendanceDate())) {
                return ResponseEntity.badRequest()
                        .body(MarkAttendanceResponseDto.builder()
                                .success(false)
                                .message("Impossible de marquer la présence en dehors du jour de formation")
                                .build());
            }

            // 3. Récupérer l'enregistrement de présence
            AttendanceRecord record = attendanceRecordRepository
                    .findByAttendanceList_IdAndUserId(attendanceList.getId(), request.getUserId())
                    .orElseThrow(() -> new AttendanceRecordNotFoundException("Participant non trouvé"));

            // 4. Mettre à jour le statut
            AttendanceStatus newStatus = AttendanceStatus.valueOf(request.getStatus());
            if (newStatus == AttendanceStatus.PRESENT) {
                record.markAsPresent(request.getMarkedBy());
            } else {
                record.markAsAbsent(request.getMarkedBy());
            }

            AttendanceRecord savedRecord = attendanceRecordRepository.save(record);

            // 5. Convertir en DTO
            AttendanceRecordDto recordDto = convertToAttendanceRecordDto(savedRecord);

            // 6. Calculer le résumé mis à jour
            AttendanceListSummaryDto summaryDto = calculateListSummary(attendanceList);

            log.info("Attendance marked successfully for user {}", request.getUserId());

            return ResponseEntity.ok(MarkAttendanceResponseDto.builder()
                    .success(true)
                    .message("Présence marquée avec succès")
                    .updatedRecord(recordDto)
                    .listSummary(summaryDto)
                    .build());

        } catch (AttendanceListNotFoundException | AttendanceRecordNotFoundException e) {
            log.warn("Resource not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error marking attendance", e);
            return ResponseEntity.internalServerError()
                    .body(MarkAttendanceResponseDto.builder()
                            .success(false)
                            .message("Erreur lors du marquage de la présence")
                            .build());
        }
    }

    @Override
    public ResponseEntity<List<AttendanceListSummaryDto>> getGroupAttendanceLists(Long groupId) {
        try {
            log.info("Getting attendance lists for group {}", groupId);

            List<AttendanceList> attendanceLists = attendanceListRepository
                    .findByTrainingGroupeIdOrderByAttendanceDateDesc(groupId);

            List<AttendanceListSummaryDto> summaryDtos = attendanceLists.stream()
                    .map(this::convertToAttendanceListSummaryDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(summaryDtos);

        } catch (Exception e) {
            log.error("Error getting attendance lists for group {}", groupId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<AttendanceListExistsDto> checkAttendanceListExists(
            Long groupId, LocalDate date, String listType) {
        try {
            boolean exists = attendanceListRepository
                    .existsByGroupDateAndType(groupId, date, listType);

            if (exists) {
                Optional<AttendanceList> existingList = attendanceListRepository
                        .findByTrainingGroupeIdAndAttendanceDateAndListType(groupId, date, listType);

                return ResponseEntity.ok(AttendanceListExistsDto.builder()
                        .exists(true)
                        .existingListId(existingList.map(list -> list.getId().toString()).orElse(null))
                        .existingDate(date)
                        .message("Une liste de présence existe déjà pour cette date")
                        .build());
            } else {
                return ResponseEntity.ok(AttendanceListExistsDto.builder()
                        .exists(false)
                        .message("Aucune liste de présence pour cette date")
                        .build());
            }

        } catch (Exception e) {
            log.error("Error checking attendance list existence", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<?> downloadAttendancePDF(String attendanceListId) {
        try {
            log.info("Downloading PDF for attendance list: {}", attendanceListId);

            UUID listId = UUID.fromString(attendanceListId);
            AttendanceList attendanceList = attendanceListRepository.findById(listId)
                    .orElseThrow(() -> new AttendanceListNotFoundException("Liste non trouvée"));

            if (attendanceList.getPdfFilePath() == null) {
                return ResponseEntity.notFound().build();
            }

            // Récupérer le fichier depuis MinIO
            byte[] pdfBytes = fileStorageService.downloadFile(attendanceList.getPdfFilePath());

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition",
                            "attachment; filename=\"" + attendanceList.getPdfFileName() + "\"")
                    .body(pdfBytes);

        } catch (Exception e) {
            log.error("Error downloading PDF for attendance list: {}", attendanceListId, e);
            return ResponseEntity.internalServerError()
                    .body("Erreur lors du téléchargement du PDF");
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> deleteAttendanceList(String attendanceListId) {
        try {
            log.info("Deleting attendance list: {}", attendanceListId);

            UUID listId = UUID.fromString(attendanceListId);
            AttendanceList attendanceList = attendanceListRepository.findById(listId)
                    .orElseThrow(() -> new AttendanceListNotFoundException("Liste non trouvée"));

            // Supprimer le PDF de MinIO si il existe
            if (attendanceList.getPdfFilePath() != null) {
                fileStorageService.deleteFile(attendanceList.getPdfFilePath());
            }

            // Supprimer la liste (les records seront supprimés en cascade)
            attendanceListRepository.delete(attendanceList);

            log.info("Attendance list deleted successfully: {}", attendanceListId);

            return ResponseEntity.ok()
                    .body(Map.of("message", "Liste de présence supprimée avec succès"));

        } catch (AttendanceListNotFoundException e) {
            log.warn("Attendance list not found: {}", attendanceListId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting attendance list: {}", attendanceListId, e);
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la suppression de la liste de présence");
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> getAttendanceListPerDate(GetAttendancePerDateDto getAttendancePerDateDto) {
        log.info("Getting attendance list per date");

        Long groupId = getAttendancePerDateDto.getGroupId();
        String date = getAttendancePerDateDto.getDate();

        LocalDate attendanceDate = LocalDate.parse(date);

        Optional<AttendanceList> byTrainingGroupeIdAndAttendanceDate = attendanceListRepository.findByTrainingGroupeIdAndAttendanceDate(groupId, attendanceDate);
        if (byTrainingGroupeIdAndAttendanceDate.isPresent()) {
            AttendanceList attendanceList = byTrainingGroupeIdAndAttendanceDate.get();

            List<AttendanceRecord> attendanceRecords = attendanceList.getAttendanceRecords();

            List<AttendanceListPerDateDto> attendanceListPerDateDtos = AttendanceUtilMethods.mapToAttendanceListDtos(attendanceRecords);

            return ResponseEntity.ok(attendanceListPerDateDtos);
        }

        return ResponseEntity.notFound().build();
    }


    // ====================
    // MÉTHODES PRIVÉES UTILITAIRES
    // ====================

    private void validateSaveRequest(SaveAttendanceListRequest request) {
        if (request.getGroupId() == null) {
            throw new IllegalArgumentException("Group ID is required");
        }
        if (request.getAttendanceDate() == null) {
            throw new IllegalArgumentException("Attendance date is required");
        }
        if (request.getListType() == null || request.getListType().trim().isEmpty()) {
            throw new IllegalArgumentException("List type is required");
        }
        if (request.getQrCodeToken() == null || request.getQrCodeToken().trim().isEmpty()) {
            throw new IllegalArgumentException("QR code token is required");
        }
        if (request.getPdfFile() == null || request.getPdfFile().isEmpty()) {
            throw new IllegalArgumentException("PDF file is required");
        }
        if (request.getParticipantIds() == null || request.getParticipantIds().isEmpty()) {
            throw new IllegalArgumentException("Participant IDs are required");
        }
    }

    private TrainingGroupe getTrainingGroupe(Long groupId) {
        return trainingGroupeRepository.findById(groupId)
                .orElseThrow(() -> new TrainingGroupeNotFoundException("Groupe non trouvé", null));
    }

    private void validateAttendanceDate(TrainingGroupe groupe, LocalDate attendanceDate) {
        if (groupe.getDates() == null || groupe.getDates().isEmpty()) {
            throw new IllegalStateException("Aucune date de formation définie pour ce groupe");
        }

        boolean dateExists = groupe.getDates().stream()
                .anyMatch(dateStr -> {
                    try {
                        LocalDate formationDate = LocalDate.parse(dateStr);
                        return formationDate.equals(attendanceDate);
                    } catch (Exception e) {
                        return false;
                    }
                });

        if (!dateExists) {
            throw new IllegalArgumentException("La date spécifiée ne fait pas partie des dates de formation");
        }
    }

    private void deleteExistingAttendanceList(Long groupId, LocalDate date, String listType) {
        attendanceListRepository.findByTrainingGroupeIdAndAttendanceDateAndListType(
                groupId, date, listType
        ).ifPresent(existingList -> {
            log.info("Deleting existing attendance list: {}", existingList.getId());
            // Supprimer aussi le PDF de MinIO si nécessaire
            if (existingList.getPdfFilePath() != null) {
                try {
                    fileStorageService.deleteFile(existingList.getPdfFilePath());
                } catch (Exception e) {
                    log.warn("Could not delete existing PDF file: {}", existingList.getPdfFilePath(), e);
                }
            }
            attendanceListRepository.delete(existingList);
        });
    }

    private List<ParticipantForAttendance> getParticipantDetails(List<Long> participantIds) {
        try {
            // Utiliser l'API existante pour récupérer les détails des participants
            List<ParticipantForCancel> participants = authServiceClient
                    .getParticipantsEmail(new HashSet<>(participantIds));

            return participants.stream()
                    .map(this::convertToParticipantForAttendance)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting participant details for IDs: {}", participantIds, e);
            throw new RuntimeException("Impossible de récupérer les détails des participants", e);
        }
    }

    private AttendanceList createAttendanceListFromRequest(TrainingGroupe groupe, SaveAttendanceListRequest request) {
        return AttendanceList.builder()
                .trainingGroupe(groupe)
                .attendanceDate(request.getAttendanceDate())
                .listType(request.getListType())
                .qrCodeToken(request.getQrCodeToken()) // Utiliser le token fourni
                .pdfFileName(generatePdfFileName(groupe, request))
                .companyId(groupe.getCompanyId())
                .build();
    }

    private String generatePdfFileName(TrainingGroupe groupe, SaveAttendanceListRequest request) {
        return String.format("liste_presence_%s_%s_%s.pdf",
                request.getListType(),
                groupe.getName().replaceAll(" ", "_"),
                request.getAttendanceDate().toString());
    }

    private void createAttendanceRecords(AttendanceList attendanceList,
                                         List<ParticipantForAttendance> participants) {
        List<AttendanceRecord> records = participants.stream()
                .map(participant -> AttendanceRecord.builder()
                        .attendanceList(attendanceList)
                        .userId(participant.getUserId())
                        .userFullName(participant.getFullName())
                        .userEmail(participant.getEmail())
                        .userCode(participant.getCode())
                        .status(AttendanceStatus.ABSENT) // Par défaut
                        .build())
                .collect(Collectors.toList());

        attendanceRecordRepository.saveAll(records);
    }

    private String savePDFToStorage(AttendanceList attendanceList, MultipartFile pdfFile) {
        try {
            String fileName = attendanceList.getPdfFileName();
            String folderPath = "attendance-lists/" + attendanceList.getCompanyId() + "/" +
                    attendanceList.getAttendanceDate().getYear();

            return fileStorageService.uploadFile(pdfFile);

        } catch (Exception e) {
            log.error("Error saving PDF to storage", e);
            throw new RuntimeException("Erreur lors de la sauvegarde du PDF", e);
        }
    }

    // ====================
    // MÉTHODES DE CONVERSION DTO
    // ====================

    private AttendanceListDto convertToAttendanceListDto(AttendanceList attendanceList) {
        // Récupérer les records avec leurs statuts actuels
        List<AttendanceRecord> records = attendanceRecordRepository
                .findByAttendanceListIdOrderByUserFullName(attendanceList.getId());

        List<AttendanceRecordDto> recordDtos = records.stream()
                .map(this::convertToAttendanceRecordDto)
                .collect(Collectors.toList());

        // Calculer les compteurs
        long presentCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        long absentCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count();

        return AttendanceListDto.builder()
                .qrCodeToken(attendanceList.getQrCodeToken())
                .attendanceDate(attendanceList.getAttendanceDate())
                .groupName(attendanceList.getTrainingGroupe().getName())
                .trainingTheme(attendanceList.getTrainingGroupe().getTraining().getTheme())
                .listType(attendanceList.getListType())
                .listTypeDescription(getListTypeDescription(attendanceList.getListType()))
                .totalParticipants(records.size())
                .presentCount((int) presentCount)
                .absentCount((int) absentCount)
                .createdDate(attendanceList.getCreatedDate().toString())
                .pdfFileName(attendanceList.getPdfFileName())
                .attendanceRecords(recordDtos)
                .groupInfo(convertToTrainingGroupInfoDto(attendanceList.getTrainingGroupe()))
                .build();
    }

    private AttendanceRecordDto convertToAttendanceRecordDto(AttendanceRecord record) {
        return AttendanceRecordDto.builder()
                .recordId(record.getId().toString())
                .userId(record.getUserId())
                .userFullName(record.getUserFullName())
                .userCode(record.getUserCode())
                .userEmail(record.getUserEmail())
                .status(record.getStatus().name())
                .statusDescription(record.getStatus().getDescription())
                .markedDate(record.getMarkedDate() != null ? record.getMarkedDate().toString() : null)
                .canEdit(canEditAttendance(record.getAttendanceList().getAttendanceDate()))
                .build();
    }

    private AttendanceListSummaryDto convertToAttendanceListSummaryDto(AttendanceList attendanceList) {
        // Compter les statuts
        List<Object[]> statusCounts = attendanceRecordRepository
                .countByStatusForAttendanceList(attendanceList.getId());

        int totalParticipants = 0;
        int presentCount = 0;
        int absentCount = 0;

        for (Object[] count : statusCounts) {
            AttendanceStatus status = (AttendanceStatus) count[0];
            Long countValue = (Long) count[1];

            if (status == AttendanceStatus.PRESENT) {
                presentCount = countValue.intValue();
            } else if (status == AttendanceStatus.ABSENT) {
                absentCount = countValue.intValue();
            }
            totalParticipants += countValue.intValue();
        }

        double attendanceRate = totalParticipants > 0 ?
                (double) presentCount / totalParticipants * 100 : 0.0;

        return AttendanceListSummaryDto.builder()
                .attendanceListId(attendanceList.getId().toString())
                .attendanceDate(attendanceList.getAttendanceDate())
                .listType(attendanceList.getListType())
                .listTypeDescription(getListTypeDescription(attendanceList.getListType()))
                .totalParticipants(totalParticipants)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .attendanceRate(Math.round(attendanceRate * 100.0) / 100.0)
                .pdfFileName(attendanceList.getPdfFileName())
                .createdDate(attendanceList.getCreatedDate().toString())
                .canEdit(canEditAttendance(attendanceList.getAttendanceDate()))
                .build();
    }

    private AttendanceListSummaryDto calculateListSummary(AttendanceList attendanceList) {
        return convertToAttendanceListSummaryDto(attendanceList);
    }

    private TrainingGroupInfoDto convertToTrainingGroupInfoDto(TrainingGroupe groupe) {
        return TrainingGroupInfoDto.builder()
                .groupId(groupe.getId())
                .groupName(groupe.getName())
                .trainingTheme(groupe.getTraining().getTheme())
                .location(groupe.getLocation())
                .city(groupe.getCity())
                .formationDates(groupe.getDates())
                .trainerName(groupe.getTrainerName())
                .trainingType(groupe.getTrainingType() != null ? groupe.getTrainingType().name() : null)
                .build();
    }

    private ParticipantForAttendance convertToParticipantForAttendance(ParticipantForCancel participant) {
        return ParticipantForAttendance.builder()
                .userId(participant.getId())
                .fullName(participant.getName())
                .firstName(participant.getName().split(" ")[0]) // Approximation
                .lastName(participant.getName().contains(" ") ?
                        participant.getName().substring(participant.getName().indexOf(" ") + 1) : "")
                .email(participant.getEmail())
                // Les autres champs peuvent être ajoutés si disponibles dans ParticipantForCancel
                .build();
    }

    private String getListTypeDescription(String listType) {
        return switch (listType.toLowerCase()) {
            case "internal" -> "Liste interne";
            case "csf" -> "Liste CSF";
            default -> listType;
        };
    }

    private boolean canEditAttendance(LocalDate attendanceDate) {
        // On peut modifier seulement le jour de la formation
        return LocalDate.now().equals(attendanceDate);
    }
}