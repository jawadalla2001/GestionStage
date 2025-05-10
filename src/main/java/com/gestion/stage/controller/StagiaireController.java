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

import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.service.StagiaireService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stagiaires")
@CrossOrigin(origins = "*")
public class StagiaireController {

    private final StagiaireService stagiaireService;

    @Autowired
    public StagiaireController(StagiaireService stagiaireService) {
        this.stagiaireService = stagiaireService;
    }

    @GetMapping
    public ResponseEntity<List<Stagiaire>> getAllStagiaires() {
        return ResponseEntity.ok(stagiaireService.getAllStagiaires());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stagiaire> getStagiaireById(@PathVariable Long id) {
        return stagiaireService.getStagiaireById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Stagiaire> getStagiaireByEmail(@PathVariable String email) {
        return stagiaireService.getStagiaireByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Stagiaire> createStagiaire(@Valid @RequestBody Stagiaire stagiaire) {
        return new ResponseEntity<>(stagiaireService.saveStagiaire(stagiaire), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stagiaire> updateStagiaire(@PathVariable Long id, @Valid @RequestBody Stagiaire stagiaire) {
        return stagiaireService.getStagiaireById(id)
                .map(existingStagiaire -> {
                    stagiaire.setId(id);
                    return ResponseEntity.ok(stagiaireService.saveStagiaire(stagiaire));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStagiaire(@PathVariable Long id) {
        return stagiaireService.getStagiaireById(id)
                .map(stagiaire -> {
                    stagiaireService.deleteStagiaire(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}