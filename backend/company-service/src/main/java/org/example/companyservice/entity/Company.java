package org.example.companyservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "companies")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Raison sociale

    @Column(nullable = false)
    private String mainContactFirstName; // Nom de la personne qui crée le compte

    @Column(nullable = false)
    private String mainContactLastName; // Nom de la personne qui crée le compte

    @Column(nullable = false)
    private String mainContactRole; // Fonction de la personne

    @Column(nullable = false, unique = true)
    private String mainContactEmail; // Email professionnel

    @Column(nullable = false)
    private String mainContactPhone; // Téléphone professionnel

    private String employees; // Effectif

    private String sector; // Secteur d'activité

    private String legalContactFirstName; // Prénom contact légal

    private String legalContactLastName; // Nom contact légal

    private String legalContactRole; // Fonction du contact légal

    private String iceNumber; // ICE de l'entreprise

    private String cnssNumber; // CNSS de l'entreprise

    @Column(nullable = false)
    private boolean registrationCompleted; // Indique si l'inscription est complète

    private String status;
}