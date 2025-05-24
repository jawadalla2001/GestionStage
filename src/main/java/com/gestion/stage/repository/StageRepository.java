package com.gestion.stage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Stage;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {
    List<Stage> findByEntreprise(String entreprise);
}
