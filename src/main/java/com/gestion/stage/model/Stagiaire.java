package com.gestion.stage.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Stagiaire extends Personne {

    @NotBlank(message = "L'institution est obligatoire")
    private String institution;

    @OneToMany(mappedBy = "stagiaire")
    @JsonIgnore
    private List<Stage> stages;
}