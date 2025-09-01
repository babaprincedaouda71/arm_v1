package org.example.companyservice;

import org.example.companyservice.entity.*;
import org.example.companyservice.enums.TrainingRoomEnum;
import org.example.companyservice.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class CompanyServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompanyServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(
            CompanyRepository companyRepository,
            StrategicAxesRepository strategicAxesRepository,
            SiteRepository siteRepository,
            DepartmentRepository departmentRepository,
            DomainRepository domainRepository,
            QualificationRepository qualificationRepository
    ) {
        return args -> {
            // Création des entreprises
            Company company01 = Company.builder()
                    .name("GALAXY SOLUTIONS")
                    .registrationCompleted(true)
                    .cnssNumber("0123456987")
                    .employees("0 - 10")
                    .iceNumber("987654321")
                    .mainContactFirstName("Baba")
                    .mainContactLastName("Prince")
                    .mainContactEmail("babaprince71@gmail.com")
                    .mainContactPhone("+212693823094")
                    .mainContactRole("DG")
                    .legalContactRole("DG")
                    .sector("Services")
                    .status("Accepte")
                    .legalContactFirstName("Baba")
                    .legalContactLastName("Prince")
                    .build();

            Company company02 = Company.builder()
                    .name("ALTRAZ")
                    .registrationCompleted(true)
                    .cnssNumber("0123456987")
                    .employees("0 - 10")
                    .iceNumber("987654321")
                    .mainContactFirstName("Thomas")
                    .mainContactLastName("Jude Junior")
                    .mainContactEmail("thomasjudejunior@gmail.com")
                    .mainContactPhone("+212693823094")
                    .mainContactRole("CEO")
                    .legalContactRole("CEO")
                    .sector("Services")
                    .status("Accepte")
                    .legalContactFirstName("Thomas")
                    .legalContactLastName("Jude Junior")
                    .build();

            companyRepository.save(company01);
            companyRepository.save(company02);

            Random random = new Random();
            long companyId = 1L; // Exemple d'ID d'entreprise

            List<String> strategicAxisTitles = Arrays.asList("Expansion Marché", "Innovation Produit", "Optimisation Opérationnelle", "Engagement Client", "Développement Durable");
            List<String> siteLabels = Arrays.asList("Siège Social Casablanca", "Centre de Formation Rabat", "Antenne Commerciale Marrakech", "Unité de Production Tanger", "Plateforme Logistique Agadir");
            List<String> siteCodes = Arrays.asList("CASA-HQ", "RABAT-CF", "MARRA-CO", "TANGE-UP", "AGAD-PL");
            List<String> addresses = Arrays.asList("12 Rue des Nations Unies, Casablanca", "5 Avenue Hassan II, Rabat", "Quartier Industriel, Marrakech", "Zone Franche, Tanger", "Route d'Essaouira, Agadir");
            List<String> cities = Arrays.asList("Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir");
            List<String> domainNames = Arrays.asList("Marketing Digital", "Gestion de Projet", "Ressources Humaines", "Finance d'Entreprise", "Développement Logiciel");
            List<String> domainCodes = Arrays.asList("MKTG", "PROJ", "RH", "FIN", "DEV");
            List<String> departmentNames = Arrays.asList("Service Commercial", "Département Technique", "Direction Administrative", "Pôle Innovation", "Service Client");
            List<String> departmentCodes = Arrays.asList("COM", "TECH", "ADMIN", "INNOV", "CLI");
            List<String> qualificationTypes = Arrays.asList("Certificat Professionnel", "Diplôme d'État", "Habilitation Métier", "Formation Continue", "Accréditation Sectorielle");
            List<String> qualificationCodes = Arrays.asList("CERT-PRO", "DIP-ETAT", "HAB-MET", "FORM-CONT", "ACCRED-SEC");

            // Génération de 5 StrategicAxes aléatoires
            List<StrategicAxes> strategicAxesList = IntStream.rangeClosed(0, 4)
                    .mapToObj(i -> StrategicAxes.builder()
                            .companyId(companyId)
                            .title(strategicAxisTitles.get(i))
                            .year(2024 + i)
                            .build())
                    .toList();
            strategicAxesRepository.saveAll(strategicAxesList);
            System.out.println("5 axes stratégiques réalistes générés.");

            // 🆕 PREMIÈRE ÉTAPE : Génération et sauvegarde des Départements
            List<Department> departmentList = IntStream.rangeClosed(0, 4)
                    .mapToObj(i -> Department.builder()
                            .companyId(companyId)
                            .code(departmentCodes.get(i))
                            .name(departmentNames.get(i))
                            .build())
                    .toList();
            List<Department> savedDepartments = departmentRepository.saveAll(departmentList);
            System.out.println("5 départements réalistes générés et sauvegardés.");

            // 🆕 DEUXIÈME ÉTAPE : Génération des Sites avec attribution aléatoire de départements
            List<Site> siteList = IntStream.rangeClosed(0, 4)
                    .mapToObj(i -> {
                        // Attribution aléatoire de 1 à 3 départements par site
                        int numberOfDepartments = random.nextInt(3) + 1; // Entre 1 et 3 départements
                        List<Long> assignedDepartmentIds = new ArrayList<>();

                        // Sélection aléatoire des départements (sans doublon)
                        List<Department> availableDepartments = new ArrayList<>(savedDepartments);
                        for (int j = 0; j < numberOfDepartments && !availableDepartments.isEmpty(); j++) {
                            int randomIndex = random.nextInt(availableDepartments.size());
                            Department selectedDept = availableDepartments.remove(randomIndex);
                            assignedDepartmentIds.add(selectedDept.getId());
                        }

                        return Site.builder()
                                .companyId(companyId)
                                .code(siteCodes.get(i))
                                .label(siteLabels.get(i))
                                .address(addresses.get(i))
                                .city(cities.get(i))
                                .phone("05" + String.format("%08d", random.nextInt(100000000)))
                                .trainingRoom(TrainingRoomEnum.values()[random.nextInt(TrainingRoomEnum.values().length)])
                                .size(30 + random.nextInt(120))
                                .departmentIds(assignedDepartmentIds) // 🆕 Attribution des départements
                                .build();
                    })
                    .toList();

            List<Site> savedSites = siteRepository.saveAll(siteList);
            System.out.println("5 sites réalistes générés avec départements assignés.");

            // 🆕 AFFICHAGE DES RELATIONS CRÉÉES
            System.out.println("\n=== RELATIONS SITE-DÉPARTEMENT CRÉÉES ===");
            for (Site site : savedSites) {
                System.out.println("🏢 Site: " + site.getLabel() + " (" + site.getCode() + ")");
                if (site.getDepartmentIds() != null && !site.getDepartmentIds().isEmpty()) {
                    System.out.println("   📋 Départements assignés:");
                    for (Long deptId : site.getDepartmentIds()) {
                        Department dept = savedDepartments.stream()
                                .filter(d -> d.getId().equals(deptId))
                                .findFirst()
                                .orElse(null);
                        if (dept != null) {
                            System.out.println("      - " + dept.getName() + " (" + dept.getCode() + ")");
                        }
                    }
                } else {
                    System.out.println("   📋 Aucun département assigné");
                }
                System.out.println();
            }

            // Génération de 5 Domains aléatoires
            List<Domain> domainList = IntStream.rangeClosed(0, 4)
                    .mapToObj(i -> Domain.builder()
                            .companyId(companyId)
                            .code(domainCodes.get(i))
                            .name(domainNames.get(i))
                            .build())
                    .toList();
            domainRepository.saveAll(domainList);
            System.out.println("5 domaines réalistes générés.");

            // Génération de 5 Qualifications aléatoires
            List<Qualification> qualificationList = IntStream.rangeClosed(0, 4)
                    .mapToObj(i -> Qualification.builder()
                            .companyId(companyId)
                            .code(qualificationCodes.get(i))
                            .type(qualificationTypes.get(i))
                            .validityNumber(random.nextInt(5) + 1)
                            .validityUnit(Qualification.ValidityUnit.values()[random.nextInt(Qualification.ValidityUnit.values().length)])
                            .reminderNumber(random.nextInt(3) + 1)
                            .reminderUnit(Qualification.ReminderUnit.values()[random.nextInt(Qualification.ReminderUnit.values().length)])
                            .build())
                    .toList();
            qualificationRepository.saveAll(qualificationList);
            System.out.println("5 qualifications réalistes générées.");

            // 🆕 RÉSUMÉ FINAL
            System.out.println("\n=== RÉSUMÉ DE LA GÉNÉRATION ===");
            System.out.println("✅ 2 entreprises créées");
            System.out.println("✅ 5 axes stratégiques créés");
            System.out.println("✅ 5 départements créés");
            System.out.println("✅ 5 sites créés avec départements assignés");
            System.out.println("✅ 5 domaines créés");
            System.out.println("✅ 5 qualifications créées");
            System.out.println("🔗 Relations Site-Département établies automatiquement");
        };
    }
}