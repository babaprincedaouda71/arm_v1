package org.example.trainingservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.trainingservice.entity.plan.TrainingGroupe;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerForTrainingGroupe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

//    private Byte[] cv;

    @OneToMany(mappedBy = "trainer")
    @JsonBackReference
    private List<TrainingGroupe> groupesAnimated;
}