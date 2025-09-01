package org.example.authservice;

import org.example.authservice.entity.Groupe;
import org.example.authservice.entity.User;
import org.example.authservice.repository.GroupeRepository;
import org.example.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

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
            GroupeRepository groupeRepository
            ) {
        return args -> {

            // create roles
            Groupe groupe01 = Groupe.builder()
                    .companyId(1L)
                    .name("Formateur")
                    .description("Formateur")
                    .build();
            Groupe groupe02 = Groupe.builder()
                    .companyId(1L)
                    .name("Admin")
                    .description("Admin")
                    .build();
            Groupe groupe03 = Groupe.builder()
                    .companyId(1L)
                    .name("Collaborateur")
                    .description("Collaborateur")
                    .build();
            Groupe groupe04 = Groupe.builder()
                    .companyId(1L)
                    .name("Manager")
                    .description("Manager")
                    .build();
            Groupe groupe05 = Groupe.builder()
                    .companyId(2L)
                    .name("Admin")
                    .description("Admin")
                    .build();

            Groupe groupe06 = Groupe.builder()
                    .companyId(1L)
                    .name("Employé")
                    .description("Employé")
                    .build();
            groupeRepository.save(groupe01);
            groupeRepository.save(groupe02);
            groupeRepository.save(groupe03);
            groupeRepository.save(groupe04);
            groupeRepository.save(groupe05);
            groupeRepository.save(groupe06);

            // create users
            User user = User.builder()
                    .email("iambabaprince@gmail.com")
                    .firstName("Prince")
                    .lastName("Coulibaly")
                    .password(passwordEncoder.encode("0112"))
                    .creationDate(LocalDate.now().toString())
                    .active(true)
                    .cin("CD789012")
                    .socialSecurityNumber("123456789012")
                    .status("Actif")
                    .role("Collaborateur")
                    .managerId(2L)
                    .groupe(groupe03)
                    .department("Département Technique")
                    .companyId(1L)
                    .firstLogin(true)
                    .build();
            User user2 = User.builder()
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
                    .groupe(groupe04)
                    .firstLogin(true)
                    .companyId(1L)
                    .build();
            User user3 = User.builder()
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
                    .groupe(groupe02)
                    .build();
            User user4 = User.builder()
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
                    .groupe(groupe03)
                    .build();

            User user5 = User.builder()
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
                    .groupe(groupe06)
                    .build();
            userRepository.save(user);
            userRepository.save(user2);
            userRepository.save(user3);
            userRepository.save(user4);
            userRepository.save(user5);

            // create more collaborators
//            User collaborateur1 = User.builder()
//                    .email("collaborateur1@example.com")
//                    .firstName("Ali")
//                    .lastName("Ahmed")
//                    .password(passwordEncoder.encode("0112"))
//                    .creationDate(LocalDate.now().toString())
//                    .active(true)
//                    .status("Actif")
//                    .role("Collaborateur")
//                    .groupe(groupe03)
//                    .companyId(1L)
//                    .managerId(9L)
//                    .firstLogin(true)
//                    .build();
//            User collaborateur2 = User.builder()
//                    .email("collaborateur2@example.com")
//                    .firstName("Fatima")
//                    .lastName("Zahra")
//                    .password(passwordEncoder.encode("0112"))
//                    .creationDate(LocalDate.now().toString())
//                    .active(true)
//                    .status("Actif")
//                    .role("Collaborateur")
//                    .groupe(groupe03)
//                    .companyId(1L)
//                    .managerId(10L)
//                    .firstLogin(true)
//                    .build();
//            User collaborateur3 = User.builder()
//                    .email("collaborateur3@example.com")
//                    .firstName("Youssef")
//                    .lastName("Rachid")
//                    .password(passwordEncoder.encode("0112"))
//                    .creationDate(LocalDate.now().toString())
//                    .active(true)
//                    .status("Actif")
//                    .role("Collaborateur")
//                    .groupe(groupe03)
//                    .companyId(1L)
//                    .managerId(11L)
//                    .firstLogin(true)
//                    .build();
//            User collaborateur4 = User.builder()
//                    .email("collaborateur4@example.com")
//                    .firstName("Khadija")
//                    .lastName("Omar")
//                    .password(passwordEncoder.encode("0112"))
//                    .creationDate(LocalDate.now().toString())
//                    .active(true)
//                    .status("Actif")
//                    .role("Collaborateur")
//                    .groupe(groupe03)
//                    .companyId(12L)
//                    .firstLogin(true)
//                    .build();
//
//            userRepository.save(collaborateur1);
//            userRepository.save(collaborateur2);
//            userRepository.save(collaborateur3);
//            userRepository.save(collaborateur4);
//
//            // create more managers
//            User manager1 = User.builder()
//                    .email("manager1@example.com")
//                    .firstName("Said")
//                    .lastName("Karim")
//                    .password(passwordEncoder.encode("0112"))
//                    .creationDate(LocalDate.now().toString())
//                    .active(true)
//                    .status("Actif")
//                    .role("Manager")
//                    .groupe(groupe04)
//                    .companyId(1L)
//                    .firstLogin(true)
//                    .build();
//            User manager2 = User.builder()
//                    .email("manager2@example.com")
//                    .firstName("Leila")
//                    .lastName("Fahd")
//                    .password(passwordEncoder.encode("0112"))
//                    .creationDate(LocalDate.now().toString())
//                    .active(true)
//                    .status("Actif")
//                    .role("Manager")
//                    .groupe(groupe04)
//                    .companyId(1L)
//                    .firstLogin(true)
//                    .build();
//            User manager3 = User.builder()
//                    .email("manager3@example.com")
//                    .firstName("Hassan")
//                    .lastName("Jawad")
//                    .password(passwordEncoder.encode("0112"))
//                    .creationDate(LocalDate.now().toString())
//                    .active(true)
//                    .status("Actif")
//                    .role("Manager")
//                    .groupe(groupe04)
//                    .companyId(1L)
//                    .firstLogin(true)
//                    .build();
//            User manager4 = User.builder()
//                    .email("manager4@example.com")
//                    .firstName("Nadia")
//                    .lastName("Kamal")
//                    .password(passwordEncoder.encode("0112"))
//                    .creationDate(LocalDate.now().toString())
//                    .active(true)
//                    .status("Actif")
//                    .role("Manager")
//                    .groupe(groupe04)
//                    .companyId(1L)
//                    .firstLogin(true)
//                    .build();
//
//            userRepository.save(manager1);
//            userRepository.save(manager2);
//            userRepository.save(manager3);
//            userRepository.save(manager4);
        };
    }

}