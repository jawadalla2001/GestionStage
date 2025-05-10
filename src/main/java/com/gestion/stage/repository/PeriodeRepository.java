package com.gestion.stage.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.stage.model.Periode;

@Repository
public interface PeriodeRepository extends JpaRepository<Periode, Long> {
    List<Periode> findByDateDebutAfter(Date date);
    List<Periode> findByDateFinBefore(Date date);
}
