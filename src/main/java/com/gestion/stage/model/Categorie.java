package com.gestion.stage.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "L'intitulé est obligatoire")
    private String intitule;

    @NotNull(message = "La valeur est obligatoire")
    private Double valeur;

    @OneToMany(mappedBy = "categorie")
    @JsonIgnore
    private List<Evaluation> evaluations;
}
