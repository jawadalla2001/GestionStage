package com.gestion.stage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Appreciation;
import com.gestion.stage.model.Categorie;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByAppreciation(Appreciation appreciation);
    List<Evaluation> findByCategorie(Categorie categorie);
    List<Evaluation> findByCompetences(Competences competences);

    /**
     * Checks if an evaluation exists for the given appreciation and category.
     *
     * @param appreciation The appreciation to check
     * @param categorie The category to check
     * @return true if an evaluation exists, false otherwise
     */
    boolean existsByAppreciationAndCategorie(Appreciation appreciation, Categorie categorie);

    /**
     * Checks if an evaluation exists for the given appreciation and competence.
     *
     * @param appreciation The appreciation to check
     * @param competences The competence to check
     * @return true if an evaluation exists, false otherwise
     */
    boolean existsByAppreciationAndCompetences(Appreciation appreciation, Competences competences);
}
