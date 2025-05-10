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
import com.gestion.stage.service.AppreciationService;
import com.gestion.stage.service.TuteurService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appreciations")
@CrossOrigin(origins = "*")
public class AppreciationController {

    private final AppreciationService appreciationService;
    private final TuteurService tuteurService;

    @Autowired
    public AppreciationController(AppreciationService appreciationService, TuteurService tuteurService) {
        this.appreciationService = appreciationService;
        this.tuteurService = tuteurService;
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

    @PostMapping("/tuteur/{tuteurId}")
    public ResponseEntity<Appreciation> createAppreciation(@PathVariable Long tuteurId, @Valid @RequestBody Appreciation appreciation) {
        return tuteurService.getTuteurById(tuteurId)
                .map(tuteur -> {
                    appreciation.setTuteur(tuteur);
                    return new ResponseEntity<>(appreciationService.saveAppreciation(appreciation), HttpStatus.CREATED);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appreciation> updateAppreciation(@PathVariable Long id, @Valid @RequestBody Appreciation appreciation) {
        return appreciationService.getAppreciationById(id)
                .map(existingAppreciation -> {
                    appreciation.setId(id);
                    appreciation.setTuteur(existingAppreciation.getTuteur()); // Préserver la relation
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
