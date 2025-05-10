package com.gestion.stage.dto;

import java.util.List;

import lombok.Data;

@Data
public class AppreciationDTO {
    private Long id;
    private Long tuteurId;
    private List<EvaluationDTO> evaluations;
}