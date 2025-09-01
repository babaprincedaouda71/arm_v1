package org.example.authservice.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.example.authservice.token.Token;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"tokens", "groupe"})
@EqualsAndHashCode(exclude = {"groupe"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    //    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Long companyId;

    private Long departmentId;

    @Column(nullable = false)
    private boolean active;

    // Informations personnelles
    private String firstName;
    private String lastName;
    private String gender;
    private String birthDate;
    private String phoneNumber;
    private String address;
    private String cin;

    // Informations professionnelles
    private Long managerId;
    private String collaboratorCode;
    private String hiringDate;
    private String socialSecurityNumber;
    private String department;
    private String position;
    private String creationDate;
    private String status;

    // Relations
    @ManyToOne
    @JoinColumn(name = "groupe_id", nullable = false)
    @JsonManagedReference
    private Groupe groupe;

    @OneToMany(mappedBy = "user")
    private List<Token> tokens;

    // Pour les collaborateurs, lien vers leur profil
    private Long employeeId;

    @Column(nullable = false)
    private boolean firstLogin;

    public boolean isProfileIncomplete() {
        return firstName == null || firstName.isBlank() ||
                lastName == null || lastName.isBlank() ||
                gender == null || gender.isBlank() ||
                birthDate == null || birthDate.isBlank() ||
                phoneNumber == null || phoneNumber.isBlank() ||
                address == null || address.isBlank() ||
                cin == null || cin.isBlank() ||
                collaboratorCode == null || collaboratorCode.isBlank() ||
                hiringDate == null || hiringDate.isBlank() ||
                socialSecurityNumber == null || socialSecurityNumber.isBlank() ||
                department == null || department.isBlank() ||
                position == null || position.isBlank();
    }

}