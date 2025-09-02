package org.example.authservice;

import org.example.authservice.entity.Groupe;
import org.example.authservice.entity.User;
import org.example.authservice.repository.GroupeRepository;
import org.example.authservice.repository.UserRepository;
import org.example.authservice.service.AccessRightService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
@EnableFeignClients
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            GroupeRepository groupeRepository,
            AccessRightService accessRightService // Injection du service de droits d'accès
    ) {
        return args -> {

            // Vérifier si les données existent déjà pour éviter les doublons
            if (groupeRepository.count() > 0) {
                System.out.println("Les données existent déjà. Initialisation ignorée.");
                return;
            }

            System.out.println("Initialisation des groupes et droits d'accès par défaut...");

            // Créer les groupes par défaut
            List<Groupe> groupesToCreate = List.of(
                    Groupe.builder()
                            .companyId(1L)
                            .name("Admin")
                            .description("Administrateur système avec tous les droits")
                            .build(),

                    Groupe.builder()
                            .companyId(1L)
                            .name("Manager")
                            .description("Manager avec droits étendus")
                            .build(),

                    Groupe.builder()
                            .companyId(1L)
                            .name("Formateur")
                            .description("Formateur avec droits limités")
                            .build(),

                    Groupe.builder()
                            .companyId(1L)
                            .name("Collaborateur")
                            .description("Collaborateur avec droits de base")
                            .build(),

                    Groupe.builder()
                            .companyId(1L)
                            .name("Employé")
                            .description("Employé avec droits minimaux")
                            .build(),

                    Groupe.builder()
                            .companyId(2L)
                            .name("Admin")
                            .description("Admin pour entreprise 2")
                            .build()
            );

            // Sauvegarder les groupes et créer leurs droits d'accès
            for (Groupe groupe : groupesToCreate) {
                Groupe savedGroupe = groupeRepository.save(groupe);
                System.out.println("Groupe créé : " + savedGroupe.getName());

                // Créer les droits d'accès par défaut pour ce groupe
                try {
                    accessRightService.createDefaultAccessRights(savedGroupe);
                    System.out.println("Droits d'accès créés pour le groupe : " + savedGroupe.getName());
                } catch (Exception e) {
                    System.err.println("Erreur lors de la création des droits pour " + savedGroupe.getName() + " : " + e.getMessage());
                }
            }

            // Récupérer les groupes sauvegardés pour l'assignation aux utilisateurs
            Groupe adminGroupe = groupeRepository.findByNameAndCompanyId("Admin", 1L).orElse(null);
            Groupe managerGroupe = groupeRepository.findByNameAndCompanyId("Manager", 1L).orElse(null);
            Groupe formateurGroupe = groupeRepository.findByNameAndCompanyId("Formateur", 1L).orElse(null);
            Groupe collaborateurGroupe = groupeRepository.findByNameAndCompanyId("Collaborateur", 1L).orElse(null);
            Groupe employeGroupe = groupeRepository.findByNameAndCompanyId("Employé", 1L).orElse(null);

            // Créer les utilisateurs de test
            List<User> usersToCreate = List.of(
                    // Admin principal
                    User.builder()
                            .email("babaprince71@gmail.com")
                            .firstName("Baba Daouda")
                            .lastName("Prince")
                            .address("Apt1 GH1 Imm 16 Andalous, Mohammedia, Maroc")
                            .birthDate(LocalDate.now().toString())
                            .phoneNumber("+212693823094")
                            .cin("BK12273Z")
                            .gender("Homme")
                            .hiringDate(LocalDate.now().toString())
                            .socialSecurityNumber("456789123456")
                            .collaboratorCode("GS-022151")
                            .position("DG")
                            .department("Direction Administrative")
                            .companyId(1L)
                            .password(passwordEncoder.encode("0112"))
                            .creationDate(LocalDate.now().toString())
                            .active(true)
                            .firstLogin(true)
                            .status("Actif")
                            .role("Admin")
                            .groupe(adminGroupe)
                            .build(),

                    // Manager
                    User.builder()
                            .email("thomasjudejunior@gmail.com")
                            .firstName("Thomas Junior")
                            .lastName("Jude")
                            .department("Direction Administrative")
                            .password(passwordEncoder.encode("0112"))
                            .creationDate(LocalDate.now().toString())
                            .active(true)
                            .cin("AB123456")
                            .socialSecurityNumber("987654321098")
                            .status("Actif")
                            .role("Manager")
                            .groupe(managerGroupe)
                            .firstLogin(true)
                            .companyId(1L)
                            .build(),

                    // Formateur
                    User.builder()
                            .email("formateur@gmail.com")
                            .firstName("Ahmed")
                            .lastName("Formateur")
                            .department("Formation")
                            .password(passwordEncoder.encode("0112"))
                            .creationDate(LocalDate.now().toString())
                            .active(true)
                            .cin("FT123456")
                            .socialSecurityNumber("111222333444")
                            .status("Actif")
                            .role("Formateur")
                            .groupe(formateurGroupe)
                            .firstLogin(true)
                            .companyId(1L)
                            .managerId(2L) // Manager comme supérieur
                            .build(),

                    // Collaborateur
                    User.builder()
                            .email("sandra@gmail.com")
                            .firstName("Sandra")
                            .lastName("Aka")
                            .address("Apt1 GH1 Imm 16 Andalous, Mohammedia, Maroc")
                            .birthDate(LocalDate.now().toString())
                            .phoneNumber("+212693823094")
                            .cin("EF345678")
                            .managerId(2L)
                            .gender("Femme")
                            .hiringDate(LocalDate.now().toString())
                            .socialSecurityNumber("321098765432")
                            .collaboratorCode("ATZ-022151")
                            .position("DRH")
                            .department("Service Commercial")
                            .companyId(1L)
                            .password(passwordEncoder.encode("0112"))
                            .creationDate(LocalDate.now().toString())
                            .active(true)
                            .firstLogin(true)
                            .status("Actif")
                            .role("Collaborateur")
                            .groupe(collaborateurGroupe)
                            .build(),

                    // Employé
                    User.builder()
                            .email("boris@gmail.com")
                            .firstName("Boris")
                            .lastName("Samne")
                            .address("Boukhalef, Tanger, Maroc")
                            .birthDate("2023-05-01")
                            .phoneNumber("+212693823094")
                            .cin("GH901234")
                            .managerId(2L)
                            .gender("Homme")
                            .hiringDate(LocalDate.now().toString())
                            .socialSecurityNumber("654321098765")
                            .collaboratorCode("ATZ-022151")
                            .position("Agent Back office")
                            .department("Service Client")
                            .companyId(1L)
                            .password(passwordEncoder.encode("0112"))
                            .creationDate(LocalDate.now().toString())
                            .active(true)
                            .firstLogin(true)
                            .status("Actif")
                            .role("Employé")
                            .groupe(employeGroupe)
                            .build()
            );

            // Sauvegarder les utilisateurs
            for (User user : usersToCreate) {
                userRepository.save(user);
                System.out.println("Utilisateur créé : " + user.getEmail() + " (" + user.getRole() + ")");
            }

            System.out.println("Initialisation terminée avec succès !");

            // Afficher un résumé des permissions par groupe
            displayPermissionsSummary();
        };
    }

    /**
     * Affiche un résumé des permissions par défaut par groupe
     */
    private void displayPermissionsSummary() {
        System.out.println("\n=== RÉSUMÉ DES PERMISSIONS PAR DÉFAUT ===");

        System.out.println("\n🔧 ADMIN:");
        System.out.println("  ✅ Module Users: Tous les droits (view, create, edit, delete, export, view_details)");
        System.out.println("  ✅ Module Plan: Tous les droits (view, create, edit, approve)");

        System.out.println("\n👔 MANAGER:");
        System.out.println("  ✅ Module Users: Tous sauf delete (view, create, edit, export, view_details)");
        System.out.println("  ✅ Module Plan: Tous les droits (view, create, edit, approve)");

        System.out.println("\n🎓 FORMATEUR:");
        System.out.println("  ✅ Module Users: Lecture seule (view, view_details)");
        System.out.println("  ❌ Module Plan: Aucun droit");

        System.out.println("\n👤 COLLABORATEUR:");
        System.out.println("  ✅ Module Users: Voir ses propres détails (view_details)");
        System.out.println("  ❌ Module Plan: Aucun droit");

        System.out.println("\n👷 EMPLOYÉ:");
        System.out.println("  ✅ Module Users: Voir ses propres détails (view_details)");
        System.out.println("  ❌ Module Plan: Aucun droit");

        System.out.println("\n=========================================\n");
    }
}