package org.example.trainingservice.web.needs;

import org.example.trainingservice.dto.need.AddStrategicAxeNeedDto;
import org.example.trainingservice.dto.need.EditNeedDto;
import org.example.trainingservice.dto.need.UpdateStatusRequestDto;
import org.example.trainingservice.service.needs.NeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/needs")
public class NeedController {
    private final NeedService needService;

    public NeedController(NeedService needService) {
        this.needService = needService;
    }

    /*
    * Tous les besoins
    * */
    @GetMapping("/get/all")
    public ResponseEntity<?> getAllNeeds() {
        return needService.getAllNeeds();
    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updateStatus(@RequestBody UpdateStatusRequestDto updateStatusRequestDto) {
        return needService.updateStatus(updateStatusRequestDto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return needService.delete(id);
    }

    /*
     * Besoins des Axes Stratégique
     * */
    @PostMapping("/add/strategicAxesNeed")
    public ResponseEntity<?> addStrategicAxesNeed(@RequestBody AddStrategicAxeNeedDto addStrategicAxeNeedDto) {
        return needService.addStrategicAxesNeed(addStrategicAxeNeedDto);
    }

    @GetMapping("/get/all/strategicAxesNeed")
    public ResponseEntity<?> getAllStrategicAxesNeed() {
        return needService.getAllStrategicAxesNeed();
    }

    @GetMapping("/get/needToEdit/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return needService.getNeedById(id);
    }

    @GetMapping("/get/needForAddGroup/{id}")
    public ResponseEntity<?> getNeedForAddGroup(@PathVariable Long id) {
        return needService.getNeedForAddGroup(id);
    }

    @GetMapping("/get/details/strategicAxesNeed/{id}")
    public ResponseEntity<?> details(@PathVariable Long id) {
        return needService.getDetailsById(id);
    }

    @PutMapping("/edit/need/{id}")
    public ResponseEntity<?> edit(@PathVariable Long id, @RequestBody EditNeedDto editNeedDto) {
        return needService.editNeed(id, editNeedDto);
    }

    /*
    * Besoins des requêtes individuelles
    * */
    @GetMapping("/get/all/individualRequestNeed")
    public ResponseEntity<?> getAllIndividualRequestNeed() {
        return needService.getAllIndividualRequestNeeds();
    }

    /*
    * Besoins issus des évaluations
    * */
    @GetMapping("/get/all/evaluationNeed")
    public ResponseEntity<?> getAllEvaluationNeed() {
        return needService.getAllEvaluationNeed();
    }

    /*
    * Besoins validés à ajouter au plan
    * */
    @GetMapping("/get/allValidatedNeedToAddToPlan")
    public ResponseEntity<?> getAllValidatedNeedToAddToPlan() {
        return needService.getAllValidatedNeedToAddToPlan();
    }
}