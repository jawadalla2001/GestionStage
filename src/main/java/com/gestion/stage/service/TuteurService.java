package com.gestion.stage.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.stage.model.Tuteur;
import com.gestion.stage.repository.TuteurRepository;

@Service
public class TuteurService {

    private final TuteurRepository tuteurRepository;

    @Autowired
    public TuteurService(TuteurRepository tuteurRepository) {
        this.tuteurRepository = tuteurRepository;
    }

    public List<Tuteur> getAllTuteurs() {
        return tuteurRepository.findAll();
    }

    public Optional<Tuteur> getTuteurById(Long id) {
        return tuteurRepository.findById(id);
    }

    public Optional<Tuteur> getTuteurByEmail(String email) {
        return tuteurRepository.findByEmail(email);
    }

    public List<Tuteur> getTuteursByEntreprise(String entreprise) {
        return tuteurRepository.findByEntreprise(entreprise);
    }

    public Tuteur saveTuteur(Tuteur tuteur) {
        return tuteurRepository.save(tuteur);
    }

    public void deleteTuteur(Long id) {
        tuteurRepository.deleteById(id);
    }
}
