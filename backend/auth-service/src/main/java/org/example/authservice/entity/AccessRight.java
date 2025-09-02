package org.example.authservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "access_rights")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessRight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "groupe_id", nullable = false)
    @JsonBackReference // ← ici pour casser la boucle
    private Groupe groupe;

    @Column(nullable = false)
    private String module;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private Boolean allowed;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}