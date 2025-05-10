package com.gestion.stage.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.gestion.stage.model.Periode;
import com.gestion.stage.service.PeriodeService;
import com.gestion.stage.service.StageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/periodes")
@CrossOrigin(origins = "*")
public class PeriodeController {

    private final PeriodeService periodeService;
    private final StageService stageService;

    @Autowired
    public PeriodeController(PeriodeService periodeService, StageService stageService) {
        this.periodeService = periodeService;
        this.stageService = stageService;
    }

    @GetMapping
    public ResponseEntity<List<Periode>> getAllPeriodes() {
        return ResponseEntity.ok(periodeService.getAllPeriodes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Periode> getPeriodeById(@PathVariable Long id) {
        return periodeService.getPeriodeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/debut-apres/{date}")
    public ResponseEntity<List<Periode>> getPeriodesDebutantApres(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        return ResponseEntity.ok(periodeService.getPeriodesDebutantApres(date));
    }

    @GetMapping("/fin-avant/{date}")
    public ResponseEntity<List<Periode>> getPeriodesFinissantAvant(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        return ResponseEntity.ok(periodeService.getPeriodesFinissantAvant(date));
    }

    @PostMapping("/stage/{stageId}")
    public ResponseEntity<Periode> createPeriode(@PathVariable Long stageId, @Valid @RequestBody Periode periode) {
        return stageService.getStageById(stageId)
                .map(stage -> {
                    periode.setStage(stage);
                    return new ResponseEntity<>(periodeService.savePeriode(periode), HttpStatus.CREATED);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Periode> updatePeriode(@PathVariable Long id, @Valid @RequestBody Periode periode) {
        return periodeService.getPeriodeById(id)
                .map(existingPeriode -> {
                    periode.setId(id);
                    periode.setStage(existingPeriode.getStage()); // Préserver la relation
                    return ResponseEntity.ok(periodeService.savePeriode(periode));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeriode(@PathVariable Long id) {
        return periodeService.getPeriodeById(id)
                .map(periode -> {
                    periodeService.deletePeriode(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}