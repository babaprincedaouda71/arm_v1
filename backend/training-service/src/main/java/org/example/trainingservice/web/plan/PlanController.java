package org.example.trainingservice.web.plan;

import lombok.extern.slf4j.Slf4j;
import org.example.trainingservice.dto.plan.*;
import org.example.trainingservice.entity.plan.Plan;
import org.example.trainingservice.exceptions.PlanNotFoundException;
import org.example.trainingservice.repository.plan.PlanRepository;
import org.example.trainingservice.service.plan.PlanService;
import org.example.trainingservice.service.plan.PlanValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/api/plan")
public class PlanController {
    private final PlanService planService;
    private final PlanValidationService planValidationService;
    private final PlanRepository planRepository;

    public PlanController(
            PlanService planService, PlanValidationService planValidationService, PlanRepository planRepository
    ) {
        this.planService = planService;
        this.planValidationService = planValidationService;
        this.planRepository = planRepository;
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAllPlan() {
        return planService.getAllPlan();
    }

    @GetMapping("/get/all-paginated")
    public ResponseEntity<PlanPagedResponse<PlanDto>> getAllPlans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection,
            @RequestParam(required = false) String search) {

        return planService.getAllPlanPaginated(page, size, sortBy, sortDirection, search);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPlan(@RequestBody AddPlanDto addPlanDto) {
        return planService.addPlan(addPlanDto);
    }

    @PostMapping("/addThemeToPlan")
    public ResponseEntity<?> addThemeToPlan(@RequestBody AddThemeToPlanDto addThemeToPlanDto) {
        return planService.addThemeToPlan(addThemeToPlanDto);
    }

    @DeleteMapping("/removeThemeFromPlan/{id}")
    public ResponseEntity<?> removeThemeFromPlan(@PathVariable UUID id) {
        return planService.removeTrainingFromPlan(id);
    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updateStatus(@RequestBody UpdatePlanStatusRequestDto updateStatusRequestDto) {
        return planService.updateStatus(updateStatusRequestDto);
    }

    /*
     * */

    /**
     * Endpoint pour obtenir le rapport de validation d'un plan
     * GET /api/plans/{planId}/validation-report
     */
    @GetMapping("/validation-report/{planId}")
    public ResponseEntity<?> getValidationReport(@PathVariable UUID planId) {
        try {
            Plan plan = planRepository.findById(planId)
                    .orElseThrow(() -> new PlanNotFoundException("Plan not found with ID: " + planId, null));

            PlanValidationService.PlanValidationReport report = planValidationService.generateValidationReport(plan);

            log.info("Rapport de validation généré pour le plan {}: {}", planId, report.isCanBeValidated() ? "VALIDE" : "INVALIDE");

            return ResponseEntity.ok(report);
        } catch (PlanNotFoundException e) {
            log.error("Plan non trouvé: {}", planId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la génération du rapport de validation pour le plan {}: {}", planId, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de la génération du rapport de validation"));
        }
    }

    /**
     * Endpoint pour mettre à jour le statut de validation OFPPT
     * PUT /api/plans/{planId}/ofppt-validation
     */
    @PutMapping("/ofppt-validation/{planId}")
    public ResponseEntity<?> updateOFPPTValidation(
            @PathVariable UUID planId,
            @RequestBody Map<String, Boolean> request) {
        try {
            Boolean isValidated = request.get("isValidated");
            if (isValidated == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Le champ 'isValidated' est requis"));
            }

            Plan plan = planRepository.findById(planId)
                    .orElseThrow(() -> new PlanNotFoundException("Plan not found with ID: " + planId, null));

            // Vérifier que c'est un plan CSF
            if (!Boolean.TRUE.equals(plan.getIsCSFPlan())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Seuls les plans CSF peuvent être validés par l'OFPPT"));
            }

            // Utiliser le service de validation
            plan = planValidationService.updateOFPPTValidationStatus(plan, isValidated);
            Plan savedPlan = planRepository.save(plan);

            log.info("Statut de validation OFPPT mis à jour pour le plan {}: {}", planId, isValidated);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", isValidated ? "Plan validé par l'OFPPT" : "Validation OFPPT annulée",
                    "isOFPPTValidation", savedPlan.getIsOFPPTValidation()
            ));

        } catch (PlanNotFoundException e) {
            log.error("Plan non trouvé: {}", planId);
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            log.warn("Tentative de validation impossible pour le plan {}: {}", planId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour de la validation OFPPT pour le plan {}: {}", planId, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de la mise à jour de la validation"));
        }
    }

    /**
     * Endpoint pour vérifier rapidement si un plan peut être validé
     * GET /api/plans/{planId}/can-be-validated
     */
    @GetMapping("/can-be-validated/{planId}")
    public ResponseEntity<?> canPlanBeValidated(@PathVariable UUID planId) {
        try {
            Plan plan = planRepository.findById(planId)
                    .orElseThrow(() -> new PlanNotFoundException("Plan not found with ID: " + planId, null));

            boolean canBeValidated = planValidationService.canPlanBeOFPPTValidated(plan);

            return ResponseEntity.ok(Map.of(
                    "planId", planId,
                    "canBeValidated", canBeValidated,
                    "isCSFPlan", plan.getIsCSFPlan(),
                    "currentValidationStatus", plan.getIsOFPPTValidation()
            ));

        } catch (PlanNotFoundException e) {
            log.error("Plan non trouvé: {}", planId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la vérification du plan {}: {}", planId, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur lors de la vérification"));
        }
    }
}