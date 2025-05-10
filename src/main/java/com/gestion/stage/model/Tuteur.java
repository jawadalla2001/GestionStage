package com.gestion.stage.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Tuteur extends Personne {

    @NotBlank(message = "L'entreprise est obligatoire")
    private String entreprise;

    @OneToMany(mappedBy = "tuteur")
    private List<Stage> stages;

    @OneToMany(mappedBy = "tuteur")
    private List<Appreciation> appreciations;
}