package org.example.trainingservice.web.evaluations;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api/evaluations/f4")
public class F4EvalautionController {
    /**
     * Scanner un QR code et récupérer la liste de présence
     */

    /**
     * Récuperer le formulaire pour le remplir
     */
    @GetMapping("/get/f4-form")
    public ResponseEntity<?> getF4Form() {
        return null;
    }
}