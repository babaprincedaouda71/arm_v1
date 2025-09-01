package org.example.trainingservice.repository;

import org.example.trainingservice.entity.TrainerForTrainingGroupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerForTrainingGroupeRepository extends JpaRepository<TrainerForTrainingGroupe, Long> {
    TrainerForTrainingGroupe findByEmail(String email);

    Optional<TrainerForTrainingGroupe> findByNameAndEmail(String externalTrainerName, String externalTrainerEmail);
}