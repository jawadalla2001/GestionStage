package com.gestion.stage.dto;

import java.time.LocalDate;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a new Stage with simplified entity references using IDs
 */
public class StageCreateDTO {

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotBlank(message = "L'objectif est obligatoire")
    private String objectif;

    @NotBlank(message = "L'entreprise est obligatoire")
    private String entreprise;

    @NotBlank(message = "Le nom du stagiaire est obligatoire")
    private String studentName;

    @NotBlank(message = "L'email du stagiaire est obligatoire")
    private String studentEmail;

    private String stagiaireInstitution;

    @NotBlank(message = "Le nom du tuteur est obligatoire")
    private String tutorName;

    @NotBlank(message = "L'email du tuteur est obligatoire")
    private String tutorEmail;

    @NotNull(message = "La date de début est obligatoire")
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate dateFin;

    // Notes from rubric
    private Double implicationNote;
    private Double ouvertureNote;
    private Double qualiteTravailNote;

    // Detailed Competencies
    private Map<String, CompetencyDetailDTO> individualCompetencies;
    private Map<String, CompetencyDetailDTO> companyCompetencies;
    private Map<String, CompetencyDetailDTO> technicalCompetencies;
    private Map<String, CompetencyDetailDTO> specificJobCompetencies;

    // Global scores for competency categories
    private Integer individualScore;
    private Integer companyScore;
    private Integer technicalScore;

    // Getters and setters
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStagiaireInstitution() {
        return stagiaireInstitution;
    }

    public void setStagiaireInstitution(String stagiaireInstitution) {
        this.stagiaireInstitution = stagiaireInstitution;
    }

    public String getTutorName() {
        return tutorName;
    }

    public void setTutorName(String tutorName) {
        this.tutorName = tutorName;
    }

    public String getTutorEmail() {
        return tutorEmail;
    }

    public void setTutorEmail(String tutorEmail) {
        this.tutorEmail = tutorEmail;
    }

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

    public Double getImplicationNote() {
        return implicationNote;
    }

    public void setImplicationNote(Double implicationNote) {
        this.implicationNote = implicationNote;
    }

    public Double getOuvertureNote() {
        return ouvertureNote;
    }

    public void setOuvertureNote(Double ouvertureNote) {
        this.ouvertureNote = ouvertureNote;
    }

    public Double getQualiteTravailNote() {
        return qualiteTravailNote;
    }

    public void setQualiteTravailNote(Double qualiteTravailNote) {
        this.qualiteTravailNote = qualiteTravailNote;
    }

    public Map<String, CompetencyDetailDTO> getIndividualCompetencies() {
        return individualCompetencies;
    }

    public void setIndividualCompetencies(Map<String, CompetencyDetailDTO> individualCompetencies) {
        this.individualCompetencies = individualCompetencies;
    }

    public Map<String, CompetencyDetailDTO> getCompanyCompetencies() {
        return companyCompetencies;
    }

    public void setCompanyCompetencies(Map<String, CompetencyDetailDTO> companyCompetencies) {
        this.companyCompetencies = companyCompetencies;
    }

    public Map<String, CompetencyDetailDTO> getTechnicalCompetencies() {
        return technicalCompetencies;
    }

    public void setTechnicalCompetencies(Map<String, CompetencyDetailDTO> technicalCompetencies) {
        this.technicalCompetencies = technicalCompetencies;
    }

    public Map<String, CompetencyDetailDTO> getSpecificJobCompetencies() {
        return specificJobCompetencies;
    }

    public void setSpecificJobCompetencies(Map<String, CompetencyDetailDTO> specificJobCompetencies) {
        this.specificJobCompetencies = specificJobCompetencies;
    }

    public Integer getIndividualScore() {
        return individualScore;
    }

    public void setIndividualScore(Integer individualScore) {
        this.individualScore = individualScore;
    }

    public Integer getCompanyScore() {
        return companyScore;
    }

    public void setCompanyScore(Integer companyScore) {
        this.companyScore = companyScore;
    }

    public Integer getTechnicalScore() {
        return technicalScore;
    }

    public void setTechnicalScore(Integer technicalScore) {
        this.technicalScore = technicalScore;
    }

    @Override
    public String toString() {
        return "StageCreateDTO{" +
                "description='" + description + '\'' +
                ", objectif='" + objectif + '\'' +
                ", entreprise='" + entreprise + '\'' +
                ", studentName='" + studentName + '\'' +
                ", studentEmail='" + studentEmail + '\'' +
                ", stagiaireInstitution='" + stagiaireInstitution + '\'' +
                ", tutorName='" + tutorName + '\'' +
                ", tutorEmail='" + tutorEmail + '\'' +
                ", dateDebut=" + dateDebut +
                ", dateFin=" + dateFin +
                ", implicationNote=" + implicationNote +
                ", ouvertureNote=" + ouvertureNote +
                ", qualiteTravailNote=" + qualiteTravailNote +
                ", individualCompetencies=" + individualCompetencies +
                ", companyCompetencies=" + companyCompetencies +
                ", technicalCompetencies=" + technicalCompetencies +
                ", specificJobCompetencies=" + specificJobCompetencies +
                ", individualScore=" + individualScore +
                ", companyScore=" + companyScore +
                ", technicalScore=" + technicalScore +
                '}';
    }
}