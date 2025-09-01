package org.example.trainingservice.repository.evaluation;

import org.example.trainingservice.entity.campaign.UserResponse;
import org.example.trainingservice.enums.EvaluationSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserResponseRepository extends JpaRepository<UserResponse, UUID> {
    Optional<UserResponse> findByQuestionnaireId(UUID questionnaireId);

    List<UserResponse> findByUserIdAndQuestionnaireId(Long userId, UUID questionnaireId);

    Optional<UserResponse> findByUserIdAndQuestionnaireIdAndQuestionId(Long userId, UUID questionnaireId, UUID questionId);

    List<UserResponse> findByQuestionnaireIdAndUserIdIn(UUID id, List<Long> myTeamIds);

    List<UserResponse> findByQuestionnaireIdInAndUserIdIn(Collection<UUID> questionnaireIds, Collection<Long> userIds);

    List<UserResponse> findByQuestionnaireIdInAndUserIdInAndIsSentToAdmin(Collection<UUID> questionnaireIds, Collection<Long> userIds, Boolean isSentToAdmin);

    // NOUVELLES MÉTHODES pour GroupeEvaluation
    List<UserResponse> findByUserIdAndGroupeEvaluationId(Long userId, UUID groupeEvaluationId);

    // ✅ UTILISÉE dans processQuestionnaireForUser()
    List<UserResponse> findByUserIdAndQuestionnaireIdAndEvaluationSource(Long userId, UUID questionnaireId, EvaluationSource source);

    List<UserResponse> findByGroupeEvaluationIdAndUserIdIn(UUID groupeEvaluationId, List<Long> userIds);

    List<UserResponse> findByGroupeEvaluationIdIn(Collection<UUID> groupeEvaluationIds);

    List<UserResponse> findByUserIdAndEvaluationSource(Long userId, EvaluationSource source);

    List<UserResponse> findByGroupeEvaluationId(UUID groupeEvaluationId);
}