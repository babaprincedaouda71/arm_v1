package org.example.trainingservice.dto.plan.f4;

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
public class QuestionDto {
    private UUID questionId;
    private String type;
    private String text;
    private String comment;
    private List<String> options;
    private List<String> levels;
    private Boolean required;
}