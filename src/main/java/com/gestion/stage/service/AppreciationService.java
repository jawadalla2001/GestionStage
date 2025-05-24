package com.gestion.stage.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.stage.model.Appreciation;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;
import com.gestion.stage.model.Periode;
import com.gestion.stage.model.Tuteur;
import com.gestion.stage.repository.AppreciationRepository;

@Service
public class AppreciationService {

    private final AppreciationRepository appreciationRepository;

    @Autowired
    public AppreciationService(AppreciationRepository appreciationRepository) {
        this.appreciationRepository = appreciationRepository;
    }

    public List<Appreciation> getAllAppreciations() {
        return appreciationRepository.findAll();
    }

    public Optional<Appreciation> getAppreciationById(Long id) {
        return appreciationRepository.findById(id);
    }

    public List<Appreciation> getAppreciationsByTuteur(Tuteur tuteur) {
        return appreciationRepository.findByTuteur(tuteur);
    }

    public List<Appreciation> getAppreciationsByPeriode(Periode periode) {
        return appreciationRepository.findByPeriode(periode);
    }

    public List<Appreciation> getAppreciationsByEvaluation(Evaluation evaluation) {
        return appreciationRepository.findByEvaluation(evaluation);
    }

    public List<Appreciation> getAppreciationsByCompetences(Competences competences) {
        return appreciationRepository.findByCompetences(competences);
    }

    public Appreciation saveAppreciation(Appreciation appreciation) {
        return appreciationRepository.save(appreciation);
    }

    public void deleteAppreciation(Long id) {
        appreciationRepository.deleteById(id);
    }
}