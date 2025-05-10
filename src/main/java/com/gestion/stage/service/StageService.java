package com.gestion.stage.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.stage.model.Stage;
import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.model.Tuteur;
import com.gestion.stage.repository.StageRepository;

@Service
public class StageService {

    private final StageRepository stageRepository;

    @Autowired
    public StageService(StageRepository stageRepository) {
        this.stageRepository = stageRepository;
    }

    public List<Stage> getAllStages() {
        return stageRepository.findAll();
    }

    public Optional<Stage> getStageById(Long id) {
        return stageRepository.findById(id);
    }

    public List<Stage> getStagesByStagiaire(Stagiaire stagiaire) {
        return stageRepository.findByStagiaire(stagiaire);
    }

    public List<Stage> getStagesByTuteur(Tuteur tuteur) {
        return stageRepository.findByTuteur(tuteur);
    }

    public List<Stage> getStagesByEntreprise(String entreprise) {
        return stageRepository.findByEntreprise(entreprise);
    }

    public Stage saveStage(Stage stage) {
        return stageRepository.save(stage);
    }

    public void deleteStage(Long id) {
        stageRepository.deleteById(id);
    }
}
