package org.example.trainingservice.dto.evaluation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserQuestionsResponsesDto {
    private UUID id;
    private String category;
    private String title;
    private String type;
    private String description;
    private String creationDate;
    private String startDate;
    private Integer progress;
    private List<QuestionDto> questions;
    private Boolean isSentToAdmin;
    private List<GetUserResponsesDto> responses;
}