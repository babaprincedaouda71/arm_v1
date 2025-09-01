package org.example.trainingservice.repository;

import org.example.trainingservice.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Trainer findByEmail(String email);

    Optional<Trainer> findByNameAndEmail(String externalTrainerName, String externalTrainerEmail);
}