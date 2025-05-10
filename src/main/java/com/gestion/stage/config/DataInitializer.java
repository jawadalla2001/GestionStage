package com.gestion.stage.config;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
 */
@Configuration
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
     * Creates a CommandLineRunner bean to initialize default categories in the database.
     * This runs on application startup after the database is initialized.
     */
    @Bean
    @Order(1)
    public CommandLineRunner initCategories() {
        return args -> {
            logger.info("Initializing default categories...");

            // Default categories to be created if they don't exist
            List<Categorie> defaultCategories = Arrays.asList(
                createCategorie("Implication", 3.0),
                createCategorie("Ouverture d'esprit", 3.0),
                createCategorie("Qualité du travail", 3.0)
            );

            // Initialize each category
            for (Categorie categorie : defaultCategories) {
                initializeCategorie(categorie);
            }

            logger.info("Categories initialization completed");
        };
   }

    /**
     * Creates a CommandLineRunner bean to initialize default competences in the database.
     * This runs on application startup after categories are initialized.
     */
    @Bean
    @Order(2)
    public CommandLineRunner initCompetences() {
        return args -> {
            logger.info("Initializing default competences...");

            // Default competences to be created if they don't exist
            List<Competences> defaultCompetences = Arrays.asList(
                createCompetence("Communication", 3.0),
                createCompetence("Travail en équipe", 3.0),
                createCompetence("Résolution de problèmes", 3.0),
                createCompetence("Autonomie", 3.0),
                createCompetence("Analyser le fonctionnement de l'entreprise d'accueil", 3.0),
                createCompetence("Déceler et comprendre la politique environnementale de l'entreprise", 3.0),
                createCompetence("Rechercher, sélectionner l'information nécessaire à ses activités", 3.0),
                createCompetence("Assurer la conception préliminaire de produits / services / processus / usages", 3.0)
            );

            // Initialize each competence
            for (Competences competence : defaultCompetences) {
                initializeCompetence(competence);
            }

            logger.info("Competences initialization completed");
        };
    }

    /**
     * Creates a CommandLineRunner bean to initialize a default tutor and appreciations if they don't exist.
     * This runs after categories and competences are initialized.
     */
    @Bean
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
     * appreciations to categories and competences.
     * This runs after tuteur and appreciation are initialized.
     */
    @Bean
    @Order(4)
    public CommandLineRunner initEvaluations() {
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

            // Create competence evaluations
            List<Competences> competences = competencesRepository.findAll();
            for (Competences competence : competences) {
                initializeCompetenceEvaluation(defaultAppreciation, competence);
            }

            logger.info("Evaluations initialization completed");
        };
    }

    /**
     * Creates a new Categorie object with the given intitule and valeur.
     */
    private Categorie createCategorie(String intitule, Double valeur) {
        Categorie categorie = new Categorie();
        categorie.setIntitule(intitule);
        categorie.setValeur(valeur);
        return categorie;
    }

    /**
     * Creates a new Competences object with the given intitule and note.
     */
    private Competences createCompetence(String intitule, Double note) {
        Competences competence = new Competences();
        competence.setIntitule(intitule);
        competence.setNote(note);
        return competence;
    }

    /**
     * Initializes a categorie if it doesn't exist in the database.
     */
    @Transactional
    private void initializeCategorie(Categorie categorie) {
        String intitule = categorie.getIntitule();

        // Check if the categorie already exists
        if (categorieRepository.findByIntitule(intitule).isEmpty()) {
            logger.info("Creating default categorie: {}", intitule);
            categorieRepository.save(categorie);
        } else {
            logger.info("Categorie already exists: {}", intitule);
        }
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
            defaultAppreciation.setDescription("Appréciation par défaut pour les évaluations");
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
    private void initializeCategoryEvaluation(Appreciation appreciation, Categorie categorie) {
        // Check if this evaluation already exists
        boolean exists = evaluationRepository.existsByAppreciationAndCategorie(appreciation, categorie);

        if (!exists) {
            Evaluation evaluation = new Evaluation();
            evaluation.setAppreciation(appreciation);
            evaluation.setCategorie(categorie);
            evaluation.setValeur(categorie.getValeur());
            evaluation.setCommentaire("Évaluation par défaut pour " + categorie.getIntitule());

            logger.info("Creating evaluation for category: {} (ID: {})", categorie.getIntitule(), categorie.getId());
            evaluationRepository.save(evaluation);
        } else {
            logger.info("Evaluation already exists for category: {} (ID: {})", categorie.getIntitule(), categorie.getId());
        }
    }

    /**
     * Initializes an evaluation that links the given appreciation to the given competence.
     */
    @Transactional
    private void initializeCompetenceEvaluation(Appreciation appreciation, Competences competence) {
        // Check if this evaluation already exists
        boolean exists = evaluationRepository.existsByAppreciationAndCompetences(appreciation, competence);

        if (!exists) {
            Evaluation evaluation = new Evaluation();
            evaluation.setAppreciation(appreciation);
            evaluation.setCompetences(competence);
            evaluation.setValeur(competence.getNote());
            evaluation.setCommentaire("Évaluation par défaut pour " + competence.getIntitule());

            logger.info("Creating evaluation for competence: {} (ID: {})", competence.getIntitule(), competence.getId());
            evaluationRepository.save(evaluation);
        } else {
            logger.info("Evaluation already exists for competence: {} (ID: {})", competence.getIntitule(), competence.getId());
        }
    }
}