package com.gestion.stage.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.stage.model.Appreciation;
import com.gestion.stage.model.Categorie;
import com.gestion.stage.model.Competences;
import com.gestion.stage.model.Evaluation;
import com.gestion.stage.repository.EvaluationRepository;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    @Autowired
    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    public Optional<Evaluation> getEvaluationById(Long id) {
        return evaluationRepository.findById(id);
    }

    public List<Evaluation> getEvaluationsByAppreciation(Appreciation appreciation) {
        return evaluationRepository.findByAppreciation(appreciation);
    }

    public List<Evaluation> getEvaluationsByCategorie(Categorie categorie) {
        return evaluationRepository.findByCategorie(categorie);
    }

    public List<Evaluation> getEvaluationsByCompetences(Competences competences) {
        return evaluationRepository.findByCompetences(competences);
    }

    public Evaluation saveEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }
}