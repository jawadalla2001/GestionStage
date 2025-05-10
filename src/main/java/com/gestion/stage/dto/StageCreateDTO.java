package com.gestion.stage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a new Stage with simplified entity references using IDs
 */
public class StageCreateDTO {

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotBlank(message = "L'objectif est obligatoire")
    private String objectif;

    @NotBlank(message = "L'entreprise est obligatoire")
    private String entreprise;

    @NotNull(message = "L'ID du stagiaire est obligatoire et doit être un nombre")
    private Long stagiaireId;

    @NotNull(message = "L'ID du tuteur est obligatoire et doit être un nombre")
    private Long tuteurId;

    // Getters and setters
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public Long getStagiaireId() {
        return stagiaireId;
    }

    public void setStagiaireId(Long stagiaireId) {
        if (stagiaireId == null) {
            throw new IllegalArgumentException("L'ID du stagiaire est obligatoire et doit être un nombre");
        }
        this.stagiaireId = stagiaireId;
    }

    public Long getTuteurId() {
        return tuteurId;
    }

    public void setTuteurId(Long tuteurId) {
        if (tuteurId == null) {
            throw new IllegalArgumentException("L'ID du tuteur est obligatoire et doit être un nombre");
        }
        this.tuteurId = tuteurId;
    }

    @Override
    public String toString() {
        return "StageCreateDTO{" +
                "description='" + description + '\'' +
                ", objectif='" + objectif + '\'' +
                ", entreprise='" + entreprise + '\'' +
                ", stagiaireId=" + stagiaireId +
                ", tuteurId=" + tuteurId +
                '}';
    }
}