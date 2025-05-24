package com.gestion.stage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Appreciation;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;
import com.gestion.stage.model.Periode;
import com.gestion.stage.model.Tuteur;

@Repository
public interface AppreciationRepository extends JpaRepository<Appreciation, Long> {
    List<Appreciation> findByTuteur(Tuteur tuteur);
    List<Appreciation> findByPeriode(Periode periode);
    List<Appreciation> findByEvaluation(Evaluation evaluation);
    List<Appreciation> findByCompetences(Competences competences);
}