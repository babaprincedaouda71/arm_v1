package org.example.companyservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.companyservice.entity.StrategicAxes;
import org.example.companyservice.exceptions.StrategicAxesNotFoundException;
import org.example.companyservice.repository.StrategicAxesRepository;
import org.example.companyservice.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class StrategicAxesServiceImpl implements StrategicAxesService {
    private final StrategicAxesRepository strategicAxesRepository;

    public StrategicAxesServiceImpl(StrategicAxesRepository strategicAxesRepository) {
        this.strategicAxesRepository = strategicAxesRepository;
    }

    @Override
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(strategicAxesRepository.findAll());
    }

    @Override
    public ResponseEntity<?> getAllByYear() {
        Long companyId = SecurityUtils.getCurrentCompanyId();

        List<Object[]> results = strategicAxesRepository.findAllByYearAndCompanyId(companyId); // Nouvelle méthode
        Map<Integer, Map<String, Object>> groupedData = new HashMap<>();

        for (Object[] result : results) {
            Long id = (Long) result[0];
            Integer year = (Integer) result[1];
            String title = (String) result[2];

            groupedData.computeIfAbsent(year, k -> {
                Map<String, Object> yearData = new HashMap<>();
                yearData.put("title", "Axes stratégiques de " + year);
                yearData.put("strategicAxes", new ArrayList<Map<String, Object>>()); // Modifier le type ici
                return yearData;
            });

            Map<String, Object> yearData = groupedData.get(year);
            ((List<Map<String, Object>>) yearData.get("strategicAxes")).add(Map.of("id", id, "title", title, "year", String.valueOf(year))); // Ajouter l'ID et l'année
        }

        return ResponseEntity.ok((new ArrayList<>(groupedData.values())));
    }

    @Override
    public ResponseEntity<?> add(StrategicAxes strategicAxes) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        StrategicAxes newStrategicAxes = StrategicAxes.builder()
                .companyId(companyId)
                .title(strategicAxes.getTitle())
                .year(strategicAxes.getYear())
                .build();
        return ResponseEntity.ok(strategicAxesRepository.save(newStrategicAxes));
    }

    @Override
    public ResponseEntity<?> edit(Long id, StrategicAxes strategicAxes) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        StrategicAxes foundStrategicAxes = strategicAxesRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new StrategicAxesNotFoundException("Aucun axe trouvé", null));
        foundStrategicAxes.setTitle(strategicAxes.getTitle());
        foundStrategicAxes.setYear(strategicAxes.getYear());
        return ResponseEntity.ok(strategicAxesRepository.save(foundStrategicAxes));
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        StrategicAxes found = strategicAxesRepository.findByIdAndCompanyId(id, companyId).orElseThrow(() -> new StrategicAxesNotFoundException("STRATEGIC_AXE NOT FOUND", null));
        strategicAxesRepository.delete(found);
        return ResponseEntity.ok().build();
    }
}