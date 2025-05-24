package com.gestion.stage.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion.stage.model.Appreciation;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;
import com.gestion.stage.model.Periode;
import com.gestion.stage.service.AppreciationService;
import com.gestion.stage.service.CompetencesService;
import com.gestion.stage.service.EvaluationService;
import com.gestion.stage.service.PeriodeService;
import com.gestion.stage.service.TuteurService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appreciations")
@CrossOrigin(origins = "*")
public class AppreciationController {

    private final AppreciationService appreciationService;
    private final TuteurService tuteurService;
    private final CompetencesService competencesService;
    private final PeriodeService periodeService;
    private final EvaluationService evaluationService;

    @Autowired
    public AppreciationController(AppreciationService appreciationService,
                                 TuteurService tuteurService,
                                 CompetencesService competencesService,
                                 PeriodeService periodeService,
                                 EvaluationService evaluationService) {
        this.appreciationService = appreciationService;
        this.tuteurService = tuteurService;
        this.competencesService = competencesService;
        this.periodeService = periodeService;
        this.evaluationService = evaluationService;
    }

    @GetMapping
    public ResponseEntity<List<Appreciation>> getAllAppreciations() {
        return ResponseEntity.ok(appreciationService.getAllAppreciations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appreciation> getAppreciationById(@PathVariable Long id) {
        return appreciationService.getAppreciationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tuteur/{tuteurId}")
    public ResponseEntity<List<Appreciation>> getAppreciationsByTuteur(@PathVariable Long tuteurId) {
        return tuteurService.getTuteurById(tuteurId)
                .map(tuteur -> ResponseEntity.ok(appreciationService.getAppreciationsByTuteur(tuteur)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/periode/{periodeId}")
    public ResponseEntity<List<Appreciation>> getAppreciationsByPeriode(@PathVariable Long periodeId) {
        return periodeService.getPeriodeById(periodeId)
                .map(periode -> ResponseEntity.ok(appreciationService.getAppreciationsByPeriode(periode)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/competences")
    public ResponseEntity<?> getCompetencesByAppreciation(@PathVariable Long id) {
        return appreciationService.getAppreciationById(id)
                .map(appreciation -> {
                    if (appreciation.getCompetences() != null) {
                        return ResponseEntity.ok(appreciation.getCompetences());
                    } else {
                        return ResponseEntity.notFound().build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/evaluation")
    public ResponseEntity<?> getEvaluationByAppreciation(@PathVariable Long id) {
        return appreciationService.getAppreciationById(id)
                .map(appreciation -> {
                    if (appreciation.getEvaluation() != null) {
                        return ResponseEntity.ok(appreciation.getEvaluation());
                    } else {
                        return ResponseEntity.notFound().build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tuteur/{tuteurId}/periode/{periodeId}")
    public ResponseEntity<Appreciation> createAppreciation(
            @PathVariable Long tuteurId,
            @PathVariable Long periodeId,
            @Valid @RequestBody Appreciation appreciation) {

        Optional<Periode> optionalPeriode = periodeService.getPeriodeById(periodeId);

        return tuteurService.getTuteurById(tuteurId)
                .flatMap(tuteur -> optionalPeriode.map(periode -> {
                    appreciation.setTuteur(tuteur);
                    appreciation.setPeriode(periode);
                    return new ResponseEntity<>(appreciationService.saveAppreciation(appreciation), HttpStatus.CREATED);
                }))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{appreciationId}/competence/{competenceId}")
    public ResponseEntity<Appreciation> addCompetenceToAppreciation(@PathVariable Long appreciationId, @PathVariable Long competenceId) {
        Optional<Appreciation> optionalAppreciation = appreciationService.getAppreciationById(appreciationId);
        Optional<Competences> optionalCompetence = competencesService.getCompetencesById(competenceId);

        if (optionalAppreciation.isPresent() && optionalCompetence.isPresent()) {
            Appreciation appreciation = optionalAppreciation.get();
            Competences competence = optionalCompetence.get();

            // Set the competence on the appreciation
            appreciation.setCompetences(competence);
            // Save the updated appreciation
            appreciationService.saveAppreciation(appreciation);
            return ResponseEntity.ok(appreciation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{appreciationId}/evaluation/{evaluationId}")
    public ResponseEntity<Appreciation> addEvaluationToAppreciation(@PathVariable Long appreciationId, @PathVariable Long evaluationId) {
        Optional<Appreciation> optionalAppreciation = appreciationService.getAppreciationById(appreciationId);
        Optional<Evaluation> optionalEvaluation = evaluationService.getEvaluationById(evaluationId);

        if (optionalAppreciation.isPresent() && optionalEvaluation.isPresent()) {
            Appreciation appreciation = optionalAppreciation.get();
            Evaluation evaluation = optionalEvaluation.get();

            // Set the evaluation on the appreciation
            appreciation.setEvaluation(evaluation);

            // Save the updated appreciation
            appreciationService.saveAppreciation(appreciation);

            return ResponseEntity.ok(appreciation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appreciation> updateAppreciation(@PathVariable Long id, @Valid @RequestBody Appreciation appreciation) {
        return appreciationService.getAppreciationById(id)
                .map(existingAppreciation -> {
                    appreciation.setId(id);
                    appreciation.setTuteur(existingAppreciation.getTuteur()); // Préserver la relation

                    // Preserve periode relationship if not specified
                    if (appreciation.getPeriode() == null) {
                        appreciation.setPeriode(existingAppreciation.getPeriode());
                    }

                    // Preserve competences relationship
                    if (appreciation.getCompetences() == null && existingAppreciation.getCompetences() != null) {
                        appreciation.setCompetences(existingAppreciation.getCompetences());
                    }

                    // Preserve evaluation relationship
                    if (appreciation.getEvaluation() == null && existingAppreciation.getEvaluation() != null) {
                        appreciation.setEvaluation(existingAppreciation.getEvaluation());
                    }

                    return ResponseEntity.ok(appreciationService.saveAppreciation(appreciation));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppreciation(@PathVariable Long id) {
        return appreciationService.getAppreciationById(id)
                .map(appreciation -> {
                    appreciationService.deleteAppreciation(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
