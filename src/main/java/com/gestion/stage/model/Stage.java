package com.gestion.stage.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La description est obligatoire")
    @Column(length = 1000)
    private String description;

    @NotBlank(message = "L'objectif est obligatoire")
    @Column(length = 1000)
    private String objectif;

    @NotBlank(message = "L'entreprise est obligatoire")
    private String entreprise;

    @ManyToOne
    @JoinColumn(name = "stagiaire_id")
    @JsonIgnoreProperties("stages")
    private Stagiaire stagiaire;

    @ManyToOne
    @JoinColumn(name = "tuteur_id")
    @JsonIgnoreProperties("stages")
    private Tuteur tuteur;

    @OneToOne(mappedBy = "stage", cascade = CascadeType.ALL)
    @JsonIgnore
    private Periode periode;
}

