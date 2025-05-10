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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.gestion.stage.dto.StageCreateDTO;
import com.gestion.stage.model.Stage;
import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.model.Tuteur;
import com.gestion.stage.repository.StagiaireRepository;
import com.gestion.stage.repository.TuteurRepository;
import com.gestion.stage.service.StageService;
import com.gestion.stage.service.StagiaireService;
import com.gestion.stage.service.TuteurService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*")
public class StageController {

    private final StageService stageService;
    private final StagiaireService stagiaireService;
    private final TuteurService tuteurService;

    @Autowired
    public StageController(StageService stageService, StagiaireService stagiaireService, TuteurService tuteurService) {
        this.stageService = stageService;
        this.stagiaireService = stagiaireService;
        this.tuteurService = tuteurService;
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
        return stagiaireService.getStagiaireById(stagiaireId)
                .map(stagiaire -> ResponseEntity.ok(stageService.getStagesByStagiaire(stagiaire)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tuteur/{tuteurId}")
    public ResponseEntity<List<Stage>> getStagesByTuteur(@PathVariable Long tuteurId) {
        return tuteurService.getTuteurById(tuteurId)
                .map(tuteur -> ResponseEntity.ok(stageService.getStagesByTuteur(tuteur)))
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

    @Autowired
    private StagiaireRepository stagiaireRepository;

    @Autowired
    private TuteurRepository tuteurRepository;

    /**
     * Create a new stage with stagiaire and tuteur IDs provided
     * This endpoint simplifies stage creatin by avoiding entity reference issues
     *
     * @param stage Stage data without entity references
     * @param stagiaireId ID of the stagiaire
     * @param tuteurId ID of the tuteur
     * @return The created stage
     */
    /**
     * Ultra-explicit version of create-with-ids with manual parameter handling
     */
    @PostMapping("/create-with-ids")
    public ResponseEntity<Stage> createStageWithIds(
            @Valid @RequestBody Stage stage,
            @RequestParam String stagiaireId,
            @RequestParam String tuteurId) {

        try {
            System.out.println("Creating stage with raw ID strings: stagiaireId=" + stagiaireId + ", tuteurId=" + tuteurId);

            // Manual parameter validation and conversion
            if (stagiaireId == null || stagiaireId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du stagiaire est obligatoire et doit être un nombre");
            }

            if (tuteurId == null || tuteurId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du tuteur est obligatoire et doit être un nombre");
            }

            // Ultra explicit parameter conversion
            Long stagiaireIdLong;
            Long tuteurIdLong;

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

            try {
                tuteurIdLong = Long.valueOf(tuteurId.trim());
                if (tuteurIdLong <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "L'ID du tuteur doit être un nombre positif: " + tuteurId);
                }
                System.out.println("Parsed tuteurId: " + tuteurIdLong + " (type: Long)");
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du tuteur doit être un nombre valide: " + tuteurId);
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

            Tuteur tuteur = null;
            try {
                tuteur = tuteurRepository.findById(tuteurIdLong)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Tuteur not found with id: " + tuteurIdLong));
                System.out.println("Found tuteur: " + tuteur);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Erreur lors de la récupération du tuteur: " + e.getMessage());
            }

            // Set the entities on the stage
            stage.setStagiaire(stagiaire);
            stage.setTuteur(tuteur);
            stage.setPeriode(null); // Explicitly set periode to null to avoid cascade issues

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
        return stageService.getStageById(id)
                .map(existingStage -> {
                    stage.setId(id);
                    return ResponseEntity.ok(stageService.saveStage(stage));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new stage using DTO with direct stagiaireId and tuteurId fields
     * This approach simplifies frontend-to-backend communication by putting all data in request body
     *
     * @param stageCreateDTO DTO containing stage data and entity IDs
     * @return The created stage
     */
    @PostMapping("/create-from-dto")
    public ResponseEntity<Stage> createStageFromDTO(@Valid @RequestBody StageCreateDTO stageCreateDTO) {
        try {
            // Log the received DTO data for debugging
            System.out.println("Received StageCreateDTO: " + stageCreateDTO.toString());

            // Validate required fields manually
            if (stageCreateDTO.getDescription() == null || stageCreateDTO.getDescription().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La description du stage est obligatoire");
            }

            if (stageCreateDTO.getObjectif() == null || stageCreateDTO.getObjectif().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'objectif du stage est obligatoire");
            }

            if (stageCreateDTO.getEntreprise() == null || stageCreateDTO.getEntreprise().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'entreprise du stage est obligatoire");
            }

            // Explicit manual ID validation and conversion
            if (stageCreateDTO.getStagiaireId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du stagiaire est obligatoire et doit être un nombre");
            } else {
                // Add additional check and try to parse if needed
                try {
                    // Get the ID and confirm it's a number by trying to use it
                    Long stagiaireId = stageCreateDTO.getStagiaireId();
                    if (stagiaireId <= 0) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "L'ID du stagiaire doit être un nombre positif, valeur reçue: " + stagiaireId);
                    }
                } catch (NumberFormatException e) {
                    // This should only happen if something went very wrong with JSON parsing
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "L'ID du stagiaire doit être un nombre, erreur: " + e.getMessage());
                }
            }

            if (stageCreateDTO.getTuteurId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du tuteur est obligatoire et doit être un nombre");
            } else {
                // Add additional check and try to parse if needed
                try {
                    // Get the ID and confirm it's a number by trying to use it
                    Long tuteurId = stageCreateDTO.getTuteurId();
                    if (tuteurId <= 0) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "L'ID du tuteur doit être un nombre positif, valeur reçue: " + tuteurId);
                    }
                } catch (NumberFormatException e) {
                    // This should only happen if something went very wrong with JSON parsing
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "L'ID du tuteur doit être un nombre, erreur: " + e.getMessage());
                }
            }

            // Fetch entities by ID
            Stagiaire stagiaire = null;
            try {
                Long stagiaireId = stageCreateDTO.getStagiaireId();
                System.out.println("Looking for stagiaire with ID: " + stagiaireId + " (type: " +
                    (stagiaireId != null ? stagiaireId.getClass().getName() : "null") + ")");

                stagiaire = stagiaireRepository.findById(stagiaireId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Stagiaire not found with id: " + stagiaireId));

                System.out.println("Found stagiaire: " + stagiaire);
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du stagiaire est invalide: " + e.getMessage());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Erreur lors de la récupération du stagiaire: " + e.getMessage());
            }

            Tuteur tuteur = null;
            try {
                Long tuteurId = stageCreateDTO.getTuteurId();
                System.out.println("Looking for tuteur with ID: " + tuteurId + " (type: " +
                    (tuteurId != null ? tuteurId.getClass().getName() : "null") + ")");

                tuteur = tuteurRepository.findById(tuteurId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Tuteur not found with id: " + tuteurId));

                System.out.println("Found tuteur: " + tuteur);
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ID du tuteur est invalide: " + e.getMessage());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Erreur lors de la récupération du tuteur: " + e.getMessage());
            }

            // Create and populate stage entity
            Stage stage = new Stage();
            stage.setDescription(stageCreateDTO.getDescription().trim());
            stage.setObjectif(stageCreateDTO.getObjectif().trim());
            stage.setEntreprise(stageCreateDTO.getEntreprise().trim());
            stage.setStagiaire(stagiaire);
            stage.setTuteur(tuteur);
            stage.setPeriode(null); // Explicitly set periode to null to avoid cascade issues

            // Save the stage with detailed error handling
            try {
                Stage savedStage = stageService.saveStage(stage);
                return new ResponseEntity<>(savedStage, HttpStatus.CREATED);
            } catch (Exception e) {
                System.err.println("Error saving stage: " + e.getMessage());
                e.printStackTrace();
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Erreur lors de l'enregistrement du stage dans la base de données: " + e.getMessage());
            }
        } catch (ResponseStatusException e) {
            throw e; // Re-throw as-is for specific errors
        } catch (Exception e) {
            System.err.println("Unexpected error in createStageFromDTO: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Erreur inattendue lors de la création du stage: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStage(@PathVariable Long id) {
        return stageService.getStageById(id)
                .map(stage -> {
                    stageService.deleteStage(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}