package org.example.trainingservice;

import org.example.trainingservice.entity.OCF;
import org.example.trainingservice.entity.campaign.Question;
import org.example.trainingservice.entity.campaign.Questionnaire;
import org.example.trainingservice.entity.plan.Plan;
import org.example.trainingservice.enums.OCFStatusEnum;
import org.example.trainingservice.enums.PlanStatusEnum;
import org.example.trainingservice.repository.OCFRepository;
import org.example.trainingservice.repository.evaluation.QuestionRepository;
import org.example.trainingservice.repository.evaluation.QuestionnaireRepository;
import org.example.trainingservice.repository.plan.PlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class TrainingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrainingServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(
            OCFRepository ocfRepository,
            PlanRepository planRepository,
            QuestionRepository questionRepository,
            QuestionnaireRepository questionnaireRepository
    ) {
        return args -> {
            OCF ocf = OCF.builder()
                    .corporateName("GALAXY SOLUTIONS")
                    .emailMainContact("babaprince71@gmail.com")
                    .companyId(1L)
                    .status(OCFStatusEnum.ACTIVE)
                    .build();
            ocfRepository.save(ocf);

            Plan plan = Plan.builder()
                    .title("Plan 2025")
                    .companyId(1L)
                    .isCSFPlan(true)
                    .isOFPPTValidation(false)
                    .year(2025)
                    .startDate(LocalDate.of(2025, 1, 1))
                    .endDate(LocalDate.of(2025, 12, 31))
                    .estimatedBudget(BigDecimal.valueOf(65000))
                    .status(PlanStatusEnum.NOT_PLANNED)
                    .build();
            planRepository.save(plan);

            // Formulaire F4
            List<String> options = List.of("Pas du tout", "Peu", "Moyen", "Tout à fait");
            List<Question> questions = new ArrayList<>();
            Question question_01 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("L’information concernant la formation a été complète")
                    .build();

            Question question_02 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("La durée et le rythme de la formation étaient conformes à ce qui a été annoncé")
                    .build();

            Question question_03 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Les documents annoncés ont été remis aux participants.")
                    .build();

            Question question_04 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Les documents remis constituent une aide à l’assimilation des contenus")
                    .build();

            Question question_05 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Les conditions matérielles (locaux, restauration, facilité d’accès, etc.) étaient satisfaisantes.")
                    .build();

            Question question_06 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Le formateur dispose des compétences techniques nécessaires")
                    .build();

            Question question_07 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Le formateur dispose des compétences pédagogiques")
                    .build();

            Question question_08 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Le formateur a su créer ou entretenir une ambiance agréable dans le groupe en formation")
                    .build();

            Question question_09 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Les moyens pédagogiques étaient adaptés au contenu de la formation")
                    .build();

            Question question_10 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Les objectifs de la formation correspondent à mes besoins professionnels")
                    .build();

            Question question_11 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("Les objectifs recherchés à travers cette formation ont été atteint")
                    .build();

            Question question_12 = Question.builder()
                    .companyId(1L)
                    .options(options)
                    .type("Réponse unique")
                    .text("D'une manière générale, cette formation me permettra d'améliorer mes compétences professionnelles")
                    .build();

            questions.add(question_01);
            questions.add(question_02);
            questions.add(question_03);
            questions.add(question_04);
            questions.add(question_05);
            questions.add(question_06);
            questions.add(question_07);
            questions.add(question_08);
            questions.add(question_09);
            questions.add(question_10);
            questions.add(question_11);
            questions.add(question_12);

            List<Question> savedQuestions = questionRepository.saveAll(questions);


            Questionnaire questionnaire = Questionnaire.builder()
                    .defaultQuestionnaire(true)
                    .type("Formulaire F4")
                    .companyId(1L)
                    .description("Formulaire F4")
                    .creationDate(LocalDate.now())
                    .title("Formulaire F4")
                    .questions(savedQuestions)
                    .build();

            questionnaireRepository.save(questionnaire);
        };
    }

}