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

import com.gestion.stage.model.Competences;
import com.gestion.stage.service.CompetencesService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/competences")
@CrossOrigin(origins = "*")
public class CompetencesController {

    private final CompetencesService competencesService;

    @Autowired
    public CompetencesController(CompetencesService competencesService) {
        this.competencesService = competencesService;
    }

    @GetMapping
    public ResponseEntity<List<Competences>> getAllCompetences() {
        return ResponseEntity.ok(competencesService.getAllCompetences());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Competences> getCompetencesById(@PathVariable Long id) {
        return competencesService.getCompetencesById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/intitule/{intitule}")
    public ResponseEntity<Competences> getCompetencesByIntitule(@PathVariable String intitule) {
        return competencesService.getCompetencesByIntitule(intitule)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Competences> createCompetences(@Valid @RequestBody Competences competences) {
        return new ResponseEntity<>(competencesService.saveCompetences(competences), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Competences> updateCompetences(@PathVariable Long id, @Valid @RequestBody Competences competences) {
        return competencesService.getCompetencesById(id)
                .map(existingCompetences -> {
                    competences.setId(id);
                    return ResponseEntity.ok(competencesService.saveCompetences(competences));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompetences(@PathVariable Long id) {
        return competencesService.getCompetencesById(id)
                .map(competences -> {
                    competencesService.deleteCompetences(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}