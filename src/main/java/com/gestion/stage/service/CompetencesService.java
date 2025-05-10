package com.gestion.stage.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.stage.model.Competences;
import com.gestion.stage.repository.CompetencesRepository;

@Service
public class CompetencesService {

    private final CompetencesRepository competencesRepository;

    @Autowired
    public CompetencesService(CompetencesRepository competencesRepository) {
        this.competencesRepository = competencesRepository;
    }

    public List<Competences> getAllCompetences() {
        return competencesRepository.findAll();
    }

    public Optional<Competences> getCompetencesById(Long id) {
        return competencesRepository.findById(id);
    }

    public Optional<Competences> getCompetencesByIntitule(String intitule) {
        return competencesRepository.findByIntitule(intitule);
    }

    public Competences saveCompetences(Competences competences) {
        return competencesRepository.save(competences);
    }

    public void deleteCompetences(Long id) {
        competencesRepository.deleteById(id);
    }
}