package com.gestion.stage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Appreciation;
import com.gestion.stage.model.Tuteur;

@Repository
public interface AppreciationRepository extends JpaRepository<Appreciation, Long> {
    List<Appreciation> findByTuteur(Tuteur tuteur);
}