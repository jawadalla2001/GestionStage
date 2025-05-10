package com.gestion.stage.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.stage.model.Stagiaire;
import com.gestion.stage.repository.StagiaireRepository;

@Service
public class StagiaireService {

    private final StagiaireRepository stagiaireRepository;

    @Autowired
    public StagiaireService(StagiaireRepository stagiaireRepository) {
        this.stagiaireRepository = stagiaireRepository;
    }

    public List<Stagiaire> getAllStagiaires() {
        return stagiaireRepository.findAll();
    }

    public Optional<Stagiaire> getStagiaireById(Long id) {
        return stagiaireRepository.findById(id);
    }

    public Optional<Stagiaire> getStagiaireByEmail(String email) {
        return stagiaireRepository.findByEmail(email);
    }

    public Stagiaire saveStagiaire(Stagiaire stagiaire) {
        return stagiaireRepository.save(stagiaire);
    }

    public void deleteStagiaire(Long id) {
        stagiaireRepository.deleteById(id);
    }
}