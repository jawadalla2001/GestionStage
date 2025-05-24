package com.gestion.stage.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StageDTO {
    private Long id;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotBlank(message = "L'objectif est obligatoire")
    private String objectif;

    @NotBlank(message = "L'entreprise est obligatoire")
    private String entreprise;

    @NotNull(message = "L'ID du stagiaire est obligatoire")
    private Long stagiaireId;

    @NotNull(message = "L'ID du tuteur est obligatoire")
    private Long tuteurId;

    // Informations de la période
    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;
}