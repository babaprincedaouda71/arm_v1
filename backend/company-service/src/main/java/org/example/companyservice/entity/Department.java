package org.example.companyservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private String code;
    private String name;

    // Plusieurs départements peuvent appartenir à un seul site
    // Relation Many-to-One avec Site
//    @ManyToOne
    // @JoinColumn spécifie la colonne de clé étrangère dans la table Department
    // 'nullable = false' signifie qu'un département doit toujours être associé à un site
//    @JoinColumn(name = "site_id", nullable = false)
//    private Site site;
}