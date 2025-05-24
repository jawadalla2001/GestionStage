package com.gestion.stage.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
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
import com.gestion.stage.model.Categorie;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;
import com.gestion.stage.model.Periode;
import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.model.Tuteur;
import com.gestion.stage.service.AppreciationService;
import com.gestion.stage.service.CategorieService;
import com.gestion.stage.service.CompetencesService;
import com.gestion.stage.service.EvaluationService;
import com.gestion.stage.service.PeriodeService;
import com.gestion.stage.service.StageService;
import com.gestion.stage.service.StagiaireService;
import com.gestion.stage.service.TuteurService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/periodes")
@CrossOrigin(origins = "*")
public class PeriodeController {

    private final PeriodeService periodeService;
    private final StageService stageService;
    private final TuteurService tuteurService;
    private final StagiaireService stagiaireService;
    private final AppreciationService appreciationService;
    private final CategorieService categorieService;
    private final CompetencesService competencesService;
    private final EvaluationService evaluationService;

    @Autowired
    public PeriodeController(PeriodeService periodeService, StageService stageService, TuteurService tuteurService, StagiaireService stagiaireService, AppreciationService appreciationService, CategorieService categorieService, CompetencesService competencesService, EvaluationService evaluationService) {
        this.periodeService = periodeService;
        this.stageService = stageService;
        this.tuteurService = tuteurService;
        this.stagiaireService = stagiaireService;
        this.appreciationService = appreciationService;
        this.categorieService = categorieService;
        this.competencesService = competencesService;
        this.evaluationService = evaluationService;
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
            @PathVariable @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(periodeService.getPeriodesDebutantApres(date));
    }

    @GetMapping("/fin-avant/{date}")
    public ResponseEntity<List<Periode>> getPeriodesFinissantAvant(
            @PathVariable @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(periodeService.getPeriodesFinissantAvant(date));
    }

    @GetMapping("/stagiaire/{stagiaireId}")
    public ResponseEntity<List<Periode>> getPeriodesByStagiaire(@PathVariable Long stagiaireId) {
        return stagiaireService.getStagiaireById(stagiaireId)
                .map(stagiaire -> ResponseEntity.ok(periodeService.getPeriodesByStagiaire(stagiaire)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Periode> createPeriode(@Valid @RequestBody Periode periode) {
        // Vérifier si le stage est spécifié
        if (periode.getStage() == null || periode.getStage().getId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        return stageService.getStageById(periode.getStage().getId())
            .map(stage -> {
                periode.setStage(stage);

                // Vérifier si le stagiaire est spécifié
                if (periode.getStagiaire() != null && periode.getStagiaire().getId() != null) {
                    stagiaireService.getStagiaireById(periode.getStagiaire().getId()).ifPresent(periode::setStagiaire);
                }

                // Vérifier si le tuteur est spécifié
                if (periode.getTuteur() != null && periode.getTuteur().getId() != null) {
                    tuteurService.getTuteurById(periode.getTuteur().getId()).ifPresent(periode::setTuteur);
                }

                return new ResponseEntity<>(periodeService.savePeriode(periode), HttpStatus.CREATED);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{periodeId}/stagiaire/{stagiaireId}")
    public ResponseEntity<Periode> setStagiaireToPeriode(@PathVariable Long periodeId, @PathVariable Long stagiaireId) {
        Optional<Periode> optionalPeriode = periodeService.getPeriodeById(periodeId);
        Optional<Stagiaire> optionalStagiaire = stagiaireService.getStagiaireById(stagiaireId);

        if (optionalPeriode.isPresent() && optionalStagiaire.isPresent()) {
            Periode periode = optionalPeriode.get();
            Stagiaire stagiaire = optionalStagiaire.get();

            periode.setStagiaire(stagiaire);
            return ResponseEntity.ok(periodeService.savePeriode(periode));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Periode> updatePeriode(@PathVariable Long id, @Valid @RequestBody Periode periode) {
        return periodeService.getPeriodeById(id)
                .map(existingPeriode -> {
                    periode.setId(id);
                    periode.setStage(existingPeriode.getStage()); // Préserver la relation
                    // Preserve stagiaire relationship if not specified
                    if (periode.getStagiaire() == null) {
                        periode.setStagiaire(existingPeriode.getStagiaire());
                    }
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

    /**
     * Associe un tuteur à une période - Méthode POST
     * @param periodeId ID de la période à mettre à jour
     * @param tuteurId ID du tuteur à associer
     * @return La période mise à jour
     */
    @PostMapping("/{periodeId}/tuteur/{tuteurId}")
    public ResponseEntity<Periode> associateTuteurToPeriodePost(@PathVariable Long periodeId, @PathVariable Long tuteurId) {
        System.out.println("POST association tuteur " + tuteurId + " à période " + periodeId);
        return associateTuteurToPeriode(periodeId, tuteurId);
    }

    /**
     * Associe un tuteur à une période - Méthode PUT
     * @param periodeId ID de la période à mettre à jour
     * @param tuteurId ID du tuteur à associer
     * @return La période mise à jour
     */
    @PutMapping("/{periodeId}/tuteur/{tuteurId}")
    public ResponseEntity<Periode> associateTuteurToPeriodePut(@PathVariable Long periodeId, @PathVariable Long tuteurId) {
        System.out.println("PUT association tuteur " + tuteurId + " à période " + periodeId);
        return associateTuteurToPeriode(periodeId, tuteurId);
    }

    /**
     * Méthode privée commune pour associer un tuteur à une période
     */
    private ResponseEntity<Periode> associateTuteurToPeriode(Long periodeId, Long tuteurId) {
        System.out.println("Tentative d'association tuteur " + tuteurId + " à période " + periodeId);

        Optional<Periode> optionalPeriode = periodeService.getPeriodeById(periodeId);
        Optional<Tuteur> optionalTuteur = tuteurService.getTuteurById(tuteurId);

        // Vérifier si la période et istent
        if (!optionalPeriode.isPresent()) {
            System.out.println("Période non trouvée avec ID: " + periodeId);
            return ResponseEntity.notFound().build();
        }

        if (!optionalTuteur.isPresent()) {
            System.out.println("Tuteur non trouvé avec ID: " + tuteurId);
            return ResponseEntity.notFound().build();
        }

        // Si les deux existent, procéder à l'association
        Periode periode = optionalPeriode.get();
        Tuteur tuteur = optionalTuteur.get();

        // Associer le tuteur à la période
        periode.setTuteur(tuteur);
        Periode updatedPeriode = periodeService.savePeriode(periode);
        System.out.println("Association réussie: tuteur " + tuteurId + " à période " + periodeId);

        return ResponseEntity.ok(updatedPeriode);
    }

    /**
     * Endpoint dédié pour le test complet qui créera toutes les nécessaires
     */
    @PostMapping("/complete-test")
    public ResponseEntity<Object> completeTest(@RequestBody Object testData) {
        try {
            // Récupérer les données existantes
            List<Periode> periodes = periodeService.getAllPeriodes();
            if (periodes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Aucune période trouvée. Veuillez créer une période d'abord."));
            }

            Periode periode = periodes.get(0); // Utiliser la première période existante

            // Vérifier si un tuteur est associé, sinon en créer un
            Tuteur tuteur = periode.getTuteur();
            if (tuteur == null) {
                // Chercher un tuteur existant
                List<Tuteur> existingTuteurs = tuteurService.getAllTuteurs();
                if (!existingTuteurs.isEmpty()) {
                    tuteur = existingTuteurs.get(0);
                } else {
                    // Créer un tuteur par défaut
                    tuteur = new Tuteur();
                    tuteur.setNom("Tuteur");
                    tuteur.setPrenom("Default");
                    tuteur.setEmail("default.tuteur@example.com");
                    tuteur.setEntreprise("Entreprise par défaut");
                    tuteur = tuteurService.saveTuteur(tuteur);
                }

                // Associer le tuteur à la période
                periode.setTuteur(tuteur);
                periode = periodeService.savePeriode(periode);
                System.out.println("Tuteur par défaut associé à la période ID: " + periode.getId());
            }

            // Créer une appréciation
            Appreciation appreciation = new Appreciation();
            appreciation.setPeriode(periode);
            appreciation.setTuteur(tuteur);
            appreciation = appreciationService.saveAppreciation(appreciation);

            // Créer une catégorie
            Categorie categorie = new Categorie();
            categorie.setIntitule("Catégorie test");
            categorie.setValeur(5.0);
            categorie = categorieService.saveCategorie(categorie);

            // Créer une compétence
            Competences competence = new Competences();
            competence.setIntitule("Compétence test");
            competence.setNote(4.0);
            competence.setCategorie(categorie);
            competence = competencesService.saveCompetences(competence);

            // Créer une évaluation
            Evaluation evaluation = new Evaluation();
            evaluation.setValeur(4.5);
            evaluation.setCategorieStr("Évaluation test");
            evaluation = evaluationService.saveEvaluation(evaluation);

            // Lier l'évaluation à l'appréciation
            appreciation.setEvaluation(evaluation);
            appreciationService.saveAppreciation(appreciation);

            return ResponseEntity.ok().body(Map.of(
                "message", "Test complet exécuté avec succès. Données créées dans toutes les tables."
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // Méthode pour récupérer tuteur associé à une période
    @GetMapping("/{periodeId}/tuteur")
    public ResponseEntity<Tuteur> getTuteurByPeriode(@PathVariable Long periodeId) {
        Optional<Periode> optionalPeriode = periodeService.getPeriodeById(periodeId);

        if (optionalPeriode.isPresent()) {
            Periode periode = optionalPeriode.get();
            if (periode.getTuteur() != null) {
                return ResponseEntity.ok(periode.getTuteur());
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}