package com.gestion.stage.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.stage.model.Periode;
import com.gestion.stage.model.Stage;
import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.repository.PeriodeRepository;
import com.gestion.stage.repository.StageRepository;

@Service
public class StageService {

    private final StageRepository stageRepository;
    private final PeriodeRepository periodeRepository;

    @Autowired
    public StageService(StageRepository stageRepository, PeriodeRepository periodeRepository) {
        this.stageRepository = stageRepository;
        this.periodeRepository = periodeRepository;
    }

    public List<Stage> getAllStages() {
        return stageRepository.findAll();
    }

    public Optional<Stage> getStageById(Long id) {
        return stageRepository.findById(id);
    }

    public boolean existsById(Long id) {
        return stageRepository.existsById(id);
    }

    public List<Stage> getStagesByStagiaire(Stagiaire stagiaire) {
        // Récupérer les périodes du stagiaire
        List<Periode> periodes = periodeRepository.findByStagiaire(stagiaire);

        // Extraire et retourner les stages uniques associés à ces périodes
        return periodes.stream()
                .map(Periode::getStage)
                .distinct()
                .collect(Collectors.toList());
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
