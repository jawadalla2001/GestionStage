package com.gestion.stage.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Periode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    @ManyToOne
    @JoinColumn(name = "stage_id")
    @JsonIgnoreProperties("periodes")
    private Stage stage;

    @ManyToOne
    @JoinColumn(name = "stagiaire_id")
    @JsonIgnoreProperties("periodes")
    private Stagiaire stagiaire;

    @ManyToOne
    @JoinColumn(name = "tuteur_id")
    @JsonIgnoreProperties({"periodes", "appreciations"})
    private Tuteur tuteur;

    @OneToMany(mappedBy = "periode")
    @JsonIgnoreProperties("periode")
    private List<Appreciation> appreciations;

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
}