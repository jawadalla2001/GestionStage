package com.gestion.stage.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Periode;
import com.gestion.stage.model.Stagiaire;

@Repository
public interface PeriodeRepository extends JpaRepository<Periode, Long> {
    List<Periode> findByDateDebutAfter(LocalDate date);
    List<Periode> findByDateFinBefore(LocalDate date);
    List<Periode> findByStagiaire(Stagiaire stagiaire);
    List<Periode> findByTuteurIsNull();
}
