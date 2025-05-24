package com.gestion.stage.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.stage.model.Periode;
import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.repository.PeriodeRepository;

@Service
public class PeriodeService {

    private final PeriodeRepository periodeRepository;

    @Autowired
    public PeriodeService(PeriodeRepository periodeRepository) {
        this.periodeRepository = periodeRepository;
    }

    public List<Periode> getAllPeriodes() {
        return periodeRepository.findAll();
    }

    public Optional<Periode> getPeriodeById(Long id) {
        return periodeRepository.findById(id);
    }

    public List<Periode> getPeriodesDebutantApres(LocalDate date) {
        return periodeRepository.findByDateDebutAfter(date);
    }

    public List<Periode> getPeriodesFinissantAvant(LocalDate date) {
        return periodeRepository.findByDateFinBefore(date);
    }

    public List<Periode> getPeriodesByStagiaire(Stagiaire stagiaire) {
        return periodeRepository.findByStagiaire(stagiaire);
    }

    public Periode savePeriode(Periode periode) {
        return periodeRepository.save(periode);
    }

    public void deletePeriode(Long id) {
        periodeRepository.deleteById(id);
    }
}