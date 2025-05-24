package com.gestion.stage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Categorie;
import com.gestion.stage.model.Competences;

@Repository
public interface CompetencesRepository extends JpaRepository<Competences, Long> {
    Optional<Competences> findByIntitule(String intitule);
    List<Competences> findByCategorie(Categorie categorie);
    Optional<Competences> findByIntituleAndCategorie(String intitule, Categorie categorie);
}
