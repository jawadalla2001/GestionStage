package com.gestion.stage.controller;

import java.util.List;

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
import com.gestion.stage.model.Categorie;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;
import com.gestion.stage.service.AppreciationService;
import com.gestion.stage.service.CategorieService;
import com.gestion.stage.service.CompetencesService;
import com.gestion.stage.service.EvaluationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final AppreciationService appreciationService;
    private final CategorieService categorieService;
    private final CompetencesService competencesService;

    @Autowired
    public EvaluationController(
            EvaluationService evaluationService,
            AppreciationService appreciationService,
            CategorieService categorieService,
            CompetencesService competencesService) {
        this.evaluationService = evaluationService;
        this.appreciationService = appreciationService;
        this.categorieService = categorieService;
        this.competencesService = competencesService;
    }

    @GetMapping
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        return ResponseEntity.ok(evaluationService.getAllEvaluations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable Long id) {
        return evaluationService.getEvaluationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appreciation/{appreciationId}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByAppreciation(@PathVariable Long appreciationId) {
        return appreciationService.getAppreciationById(appreciationId)
                .map(appreciation -> ResponseEntity.ok(evaluationService.getEvaluationsByAppreciation(appreciation)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categorie/{categorieId}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByCategorie(@PathVariable Long categorieId) {
        return categorieService.getCategorieById(categorieId)
                .map(categorie -> ResponseEntity.ok(evaluationService.getEvaluationsByCategorie(categorie)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/competences/{competencesId}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByCompetences(@PathVariable Long competencesId) {
        return competencesService.getCompetencesById(competencesId)
                .map(competences -> ResponseEntity.ok(evaluationService.getEvaluationsByCompetences(competences)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/appreciation/{appreciationId}/categorie/{categorieId}")
    public ResponseEntity<Evaluation> createEvaluation(
            @PathVariable Long appreciationId,
            @PathVariable Long categorieId,
            @Valid @RequestBody Evaluation evaluation) {

        Appreciation appreciation = appreciationService.getAppreciationById(appreciationId).orElse(null);
        Categorie categorie = categorieService.getCategorieById(categorieId).orElse(null);

        if (appreciation == null || categorie == null) {
            return ResponseEntity.notFound().build();
        }

        evaluation.setAppreciation(appreciation);
        evaluation.setCategorie(categorie);

        return new ResponseEntity<>(evaluationService.saveEvaluation(evaluation), HttpStatus.CREATED);
    }

    @PostMapping("/appreciation/{appreciationId}/competences/{competencesId}")
    public ResponseEntity<Evaluation> createEvaluationForCompetences(
            @PathVariable Long appreciationId,
            @PathVariable Long competencesId,
            @Valid @RequestBody Evaluation evaluation) {

        Appreciation appreciation = appreciationService.getAppreciationById(appreciationId).orElse(null);
        Competences competences = competencesService.getCompetencesById(competencesId).orElse(null);

        if (appreciation == null || competences == null) {
            return ResponseEntity.notFound().build();
        }

        evaluation.setAppreciation(appreciation);
        evaluation.setCompetences(competences);

        return new ResponseEntity<>(evaluationService.saveEvaluation(evaluation), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evaluation> updateEvaluation(@PathVariable Long id, @Valid @RequestBody Evaluation evaluation) {
        return evaluationService.getEvaluationById(id)
                .map(existingEvaluation -> {
                    evaluation.setId(id);
                    evaluation.setAppreciation(existingEvaluation.getAppreciation()); // Préserver les relations
                    evaluation.setCategorie(existingEvaluation.getCategorie());
                    evaluation.setCompetences(existingEvaluation.getCompetences());
                    return ResponseEntity.ok(evaluationService.saveEvaluation(evaluation));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        return evaluationService.getEvaluationById(id)
                .map(evaluation -> {
                    evaluationService.deleteEvaluation(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}