package com.gestion.stage.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Periode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date de début est obligatoire")
    @Temporal(TemporalType.DATE)
    private Date dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    @Temporal(TemporalType.DATE)
    private Date dateFin;

    @OneToOne
    @JoinColumn(name = "stage_id")
    @JsonIgnoreProperties("periode")
    private Stage stage;
}