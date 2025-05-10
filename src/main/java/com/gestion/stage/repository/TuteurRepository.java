package com.gestion.stage.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Tuteur;

@Repository
public interface TuteurRepository extends JpaRepository<Tuteur, Long> {
    Optional<Tuteur> findByEmail(String email);
    List<Tuteur> findByEntreprise(String entreprise);
}