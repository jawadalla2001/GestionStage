package com.gestion.stage.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;

import com.gestion.stage.model.Periode;
import com.gestion.stage.model.Tuteur;
import com.gestion.stage.repository.PeriodeRepository;
import com.gestion.stage.repository.TuteurRepository;

import jakarta.transaction.Transactional;

/**
 * Utilitaire pour réparer les associations manquantes entre Tuteurs et Périodes.
 * Cette classe vérifie et corrige les périodes qui n'ont pas de tuteur associé.
 */
// @Configuration
public class TuteurAssociationFixer {

    private static final Logger logger = LoggerFactory.getLogger(TuteurAssociationFixer.class);

    @Autowired
    private PeriodeRepository periodeRepository;

    @Autowired
    private TuteurRepository tuteurRepository;

    /**
     * Exécuté après l'initialisation des données de base pour s'assurer que
     * toutes les périodes ont un tuteur associé, ce qui est essentiel pour
     * la création d'appréciations et d'évaluations.
     */
    @Bean
    @Order(10) // S'exécute après DataInitializer
    public CommandLineRunner fixTuteurAssociations() {
        return args -> {
            logger.info("Vérification des associations tuteur-période...");

            // Récupérer toutes les périodes sans tuteur
            List<Periode> periodesWithoutTuteur = periodeRepository.findByTuteurIsNull();

            if (periodesWithoutTuteur.isEmpty()) {
                logger.info("Toutes les périodes ont déjà un tuteur associé.");
                return;
            }

            logger.info("Trouvé {} périodes sans tuteur associé.", periodesWithoutTuteur.size());

            // Obtenir ou créer un tuteur par défaut
            Tuteur defaultTuteur = getOrCreateDefaultTuteur();

            if (defaultTuteur == null) {
                logger.error("Impossible de créer un tuteur par défaut. Correction des associations annulée.");
                return;
            }

            // Associer le tuteur par défaut à toutes les périodes sans tuteur
            associateTuteurToPeriodes(periodesWithoutTuteur, defaultTuteur);

            logger.info("Correction des associations tuteur-période terminée.");
        };
    }

    /**
     * Récupère un tuteur existant ou en crée un nouveau si aucun n'existe.
     */
    @Transactional
    private Tuteur getOrCreateDefaultTuteur() {
        // Vérifier s'il existe déjà des tuteurs
        List<Tuteur> existingTuteurs = tuteurRepository.findAll();

        if (!existingTuteurs.isEmpty()) {
            Tuteur existingTuteur = existingTuteurs.get(0);
            logger.info("Utilisation du tuteur existant: {} {}", existingTuteur.getNom(), existingTuteur.getPrenom());
            return existingTuteur;
        }

        // Créer un nouveau tuteur par défaut
        Tuteur defaultTuteur = new Tuteur();
        defaultTuteur.setNom("Tuteur");
        defaultTuteur.setPrenom("Default");
        defaultTuteur.setEmail("default.tuteur@example.com");
        defaultTuteur.setEntreprise("Entreprise par défaut");

        logger.info("Création d'un tuteur par défaut: {} {}", defaultTuteur.getNom(), defaultTuteur.getPrenom());
        return tuteurRepository.save(defaultTuteur);
    }

    /**
     * Associe un tuteur à toutes les périodes de la liste fournie.
     */
    @Transactional
    private void associateTuteurToPeriodes(List<Periode> periodes, Tuteur tuteur) {
        for (Periode periode : periodes) {
            periode.setTuteur(tuteur);
            periodeRepository.save(periode);
            logger.info("Période ID {} associée au tuteur ID {}", periode.getId(), tuteur.getId());
        }
    }
}