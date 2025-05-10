package com.gestion.stage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Stage;
import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.model.Tuteur;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {
    List<Stage> findByStagiaire(Stagiaire stagiaire);
    List<Stage> findByTuteur(Tuteur tuteur);
    List<Stage> findByEntreprise(String entreprise);
}
