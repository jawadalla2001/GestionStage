package com.gestion.stage.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.gestion.stage.dto.CompetencyDetailDTO;
import com.gestion.stage.dto.StageCreateDTO;
import com.gestion.stage.model.Appreciation;
import com.gestion.stage.model.Categorie;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;
import com.gestion.stage.model.Periode;
import com.gestion.stage.model.Stage;
import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.model.Tuteur;
import com.gestion.stage.repository.AppreciationRepository;
import com.gestion.stage.repository.CategorieRepository;
import com.gestion.stage.repository.CompetencesRepository;
import com.gestion.stage.repository.EvaluationRepository;
import com.gestion.stage.repository.PeriodeRepository;
import com.gestion.stage.repository.StagiaireRepository;
import com.gestion.stage.repository.TuteurRepository;
import com.gestion.stage.service.StageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*")
public class StageController {

    private static final Logger logger = LoggerFactory.getLogger(StageController.class);

    private final StageService stageService;
    private final StagiaireRepository stagiaireRepository;
    private final TuteurRepository tuteurRepository;
    private final EvaluationRepository evaluationRepository;
    private final AppreciationRepository appreciationRepository;
    private final CategorieRepository categorieRepository;
    private final CompetencesRepository competencesRepository;
    private final PeriodeRepository periodeRepository;

    @Autowired
    public StageController(StageService stageService,
                         StagiaireRepository stagiaireRepository,
                         TuteurRepository tuteurRepository,
                         EvaluationRepository evaluationRepository,
                         AppreciationRepository appreciationRepository,
                         CategorieRepository categorieRepository,
                         CompetencesRepository competencesRepository,
                         PeriodeRepository periodeRepository) {
        this.stageService = stageService;
        this.stagiaireRepository = stagiaireRepository;
        this.tuteurRepository = tuteurRepository;
        this.evaluationRepository = evaluationRepository;
        this.appreciationRepository = appreciationRepository;
        this.categorieRepository = categorieRepository;
        this.competencesRepository = competencesRepository;
        this.periodeRepository = periodeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Stage>> getAllStages() {
        return ResponseEntity.ok(stageService.getAllStages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stage> getStageById(@PathVariable Long id) {
        return stageService.getStageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stagiaire/{stagiaireId}")
    public ResponseEntity<List<Stage>> getStagesByStagiaire(@PathVariable Long stagiaireId) {
        return stagiaireRepository.findById(stagiaireId)
                .map(stagiaire -> ResponseEntity.ok(stageService.getStagesByStagiaire(stagiaire)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/entreprise/{entreprise}")
    public ResponseEntity<List<Stage>> getStagesByEntreprise(@PathVariable String entreprise) {
        return ResponseEntity.ok(stageService.getStagesByEntreprise(entreprise));
    }

    @PostMapping
    public ResponseEntity<Stage> createStage(@Valid @RequestBody Stage stage) {
        try {
            return new ResponseEntity<>(stageService.saveStage(stage), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Erreur lors de la création du stage: " + e.getMessage());
        }
    }

    /**
     * Create a new stage with stagiaire ID provided
     * This endpoint simplifies stage creation by avoiding entity reference issues
     *
     * @param stage Stage data without entity references
     * @param stagiaireId ID of the stagiaire
     * @return The created stage
     */
    @PostMapping("/create-with-ids")
    public ResponseEntity<Stage> createStageWithIds(
            @Valid @RequestBody Stage stage,
            @RequestParam String stagiaireId) {

        try {
            System.out.println("Creating stage with raw ID string: stagiaireId=" + stagiaireId);

            // Manual parameter validation and conversion
            if (stagiaireId == null || stagiaireId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du stagiaire est obligatoire et doit être un nombre");
            }

            // Ultra explicit parameter conversion
            Long stagiaireIdLong;

            try {
                stagiaireIdLong = Long.valueOf(stagiaireId.trim());
                if (stagiaireIdLong <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "L'ID du stagiaire doit être un nombre positif: " + stagiaireId);
                }
                System.out.println("Parsed stagiaireId: " + stagiaireIdLong + " (type: Long)");
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du stagiaire doit être un nombre valide: " + stagiaireId);
            }

            // Fetch the entities from the database using the converted Long values
            Stagiaire stagiaire = null;
            try {
                stagiaire = stagiaireRepository.findById(stagiaireIdLong)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Stagiaire not found with id: " + stagiaireIdLong));
                System.out.println("Found stagiaire: " + stagiaire);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Erreur lors de la récupération du stagiaire: " + e.getMessage());
            }

            // Initialiser la liste des périodes
            stage.setPeriodes(new ArrayList<>());

            // Save the stage
            try {
                Stage savedStage = stageService.saveStage(stage);
                System.out.println("Stage saved successfully with ID: " + savedStage.getId());
                return new ResponseEntity<>(savedStage, HttpStatus.CREATED);
            } catch (Exception e) {
                System.err.println("Error saving stage: " + e.getMessage());
                e.printStackTrace();
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erreur lors de l'enregistrement du stage: " + e.getMessage());
            }
        } catch (ResponseStatusException e) {
            throw e; // Re-throw response exceptions as-is
        } catch (Exception e) {
            System.err.println("Unexpected error in createStageWithIds: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Erreur inattendue lors de la création du stage: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stage> updateStage(@PathVariable Long id, @Valid @RequestBody Stage stage) {
        if (!stageService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        stage.setId(id);
        return ResponseEntity.ok(stageService.saveStage(stage));
    }

    /**
     * Create a new stage using DTO with direct stagiaireId and tuteurId fields
     * This approach simplifies frontend-to-backend communication by putting all data in request body
     *
     * @param stageCreateDTO DTO containing stage data and entity IDs
     * @return The created stage
     */
    @PostMapping("/create-from-dto")
    @Transactional
    public ResponseEntity<Stage> createStageFromDTO(@Valid @RequestBody StageCreateDTO stageCreateDTO) {
        try {
            logger.info("Received StageCreateDTO: {}", stageCreateDTO.toString());

            if (stageCreateDTO.getDateDebut() == null || stageCreateDTO.getDateFin() == null) {
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Les dates de début et de fin sont obligatoires.");
            }
            if (stageCreateDTO.getDateDebut().isAfter(stageCreateDTO.getDateFin())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de début ne peut pas être après la date de fin.");
            }

            // Utilisation des nouvelles méthodes et des champs du DTO
            Stagiaire stagiaire = findOrCreateStagiaire(stageCreateDTO.getStudentName(),
                                                      stageCreateDTO.getStudentEmail(),
                                                      stageCreateDTO.getStagiaireInstitution());
            Tuteur tuteur = findOrCreateTuteur(stageCreateDTO.getTutorName(),
                                                 stageCreateDTO.getTutorEmail(),
                                                 stageCreateDTO.getEntreprise());

            Stage stage = new Stage();
            stage.setDescription(stageCreateDTO.getDescription());
            stage.setObjectif(stageCreateDTO.getObjectif());
            stage.setEntreprise(stageCreateDTO.getEntreprise());
            stage.setStagiaire(stagiaire);
            stage.setTuteur(tuteur);

            Stage savedStage = stageService.saveStage(stage);

            Periode periode = new Periode();
            periode.setStage(savedStage);
            periode.setDateDebut(stageCreateDTO.getDateDebut());
            periode.setDateFin(stageCreateDTO.getDateFin());
            periode.setStagiaire(stagiaire);
            periode.setTuteur(tuteur);
            Periode savedPeriode = periodeRepository.save(periode);
            logger.info("Saved Periode with ID: {}", savedPeriode.getId());

            createEvaluationAndAppreciation("Implication dans ses activités", stageCreateDTO.getImplicationNote(), savedPeriode, tuteur, "Appréciations Générales");
            createEvaluationAndAppreciation("Ouverture aux autres", stageCreateDTO.getOuvertureNote(), savedPeriode, tuteur, "Appréciations Générales");
            createEvaluationAndAppreciation("Qualité du travail", stageCreateDTO.getQualiteTravailNote(), savedPeriode, tuteur, "Appréciations Générales");

            processCompetencyCategory("Compétences liées à l\'individu", stageCreateDTO.getIndividualCompetencies(), stageCreateDTO.getIndividualScore(), savedPeriode, tuteur);
            processCompetencyCategory("Compétences liées à l\'entreprise", stageCreateDTO.getCompanyCompetencies(), stageCreateDTO.getCompanyScore(), savedPeriode, tuteur);
            processCompetencyCategory("Compétences Scientifiques et Techniques", stageCreateDTO.getTechnicalCompetencies(), stageCreateDTO.getTechnicalScore(), savedPeriode, tuteur);
            processCompetencyCategory("Compétences Spécifiques Métier", stageCreateDTO.getSpecificJobCompetencies(), null, savedPeriode, tuteur);

            // Calculate and set average score for "Appréciations Générales"
            try {
                double implicationNote = stageCreateDTO.getImplicationNote() != null ? stageCreateDTO.getImplicationNote() : 0.0;
                double ouvertureNote = stageCreateDTO.getOuvertureNote() != null ? stageCreateDTO.getOuvertureNote() : 0.0;
                double qualiteTravailNote = stageCreateDTO.getQualiteTravailNote() != null ? stageCreateDTO.getQualiteTravailNote() : 0.0;

                int count = 0;
                if (stageCreateDTO.getImplicationNote() != null) {
                    count++;
                }
                if (stageCreateDTO.getOuvertureNote() != null) {
                    count++;
                }
                if (stageCreateDTO.getQualiteTravailNote() != null) {
                    count++;
                }

                double appreciationsGeneralesAvgScore = 0.0;
                if (count > 0) {
                    appreciationsGeneralesAvgScore = (implicationNote + ouvertureNote + qualiteTravailNote) / count;
                }

                Categorie appreciationsGeneralesCat = categorieRepository.findByIntitule("Appréciations Générales")
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Categorie 'Appréciations Générales' not found after creation."));
                appreciationsGeneralesCat.setValeur(appreciationsGeneralesAvgScore);
                categorieRepository.save(appreciationsGeneralesCat);
                logger.info("Updated 'Appréciations Générales' category with average score: {}", appreciationsGeneralesAvgScore);

            } catch (Exception e) {
                logger.error("Error calculating or saving average score for 'Appréciations Générales': ", e);
                // Decide if this should be a fatal error or just logged
            }

                return new ResponseEntity<>(savedStage, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            logger.error("ResponseStatusException in createStageFromDTO: {} - {}", e.getStatusCode(), e.getReason());
            throw e;
        } catch (Exception e) {
            logger.error("Exception in createStageFromDTO: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private int competencyLevelToNumeric(String level) {
        if (level == null) {
			return 0;
		}
        switch (level.toUpperCase()) {
            case "NA": return 0;
            case "DEBUTANT": return 8;
            case "AUTONOME": return 14;
            case "AUTONOME +":
            case "AUTONOME+":
                return 18;
            default: return 0;
        }
    }

    private void processCompetencyCategory(String categoryName,
                                           Map<String, CompetencyDetailDTO> competenciesMap,
                                           @Nullable Integer globalCategoryScore,
                                           Periode periode,
                                           Tuteur tuteur) {
        Double actualGlobalScore;
        if (globalCategoryScore != null) {
            actualGlobalScore = globalCategoryScore.doubleValue();
        } else if ("Compétences Spécifiques Métier".equals(categoryName) && competenciesMap != null && !competenciesMap.isEmpty()) {
            double sum = 0;
            int numCompetencies = 0;
            for (CompetencyDetailDTO detail : competenciesMap.values()) {
                if (detail != null && detail.getLevel() != null) {
                    sum += competencyLevelToNumeric(detail.getLevel());
                    numCompetencies++;
                }
            }
            actualGlobalScore = (numCompetencies > 0) ? (sum / numCompetencies) : 0.0;
            logger.info("Calculated average score for '{}': {}", categoryName, actualGlobalScore);
        } else {
            actualGlobalScore = 0.0;
        }

        final Double finalActualGlobalScore = actualGlobalScore;

        Categorie mainCategorie = categorieRepository.findByIntitule(categoryName)
                .orElseGet(() -> {
                    Categorie newCat = new Categorie();
                    newCat.setIntitule(categoryName);
                    newCat.setValeur(finalActualGlobalScore);
                    return categorieRepository.save(newCat);
                });

        if (mainCategorie.getId() != null && (mainCategorie.getValeur() == null || !mainCategorie.getValeur().equals(finalActualGlobalScore))) {
            mainCategorie.setValeur(finalActualGlobalScore);
            categorieRepository.save(mainCategorie);
        }

        if (competenciesMap == null || competenciesMap.isEmpty()) {
            logger.info("Aucune compétence détaillée fournie pour la catégorie: {}", categoryName);
            return;
        }

        for (Map.Entry<String, CompetencyDetailDTO> entry : competenciesMap.entrySet()) {
            String competenceIntitule = entry.getKey();
            CompetencyDetailDTO detail = entry.getValue();
            if (detail == null) {
                logger.warn("CompetencyDetailDTO is null for competence: {} in category: {}", competenceIntitule, categoryName);
                continue;
            }
            int numericNoteInt = competencyLevelToNumeric(detail.getLevel());
            Double numericNote = (double) numericNoteInt;

            Evaluation evaluation = new Evaluation();
            evaluation.setValeur(numericNote);
            evaluation.setCategorieStr(competenceIntitule);
            evaluation.setCommentaire(detail.getComment());
            evaluationRepository.save(evaluation);

            Competences competence = competencesRepository.findByIntituleAndCategorie(competenceIntitule, mainCategorie)
                .orElseGet(() -> {
                    Competences newComp = new Competences();
                    newComp.setIntitule(competenceIntitule);
                    newComp.setNote(numericNote);
                    newComp.setCategorie(mainCategorie);
                    return competencesRepository.save(newComp);
                });
            if (competence.getId() != null && (competence.getNote() == null || !competence.getNote().equals(numericNote))) {
                 competence.setNote(numericNote);
                 competencesRepository.save(competence);
            }

            Appreciation appreciation = new Appreciation();
            appreciation.setPeriode(periode);
            appreciation.setTuteur(tuteur);
            appreciation.setEvaluation(evaluation);
            appreciation.setCompetences(competence);
            appreciationRepository.save(appreciation);
        }
    }

    private void createEvaluationAndAppreciation(String competenceIntitule, Double note, Periode periode, Tuteur tuteur, String categoryName) {
        if (note == null) {
			return;
		}
        Double noteAsDouble = note;

        Categorie categorie = categorieRepository.findByIntitule(categoryName)
                .orElseGet(() -> {
                    Categorie newCat = new Categorie();
                    newCat.setIntitule(categoryName);
                    newCat.setValeur(0.0);
                    return categorieRepository.save(newCat);
                });

        Evaluation evaluation = new Evaluation();
        evaluation.setCategorieStr(competenceIntitule);
        evaluation.setValeur(noteAsDouble);
        evaluationRepository.save(evaluation);

        Competences competence = competencesRepository.findByIntituleAndCategorie(competenceIntitule, categorie)
            .orElseGet(() -> {
                Competences newComp = new Competences();
                newComp.setIntitule(competenceIntitule);
                newComp.setNote(noteAsDouble);
                newComp.setCategorie(categorie);
                return competencesRepository.save(newComp);
            });
        if (competence.getId() != null && (competence.getNote() == null || !competence.getNote().equals(noteAsDouble))) {
             competence.setNote(noteAsDouble);
             competencesRepository.save(competence);
        }

        Appreciation appreciation = new Appreciation();
        appreciation.setPeriode(periode);
        appreciation.setTuteur(tuteur);
        appreciation.setEvaluation(evaluation);
        appreciation.setCompetences(competence);
        appreciationRepository.save(appreciation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStage(@PathVariable Long id) {
        if (!stageService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        stageService.deleteStage(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method to parse "Prénom Nom" into a String[2] = {prénom, nom}
    // Basic split, assumes first word is prenom, rest is nom.
    private String[] parseNomPrenom(String nomComplet) {
        if (nomComplet == null || nomComplet.trim().isEmpty()) {
            return new String[]{"", ""};
        }
        String[] parts = nomComplet.trim().split("\\s+", 2);
        if (parts.length == 1) {
            return new String[]{"", parts[0]}; // Considérer comme nom si un seul mot
        }
        return new String[]{parts[0], parts[1]};
    }

    private Stagiaire findOrCreateStagiaire(String nomComplet, String email, String institution) {
        if (email == null || email.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'email du stagiaire est obligatoire pour le retrouver ou le créer.");
        }
        // Utiliser l'email comme clé principale pour la recherche/création
        return stagiaireRepository.findByEmail(email.trim()).orElseGet(() -> {
            logger.info("Stagiaire non trouvé avec l'email {}, création en cours...", email);
            String[] nomPrenom = parseNomPrenom(nomComplet);
            Stagiaire newStagiaire = new Stagiaire();
            newStagiaire.setPrenom(nomPrenom[0].trim());
            newStagiaire.setNom(nomPrenom[1].trim());
            newStagiaire.setEmail(email.trim());
            if (newStagiaire.getNom().isEmpty()){
                  throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du stagiaire (partie du nom complet) ne peut pas être vide.");
            }
            // Le prénom peut être vide, mais le nom et l'email sont essentiels.
            newStagiaire.setInstitution((institution != null && !institution.trim().isEmpty()) ? institution.trim() :"N/A");
            return stagiaireRepository.save(newStagiaire);
        });
    }

    private Tuteur findOrCreateTuteur(String nomComplet, String email, String entrepriseNom) {
        if (email == null || email.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'email du tuteur est obligatoire pour le retrouver ou le créer.");
        }
        return tuteurRepository.findByEmail(email.trim()).orElseGet(() -> {
            logger.info("Tuteur non trouvé avec l'email {}, création en cours...", email);
            String[] nomPrenom = parseNomPrenom(nomComplet);
            Tuteur newTuteur = new Tuteur();
            newTuteur.setPrenom(nomPrenom[0].trim());
            newTuteur.setNom(nomPrenom[1].trim());
            newTuteur.setEmail(email.trim());
             if (newTuteur.getNom().isEmpty()){
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du tuteur (partie du nom complet) ne peut pas être vide.");
            }
            if (entrepriseNom == null || entrepriseNom.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom de l'entreprise est obligatoire pour créer un tuteur.");
            }
            newTuteur.setEntreprise(entrepriseNom.trim());
            return tuteurRepository.save(newTuteur);
        });
    }
}