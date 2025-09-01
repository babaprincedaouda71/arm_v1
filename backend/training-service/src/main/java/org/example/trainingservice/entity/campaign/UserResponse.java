package org.example.trainingservice.entity.campaign;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.enums.EvaluationSource;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    @Id
    @GeneratedValue
    private UUID id;

    private Long companyId;

    private Long userId;

    private UUID campagneEvaluationId;

    private UUID groupeEvaluationId;

    private UUID questionnaireId;
    private UUID questionId;

    private String responseType; // Type de la question

    @Column(columnDefinition = "TEXT")
    private String textResponse; // Pour les questions de type texte

    private String commentResponse; // Pour les questions de type commentaire

    private Integer scoreResponse; // Pour les questions de type score

    private Integer ratingResponse; // Pour les questions de type notation

    @ElementCollection
    private List<String> multipleChoiceResponse; // Pour les questions de type checkbox et réponses multiples

    private String singleChoiceResponse; // Pour les questions à réponse unique

    private String singleLevelChoiceResponse;

    private String status;
    private Integer progression;
    private LocalDate startDate;
    private LocalDate lastModifiedDate;
    private UUID campaignEvaluationId;

    private Boolean isSentToManager;

    private Boolean isSentToAdmin;

    @Enumerated(EnumType.STRING)
    private EvaluationSource evaluationSource;
}