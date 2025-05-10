package com.gestion.stage.mapper;

import org.springframework.stereotype.Component;

import com.gestion.stage.dto.StagiaireDTO;
import com.gestion.stage.model.Stagiaire;

@Component
public class StagiaireMapper {

    public StagiaireDTO toDTO(Stagiaire stagiaire) {
        if (stagiaire == null) {
            return null;
        }

        StagiaireDTO dto = new StagiaireDTO();
        dto.setId(stagiaire.getId());
        dto.setNom(stagiaire.getNom());
        dto.setPrenom(stagiaire.getPrenom());
        dto.setEmail(stagiaire.getEmail());
        dto.setInstitution(stagiaire.getInstitution());

        return dto;
    }

    public Stagiaire toEntity(StagiaireDTO dto) {
        if (dto == null) {
            return null;
        }

        Stagiaire stagiaire = new Stagiaire();
        stagiaire.setId(dto.getId());
        stagiaire.setNom(dto.getNom());
        stagiaire.setPrenom(dto.getPrenom());
        stagiaire.setEmail(dto.getEmail());
        stagiaire.setInstitution(dto.getInstitution());

        return stagiaire;
    }
}
