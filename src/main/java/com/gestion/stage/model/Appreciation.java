package com.gestion.stage.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Appreciation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La description est obligatoire")
    @Column(nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "tuteur_id")
    private Tuteur tuteur;

    @OneToMany(mappedBy = "appreciation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Evaluation> evaluations;
}