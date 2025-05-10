package com.gestion.stage.mapper;

import org.springframework.stereotype.Component;

import com.gestion.stage.dto.TuteurDTO;
import com.gestion.stage.model.Tuteur;

@Component
public class TuteurMapper {

    public TuteurDTO toDTO(Tuteur tuteur) {
        if (tuteur == null) {
            return null;
        }

        TuteurDTO dto = new TuteurDTO();
        dto.setId(tuteur.getId());
        dto.setNom(tuteur.getNom());
        dto.setPrenom(tuteur.getPrenom());
        dto.setEmail(tuteur.getEmail());
        dto.setEntreprise(tuteur.getEntreprise());

        return dto;
    }

    public Tuteur toEntity(TuteurDTO dto) {
        if (dto == null) {
            return null;
        }

        Tuteur tuteur = new Tuteur();
        tuteur.setId(dto.getId());
        tuteur.setNom(dto.getNom());
        tuteur.setPrenom(dto.getPrenom());
        tuteur.setEmail(dto.getEmail());
        tuteur.setEntreprise(dto.getEntreprise());

        return tuteur;
    }
}