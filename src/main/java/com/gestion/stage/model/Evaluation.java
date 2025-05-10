package com.gestion.stage.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La valeur est obligatoire")
    private Double valeur;

    @Column(length = 1000)
    private String commentaire;

    @ManyToOne
    @JoinColumn(name = "appreciation_id")
    @JsonIgnoreProperties("evaluations")
    private Appreciation appreciation;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    @JsonIgnoreProperties("evaluations")
    private Categorie categorie;

    @ManyToOne
    @JoinColumn(name = "competences_id")
    @JsonIgnoreProperties("evaluations")
    private Competences competences;
}