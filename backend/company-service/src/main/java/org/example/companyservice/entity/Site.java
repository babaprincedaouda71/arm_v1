package org.example.companyservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.companyservice.enums.TrainingRoomEnum;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Site {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private String code;
    private String label;
    private String address;
    private String city;
    private String phone;
    @Enumerated(EnumType.STRING)
    private TrainingRoomEnum trainingRoom;
    private int size;

    // 🆕 Nouvelle propriété pour stocker les IDs des départements
    @ElementCollection
    @CollectionTable(name = "site_departments", joinColumns = @JoinColumn(name = "site_id"))
    @Column(name = "department_id")
    private List<Long> departmentIds = new ArrayList<>();
}