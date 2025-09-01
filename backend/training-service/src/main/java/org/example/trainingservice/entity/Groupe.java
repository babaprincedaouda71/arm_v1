package org.example.trainingservice.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.enums.GroupeStatusEnums;
import org.example.trainingservice.enums.TrainingType;

import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Groupe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "need_id", nullable = false)
    @JsonManagedReference
    private Need need;

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

    private Long trainingId;

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
    private Trainer trainer;

    @Builder.Default
    private Boolean isAllFieldsFilled = false;
}