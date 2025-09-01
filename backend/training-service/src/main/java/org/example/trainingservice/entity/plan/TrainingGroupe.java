package org.example.trainingservice.entity.plan;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.example.trainingservice.entity.OCF;
import org.example.trainingservice.entity.TrainerForTrainingGroupe;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.enums.InvitationStatusEnum;
import org.example.trainingservice.enums.TrainingType;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingGroupe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id", nullable = false)
    @JsonManagedReference
    private Training training;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ocf_id")
    private OCF ocf;

    private Long companyId;

    private String name;

    private String startDate;

    private String endDate;

    private Integer participantCount;

    private Integer dayCount;

    private Float price;

    @Enumerated(EnumType.STRING)
    private TrainingType trainingType;

    private String trainingProvider;

    private Long internalTrainerId;

    private String trainerName;

    private List<Long> siteIds;

    private List<Long> departmentIds;

    private String location;

    private String city;

    private List<String> dates;

    private String morningStartTime;

    private String morningEndTime;

    private String afternoonStartTime;

    private String afternoonEndTime;

    private Set<Long> userGroupIds;

    private String targetAudience;

    private Integer managerCount;

    private Integer employeeCount;

    private Integer workerCount;

    private Integer temporaryWorkerCount;

    private String comment;

    @Enumerated(EnumType.STRING)
    private GroupeStatusEnums status;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    @JsonBackReference
    @ToString.Exclude
    private TrainerForTrainingGroupe trainer;

    @Builder.Default
    private Boolean isAllFieldsFilled = false;

    // Relation One-to-Many avec GroupeInvoice
    @OneToMany(mappedBy = "trainingGroupe",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<GroupeInvoice> invoices = new ArrayList<>();

    // Invitation
    @OneToMany(mappedBy = "trainingGroupe",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @Builder.Default
    private List<TrainingInvitation> invitations = new ArrayList<>();

    // Méthodes utilitaires pour la gestion des invitations
    public void addInvitation(TrainingInvitation invitation) {
        invitations.add(invitation);
        invitation.setTrainingGroupe(this);
    }

    public void removeInvitation(TrainingInvitation invitation) {
        invitations.remove(invitation);
        invitation.setTrainingGroupe(null);
    }

    // Méthodes pour obtenir des statistiques sur les invitations
    public long getAcceptedInvitationsCount() {
        return invitations.stream()
                .filter(inv -> inv.getStatus() == InvitationStatusEnum.ACCEPTED)
                .count();
    }

    public long getPendingInvitationsCount() {
        return invitations.stream()
                .filter(inv -> inv.getStatus() == InvitationStatusEnum.PENDING)
                .count();
    }

    public long getDeclinedInvitationsCount() {
        return invitations.stream()
                .filter(inv -> inv.getStatus() == InvitationStatusEnum.DECLINED)
                .count();
    }
}