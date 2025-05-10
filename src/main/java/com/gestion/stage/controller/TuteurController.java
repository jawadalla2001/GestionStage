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

import com.gestion.stage.model.Tuteur;
import com.gestion.stage.service.TuteurService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tuteurs")
@CrossOrigin(origins = "*")
public class TuteurController {

    private final TuteurService tuteurService;

    @Autowired
    public TuteurController(TuteurService tuteurService) {
        this.tuteurService = tuteurService;
    }

    @GetMapping
    public ResponseEntity<List<Tuteur>> getAllTuteurs() {
        return ResponseEntity.ok(tuteurService.getAllTuteurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tuteur> getTuteurById(@PathVariable Long id) {
        return tuteurService.getTuteurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Tuteur> getTuteurByEmail(@PathVariable String email) {
        return tuteurService.getTuteurByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/entreprise/{entreprise}")
    public ResponseEntity<List<Tuteur>> getTuteursByEntreprise(@PathVariable String entreprise) {
        return ResponseEntity.ok(tuteurService.getTuteursByEntreprise(entreprise));
    }

    @PostMapping
    public ResponseEntity<Tuteur> createTuteur(@Valid @RequestBody Tuteur tuteur) {
        return new ResponseEntity<>(tuteurService.saveTuteur(tuteur), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tuteur> updateTuteur(@PathVariable Long id, @Valid @RequestBody Tuteur tuteur) {
        return tuteurService.getTuteurById(id)
                .map(existingTuteur -> {
                    tuteur.setId(id);
                    return ResponseEntity.ok(tuteurService.saveTuteur(tuteur));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTuteur(@PathVariable Long id) {
        return tuteurService.getTuteurById(id)
                .map(tuteur -> {
                    tuteurService.deleteTuteur(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}