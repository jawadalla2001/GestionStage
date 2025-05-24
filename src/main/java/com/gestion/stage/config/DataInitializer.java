package com.gestion.stage.config;

// import java.util.Arrays; // Supprimé
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;

import com.gestion.stage.model.Appreciation;
import com.gestion.stage.model.Categorie;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;
import com.gestion.stage.model.Tuteur;
import com.gestion.stage.repository.AppreciationRepository;
import com.gestion.stage.repository.CategorieRepository;
import com.gestion.stage.repository.CompetencesRepository;
import com.gestion.stage.repository.EvaluationRepository;
import com.gestion.stage.repository.TuteurRepository;

import jakarta.transaction.Transactional;

/**
 * Configuration class to initialize default data in the database.
 * Ensures that essential categories, competences, and evaluations exist when the application starts.
 *
 * REMARQUE IMPORTANTE:
 * Cette classe est désormais activée pour permettre la création automatique de données par défaut.
 * Pour la désactiver, commentez l'annotation @Configuration ci-dessous.
 */
// @Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private CompetencesRepository competencesRepository;

    @Autowired
    private TuteurRepository tuteurRepository;

    @Autowired
    private AppreciationRepository appreciationRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    /**
     * Creates a CommandLineRunner bean to initialize default categories and detailed competences in the database.
     * This runs on application startup after the database is initialized.
     */
    @Bean
    @Order(1)
    public CommandLineRunner initCategoriesAndCompetences() {
        return args -> {
            logger.info("Initializing default categories and detailed competences...");

            // Define and initialize main categories and their specific competences
            initializeQualiteDuTravail();
            initializeOuvertureAuxAutres();
            initializeImplication();

            // Keep other initializations if necessary, or remove/modify them
            // For now, focusing on the user's request for these three areas.
            // The old generic initCompetences() and complex initEvaluations() might need review/removal later.

            logger.info("Categories and detailed competences initialization completed");
        };
   }

    // Method to initialize "Qualité du travail" and its competences
    @Transactional
    private void initializeQualiteDuTravail() {
        String categoryName = "Qualité du travail";
        Categorie qualiteCategorie = findOrCreateCategorie(categoryName, 0.0); // Main category value might be symbolic

        createCompetenceIfNotExists("Médiocre (Qualité)", 4.0, qualiteCategorie);
        createCompetenceIfNotExists("Acceptable (Qualité)", 10.0, qualiteCategorie);
        createCompetenceIfNotExists("Bonne (Qualité)", 14.0, qualiteCategorie);
        createCompetenceIfNotExists("Très bonne (Qualité)", 16.0, qualiteCategorie);
        createCompetenceIfNotExists("Très professionnelle (Qualité)", 18.0, qualiteCategorie);
    }

    // Method to initialize "Ouverture aux autres" and its competences
    @Transactional
    private void initializeOuvertureAuxAutres() {
        String categoryName = "Ouverture aux autres";
        Categorie ouvertureCategorie = findOrCreateCategorie(categoryName, 0.0);

        createCompetenceIfNotExists("Isolé(e) ou en opposition (Ouverture)", 8.0, ouvertureCategorie);
        createCompetenceIfNotExists("Renfermé(e) ou obtus (Ouverture)", 6.0, ouvertureCategorie); // Note: User specified 6 for this, lower than 8.
        createCompetenceIfNotExists("Bonne (Ouverture)", 14.0, ouvertureCategorie);
        createCompetenceIfNotExists("Très bonne (Ouverture)", 16.0, ouvertureCategorie);
        createCompetenceIfNotExists("Excellente (Ouverture)", 18.0, ouvertureCategorie);
    }

    // Method to initialize "Implication dans ses activités" and its competences
    @Transactional
    private void initializeImplication() {
        String categoryName = "Implication dans ses activités";
        Categorie implicationCategorie = findOrCreateCategorie(categoryName, 0.0);

        createCompetenceIfNotExists("Paresseux (Implication)", 8.0, implicationCategorie);
        createCompetenceIfNotExists("Le juste nécessaire (Implication)", 12.0, implicationCategorie);
        createCompetenceIfNotExists("Bonne (Implication)", 14.0, implicationCategorie);
        createCompetenceIfNotExists("Très forte (Implication)", 16.0, implicationCategorie);
        createCompetenceIfNotExists("Dépasse ses objectifs (Implication)", 18.0, implicationCategorie);
    }

    // Helper to find or create a Categorie
    private Categorie findOrCreateCategorie(String intitule, Double defaultValue) {
        return categorieRepository.findByIntitule(intitule).orElseGet(() -> {
            logger.info("Creating default categorie: {}", intitule);
            Categorie categorie = new Categorie();
            categorie.setIntitule(intitule);
            categorie.setValeur(defaultValue); // This 'valeur' on the main Categorie might be symbolic or an average
            return categorieRepository.save(categorie);
        });
    }

    // Helper to create Competence if it doesn't exist, linked to a Categorie
    private void createCompetenceIfNotExists(String intitule, Double note, Categorie categorie) {
        if (competencesRepository.findByIntituleAndCategorie(intitule, categorie).isEmpty()) {
            logger.info("Creating default competence: {} for categorie: {}", intitule, categorie.getIntitule());
            Competences competence = new Competences();
            competence.setIntitule(intitule);
            competence.setNote(note);
            competence.setCategorie(categorie);
            competencesRepository.save(competence);
        } else {
            logger.info("Competence already exists: {} for categorie: {}", intitule, categorie.getIntitule());
        }
    }

    /*
     The old initCompetences(), initTuteurAndAppreciation(), initEvaluations(),
     createCategorie(), createCompetence(), initializeCategorie(), initializeCompetence(),
     initializeDefaultTuteur(), initializeDefaultAppreciation(), initializeCategoryEvaluation() methods
     might need to be reviewed, modified, or removed if their functionality is now covered
     or conflicts with the new granular competence initialization.
     For now, I am commenting out the @Bean definitions for the old runner methods
     to avoid conflicts and focus on the new structure.
    */

    /**
     * Creates a CommandLineRunner bean to initialize default competences in the database.
     * This runs on application startup after categories are initialized.
     */
    // @Bean // Commented out to avoid conflict with new initCategoriesAndCompetences
    // @Order(2)
    public CommandLineRunner initCompetencesOld() { // Renamed to avoid signature clash if uncommented
        return args -> {
            logger.info("Initializing default competences...");

            // Default competences to be created if they don't exist
            // List<Competences> defaultCompetences = Arrays.asList(
            //     createCompetence("Communication", 3.0), // Appel à la méthode qui sera supprimée
            //     createCompetence("Travail en équipe", 3.0),
            //     createCompetence("Résolution de problèmes", 3.0),
            //     createCompetence("Autonomie", 3.0),
            //     createCompetence("Analyser le fonctionnement de l'entreprise d'accueil", 3.0),
            //     createCompetence("Déceler et comprendre la politique environnementale de l'entreprise", 3.0),
            //     createCompetence("Rechercher, sélectionner l'information nécessaire à ses activités", 3.0),
            //     createCompetence("Assurer la conception préliminaire de produits / services / processus / usages", 3.0)
            // );

            // Initialize each competence
            // for (Competences competence : defaultCompetences) {
            //    initializeCompetence(competence); // Appel à la méthode qui sera supprimée
            // }

            logger.info("Competences initialization completed");
        };
    }

    /**
     * Creates a CommandLineRunner bean to initialize a default tutor and appreciations if they don't exist.
     * This runs after categories and competences are initialized.
     */
    @Bean // This might still be useful for a default Tuteur if your form doesn't create one.
    @Order(3)
    public CommandLineRunner initTuteurAndAppreciation() {
        return args -> {
            logger.info("Initializing default tuteur and appreciation...");

            // Create a default tuteur if none exists
            Tuteur defaultTuteur = initializeDefaultTuteur();

            if (defaultTuteur != null) {
                // Create a default appreciation linked to the tuteur if none exists
                initializeDefaultAppreciation(defaultTuteur);
            }

            logger.info("Tuteur and appreiation initialization completed");
        };
    }

    /**
     * Creates a CommandLineRunner bean to initialize default evaluations that link
     * appreciations to categories.
     * This runs after tuteur and appreciation are initialized.
     */
    // @Bean // Commented out as its logic might conflict with new competence structure
    // @Order(4)
    public CommandLineRunner initEvaluationsOld() { // Renamed
        return args -> {
            logger.info("Initializing default evaluations...");

            // Find the default appreciation
            List<Appreciation> appreciations = appreciationRepository.findAll();
            if (appreciations.isEmpty()) {
                logger.warn("No appreciations found, cannot create evaluations");
                return;
            }

            Appreciation defaultAppreciation = appreciations.get(0);
            logger.info("Found appreciation with ID: {}", defaultAppreciation.getId());

            // Create category evaluations
            List<Categorie> categories = categorieRepository.findAll();
            for (Categorie categorie : categories) {
                initializeCategoryEvaluation(defaultAppreciation, categorie);
            }

            logger.info("Evaluations initialization completed");
        };
    }

    /**
     * Initializes a competence if it doesn't exist in the database.
     */
    @Transactional
    private void initializeCompetence(Competences competence) {
        String intitule = competence.getIntitule();

        // Check if the competence already exists
        if (competencesRepository.findByIntitule(intitule).isEmpty()) {
            logger.info("Creating default competence: {}", intitule);
            competencesRepository.save(competence);
        } else {
            logger.info("Competence already exists: {}", intitule);
        }
    }

    /**
     * Initializes a default tuteur if none exists in the database.
     */
    @Transactional
    private Tuteur initializeDefaultTuteur() {
        // Check if any tuteur already exists
        List<Tuteur> existingTuteurs = tuteurRepository.findAll();
        if (!existingTuteurs.isEmpty()) {
            Tuteur existingTuteur = existingTuteurs.get(0);
            logger.info("Using existing tuteur: {} {}", existingTuteur.getNom(), existingTuteur.getPrenom());
            return existingTuteur;
        }

        // Create a new default tuteur
        Tuteur defaultTuteur = new Tuteur();
        defaultTuteur.setNom("Tuteur");
        defaultTuteur.setPrenom("Default");
        defaultTuteur.setEmail("default.tuteur@example.com");
        defaultTuteur.setEntreprise("Entreprise par défaut");

        logger.info("Creating default tuteur: {} {}", defaultTuteur.getNom(), defaultTuteur.getPrenom());
        return tuteurRepository.save(defaultTuteur);
    }

    /**
     * Initializes a default appreciation linked to the given tuteur if none exists.
     */
    @Transactional
    private Appreciation initializeDefaultAppreciation(Tuteur tuteur) {
        // Check if the tuteur already has appreciations
        if (tuteur != null) {
            List<Appreciation> existingAppreciations = appreciationRepository.findByTuteur(tuteur);
            if (!existingAppreciations.isEmpty()) {
                Appreciation existingAppreciation = existingAppreciations.get(0);
                logger.info("Using existing appreciation with ID: {}", existingAppreciation.getId());
                return existingAppreciation;
            }

            // Create a new default appreciation
            Appreciation defaultAppreciation = new Appreciation();
            defaultAppreciation.setTuteur(tuteur);

            logger.info("Creating default appreciation for tuteur: {} {}", tuteur.getNom(), tuteur.getPrenom());
            return appreciationRepository.save(defaultAppreciation);
        }

        logger.warn("Cannot create appreciation: no tuteur provided");
        return null;
    }

    /**
     * Initializes an evaluation that links the given appreciation to the given category.
     */
    @Transactional
    private void initializeCategoryEvaluation(Appreciation defaultAppreciation, Categorie categorie) {
        // Vérifier si une évaluation existe déjà pour cette catégorie
        boolean evaluationExists = evaluationRepository.existsByCategorieStr(categorie.getIntitule());

        if (!evaluationExists) {
            // Créer une nouvelle évaluation
            Evaluation evaluation = new Evaluation();
            evaluation.setValeur(categorie.getValeur());
            evaluation.setCategorieStr(categorie.getIntitule());
            evaluation = evaluationRepository.save(evaluation);

            // Lier l'appréciation à cette évaluation
            defaultAppreciation.setEvaluation(evaluation);
            appreciationRepository.save(defaultAppreciation);

            logger.info("Creating evaluation for category: {} (ID: {})", categorie.getIntitule(), categorie.getId());

            // Créer aussi une compétence associée
            boolean competenceExists = !competencesRepository.findByIntitule(categorie.getIntitule()).isEmpty();

            if (!competenceExists) {
                // Créer une compétence liée à cette catégorie
                Competences competence = new Competences();
                competence.setIntitule(categorie.getIntitule());
                competence.setNote(categorie.getValeur());
                competence.setCategorie(categorie);
                competence = competencesRepository.save(competence);

                // Créer une autre appréciation pour cette compétence
                Appreciation competenceAppreciation = new Appreciation();
                competenceAppreciation.setTuteur(defaultAppreciation.getTuteur());
                competenceAppreciation.setPeriode(defaultAppreciation.getPeriode());
                competenceAppreciation.setCompetences(competence);
                appreciationRepository.save(competenceAppreciation);

                logger.info("Creating competence for category: {} (ID: {})", categorie.getIntitule(), categorie.getId());
            }
        } else {
            logger.info("Evaluation already exists for category: {} (ID: {})", categorie.getIntitule(), categorie.getId());
        }
    }
}