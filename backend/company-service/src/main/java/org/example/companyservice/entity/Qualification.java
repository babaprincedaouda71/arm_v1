package org.example.companyservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "qualifications")
public class Qualification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long companyId;

    private String code;

    private String type;

    // Gestion de la validité
    private Integer validityNumber;

    @Enumerated(EnumType.STRING)
    private ValidityUnit validityUnit;

    // Gestion du rappel
    private Integer reminderNumber;

    @Enumerated(EnumType.STRING)
    private ReminderUnit reminderUnit;

    public enum ValidityUnit {
        Ans,
        Mois
    }

    public enum ReminderUnit {
        Mois,
        Jour
    }
}