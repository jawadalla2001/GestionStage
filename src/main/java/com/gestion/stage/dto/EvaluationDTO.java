package com.gestion.stage.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EvaluationDTO {
    private Long id;

    @NotNull(message = "La valeur est obligatoire")
    private Double valeur;

    private String commentaire;

    @NotNull(message = "L'ID de l'appréciation est obligatoire")
    private Long appreciationId;

    private Long categorieId;

    private Long competencesId;
}