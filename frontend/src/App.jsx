import { useState, useEffect } from 'react';
import CompetencyTable from './components/CompetencyTable';
import Dashboard from './components/Dashboard';
import './index.css';
import { submissionService } from './services/api';

const competencyLevels = ['NA', 'DEBUTANT', 'AUTONOME', 'AUTONOME +'];
const implicationLevels = ['Paresseux', 'Le juste nécessaire', 'Bonne', 'Très forte', 'Dépasse ses objectifs'];
const opennessLevels = ['Isolé(e) ou en opposition', 'Renfermé(e) ou obtus', 'Bonne', 'Très bonne', 'Excellente'];
const qualityLevels = ['Médiocre', 'Acceptable', 'Bonne', 'Très bonne', 'Très professionnelle'];

// Define the rubrics for scoring
const implicationRubric = {
  'Paresseux': 8,
  'Le juste nécessaire': 12,
  'Bonne': 14,
  'Très forte': 16,
  'Dépasse ses objectifs': 18
};

const opennessRubric = {
  'Isolé(e) ou en opposition': 8,
  'Renfermé(e) ou obtus': 6,
  'Bonne': 14,
  'Très bonne': 16,
  'Excellente': 18
};

const qualityRubric = {
  'Médiocre': 4,
  'Acceptable': 10,
  'Bonne': 14,
  'Très bonne': 16,
  'Très professionnelle': 18
};

// Icons as SVG components
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const AssessmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const SkillsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TechnicalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const SpecificIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white flex items-center transition-all duration-300 transform`}>
      {type === 'success' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )}
      {message}
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

function App() {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    stagiaireInstitution: '',
    companyName: '',
    tutorName: '',
    tutorEmail: '',
    period: '',
    dateDebut: '',
    dateFin: '',
    projectTheme: '',
    objectives: '',
    observations: '',
    implication: '',
    openness: '',
    quality: '',
  });

  const [individualCompetencies, setIndividualCompetencies] = useState({});
  const [companyCompetencies, setCompanyCompetencies] = useState({});
  const [technicalCompetencies, setTechnicalCompetencies] = useState({});
  const [specificJobCompetencies, setSpecificJobCompetencies] = useState({});
  const [individualScore, setIndividualScore] = useState('');
  const [companyScore, setCompanyScore] = useState('');
  const [technicalScore, setTechnicalScore] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form', or 'dashboard'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If changing one of the date fields, update the period field too
    if (name === 'dateDebut' || name === 'dateFin') {
      const newFormData = { ...formData, [name]: value };
      
      // Only update period if both dates are set
      if (name === 'dateDebut' && newFormData.dateFin) {
        newFormData.period = `${value} - ${newFormData.dateFin}`;
      } else if (name === 'dateFin' && newFormData.dateDebut) {
        newFormData.period = `${newFormData.dateDebut} - ${value}`;
      }
      
      setFormData(newFormData);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate based on current page
    if (currentPage === 1) {
      if (!formData.studentName) newErrors.studentName = "Le nom du stagiaire est requis";
      if (!formData.studentEmail) newErrors.studentEmail = "L\'email du stagiaire est requis";
      if (!formData.companyName) newErrors.companyName = "Le nom de l\'entreprise est requis";
      if (!formData.tutorName) newErrors.tutorName = "Le nom du tuteur est requis";
      if (!formData.tutorEmail) newErrors.tutorEmail = "L\'email du tuteur est requis";
      if (!formData.dateDebut) newErrors.dateDebut = "La date de début est requise";
      if (!formData.dateFin) newErrors.dateFin = "La date de fin est requise";
    } else if (currentPage === 2) {
      if (!formData.implication) newErrors.implication = "L'implication est requise";
      if (!formData.openness) newErrors.openness = "L'ouverture aux autres est requise";
      if (!formData.quality) newErrors.quality = "La qualité est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };
  
  const closeNotification = () => {
    setNotification(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Validate all pages before submitting
      const newErrors = {};
      
      if (!formData.studentName) newErrors.studentName = "Le nom du stagiaire est requis";
      if (!formData.studentEmail) newErrors.studentEmail = "L\'email du stagiaire est requis";
      if (!formData.companyName) newErrors.companyName = "Le nom de l\'entreprise est requis";
      if (!formData.tutorName) newErrors.tutorName = "Le nom du tuteur est requis";
      if (!formData.tutorEmail) newErrors.tutorEmail = "L\'email du tuteur est requis";
      if (!formData.dateDebut) newErrors.dateDebut = "La date de début est requise";
      if (!formData.dateFin) newErrors.dateFin = "La date de fin est requise";
      if (!formData.implication) newErrors.implication = "L'implication est requise";
      if (!formData.openness) newErrors.openness = "L'ouverture aux autres est requise";
      if (!formData.quality) newErrors.quality = "La qualité est requise";
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        showNotification("Veuillez remplir tous les champs obligatoires", "error");
        setSubmitting(false);
        return;
      }
      
      // Get numeric scores from rubrics
      const implicationNote = implicationRubric[formData.implication];
      const ouvertureNote = opennessRubric[formData.openness];
      const qualiteTravailNote = qualityRubric[formData.quality];

      // Prepare data for backend submission
      const backendData = {
        // Explicitly map formData fields to DTO fields
        description: formData.projectTheme,
        objectif: formData.objectives,
        entreprise: formData.companyName,
        // Spread the rest of formData that matches DTO fields directly or are not part of DTO
        ...formData, 
        // Overwrite with mapped values if they were also in formData with different names
        projectTheme: undefined, // remove as it's mapped to description
        objectives: undefined,   // remove as it's mapped to objectif
        companyName: undefined,  // remove as it's mapped to entreprise
        // studentName, studentEmail, stagiaireInstitution, tutorName, tutorEmail, dateDebut, dateFin are fine as they are in formData
        
        implicationNote,
        ouvertureNote,
        qualiteTravailNote,
        // Add competency details and scores
        individualCompetencies,
        companyCompetencies,
        technicalCompetencies,
        specificJobCompetencies,
        individualScore: individualScore ? parseInt(individualScore, 10) : null, // Ensure scores are numbers or null
        companyScore: companyScore ? parseInt(companyScore, 10) : null,
        technicalScore: technicalScore ? parseInt(technicalScore, 10) : null,
        // Remove the text-based implication, openness, quality if they are not needed by backend
        // or if backend expects only notes.
        // If your DTO still has String implication, openness, quality, you can keep them
        // or remove them if only notes are now used.
      };
      
      // Clean up undefined properties from backendData
      Object.keys(backendData).forEach(key => {
        if (backendData[key] === undefined) {
          delete backendData[key];
        }
      });
      
      // Log the data being submitted
      console.log('Data being sent to backend:', backendData);
      console.log('Individual Competencies:', individualCompetencies);
      console.log('Individual Score:', individualScore);
      console.log('Company Competencies:', companyCompetencies);
      console.log('Technical Competencies:', technicalCompetencies);
      console.log('Specific Job Competencies:', specificJobCompetencies);
      console.log('Company Score:', companyScore);
      console.log('Technical Score:', technicalScore);
      
      // Show submitting notification
      showNotification("Envoi en cours...", "success");
      
      // Submit data to backend
      const competencyEvaluations = {
        individualCompetencies,
        companyCompetencies,
        technicalCompetencies,
        specificJobCompetencies,
        individualScore,
        companyScore,
        technicalScore
      };
      
      // const result = await submissionService.submitFormData(formData, competencyEvaluations);
      // MODIFIED to send backendData instead of just formData
      const result = await submissionService.submitFormData(backendData, competencyEvaluations);
      
      setSubmitResult(result);
      
      if (result.success) {
        showNotification('Données enregistrées avec succès dans la base de données!', 'success');
        // Reset form after successful submission
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        showNotification(`Erreur lors de l'enregistrement: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitResult({ success: false, error: error.message });
      showNotification(`Erreur lors de l'enregistrement: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
    studentName: '',
    studentEmail: '',
    stagiaireInstitution: '',
    companyName: '',
    tutorName: '',
    tutorEmail: '',
    period: '',
    dateDebut: '',
    dateFin: '',
    projectTheme: '',
    objectives: '',
    observations: '',
    implication: '',
    openness: '',
    quality: '',
    });
    setIndividualCompetencies({});
    setCompanyCompetencies({});
    setTechnicalCompetencies({});
    setSpecificJobCompetencies({});
    setIndividualScore('');
    setCompanyScore('');
    setTechnicalScore('');
    setCurrentPage(1);
    setErrors({});
  };
  
  const handleNextPage = () => {
    if (validateForm()) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const companyCompetencyList = [
    "Analyser le fonctionnement de l'entreprise d'accueil",
    "Déceler et comprendre la politique environnementale de l'entreprise",
    "Rechercher, sélectionner l'information nécessaire à ses activités",
  ];

  const technicalCompetencyList = [
    "Assurer la conception préliminaire de produits / services / processus / usages",
  ];

  const specificJobCompetencyList = [
    "Compétence spécifique 1",
    "Compétence spécifique 2",
    "Compétence spécifique 3",
    "Compétence spécifique 4",
    "Compétence spécifique 5",
  ];

  // Define total number of pages
  const totalPages = 7;
  
  // Render progress bar
  const renderProgressBar = () => {
    const progress = (currentPage / totalPages) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const renderPage = () => {
    if (activeTab === 'form') {
        return (
        <>
          {renderProgressBar()}
          {currentPage === 1 && (
          <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Détails du Stage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom et Prénom du stagiaire *
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="ex: Jean Dupont"
                  className={`w-full border ${errors.studentName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
              </div>
                <div>
                  <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email du stagiaire *
                  </label>
                  <input
                    type="email"
                    id="studentEmail"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    placeholder="ex: jean.dupont@example.com"
                    className={`w-full border ${errors.studentEmail ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                  {errors.studentEmail && <p className="text-red-500 text-sm mt-1">{errors.studentEmail}</p>}
                </div>
                <div>
                  <label htmlFor="stagiaireInstitution" className="block text-sm font-medium text-gray-700 mb-1">
                    Institution du stagiaire
                  </label>
                  <input
                    type="text"
                    id="stagiaireInstitution"
                    name="stagiaireInstitution"
                    value={formData.stagiaireInstitution}
                    onChange={handleInputChange}
                    placeholder="ex: Université XYZ"
                    className={`w-full border ${errors.stagiaireInstitution ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                  {errors.stagiaireInstitution && <p className="text-red-500 text-sm mt-1">{errors.stagiaireInstitution}</p>}
                </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="ex: ABC Industries"
                  className={`w-full border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label htmlFor="tutorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom et Prénom du tuteur *
                </label>
                <input
                  type="text"
                  id="tutorName"
                  name="tutorName"
                  value={formData.tutorName}
                  onChange={handleInputChange}
                  placeholder="ex: Marie Martin"
                  className={`w-full border ${errors.tutorName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.tutorName && <p className="text-red-500 text-sm mt-1">{errors.tutorName}</p>}
              </div>
                <div>
                  <label htmlFor="tutorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email du tuteur *
                  </label>
                  <input
                    type="email"
                    id="tutorEmail"
                    name="tutorEmail"
                    value={formData.tutorEmail}
                    onChange={handleInputChange}
                    placeholder="ex: marie.martin@example.com"
                    className={`w-full border ${errors.tutorEmail ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                  {errors.tutorEmail && <p className="text-red-500 text-sm mt-1">{errors.tutorEmail}</p>}
                </div>
              <div className="col-span-2">
                <p className="block text-sm font-medium text-gray-700 mb-1">
                  Période du stage *
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      id="dateDebut"
                      name="dateDebut"
                      value={formData.dateDebut}
                      onChange={handleInputChange}
                      className={`w-full border ${errors.dateDebut ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.dateDebut && <p className="text-red-500 text-sm mt-1">{errors.dateDebut}</p>}
                  </div>
                  <div>
                    <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      id="dateFin"
                      name="dateFin"
                      value={formData.dateFin}
                      onChange={handleInputChange}
                      className={`w-full border ${errors.dateFin ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.dateFin && <p className="text-red-500 text-sm mt-1">{errors.dateFin}</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="projectTheme" className="block text-sm font-medium text-gray-700 mb-1">
                Thème du projet principal
              </label>
              <textarea
                id="projectTheme"
                name="projectTheme"
                value={formData.projectTheme}
                onChange={handleInputChange}
                placeholder="Décrivez le thème principal du projet..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                rows="4"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
                Objectifs assignés
              </label>
              <textarea
                id="objectives"
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                placeholder="Listez les objectifs assignés au stagiaire..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                rows="4"
              />
            </div>
          </div>
          )}
          {currentPage === 2 && (
          <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Appréciations Globales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Implication dans ses activités</label>
                <select
                  name="implication"
                  value={formData.implication}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.implication ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                >
                  <option value="">Sélectionner...</option>
                  {implicationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.implication && <p className="text-red-500 text-sm mt-1">{errors.implication}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Ouverture aux autres</label>
                <select
                  name="openness"
                  value={formData.openness}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.openness ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                >
                  <option value="">Sélectionner...</option>
                  {opennessLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.openness && <p className="text-red-500 text-sm mt-1">{errors.openness}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Qualité de ses productions</label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.quality ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                >
                  <option value="">Sélectionner...</option>
                  {qualityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.quality && <p className="text-red-500 text-sm mt-1">{errors.quality}</p>}
              </div>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Observations sur l'ensemble du travail accompli"
                className="w-full border border-gray-300 p-3 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                rows="4"
              />
            </div>
          </div>
          )}
          {currentPage === 3 && (
          <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Évaluation des Compétences</h2>
            <CompetencyTable
              title="Compétences liées à l'individu"
              competencies={['Compétence 1', 'Compétence 2', 'Compétence 3']}
              evaluations={individualCompetencies}
              setEvaluations={setIndividualCompetencies}
            />
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Note pour les compétences liées à l'individu (/20)</label>
              <input
                type="number"
                value={individualScore}
                onChange={(e) => setIndividualScore(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                min="0"
                max="20"
              />
            </div>
            <CompetencyTable
              title="Compétences liées à l'entreprise"
              competencies={companyCompetencyList}
              evaluations={companyCompetencies}
              setEvaluations={setCompanyCompetencies}
            />
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Note pour les compétences liées à l'entreprise (/20)</label>
              <input
                type="number"
                value={companyScore}
                onChange={(e) => setCompanyScore(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                min="0"
                max="20"
              />
            </div>
          </div>
          )}
          {currentPage === 4 && (
          <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Compétences Scientifiques et Techniques</h2>
            <CompetencyTable
              competencies={technicalCompetencyList}
              evaluations={technicalCompetencies}
              setEvaluations={setTechnicalCompetencies}
            />
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Note pour les compétences scientifiques et techniques (/20)</label>
              <input
                type="number"
                value={technicalScore}
                onChange={(e) => setTechnicalScore(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                min="0"
                max="20"
              />
            </div>
          </div>
          )}
          {currentPage === 5 && (
          <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Compétences Spécifiques Métier</h2>
            <CompetencyTable
              competencies={specificJobCompetencyList}
              evaluations={specificJobCompetencies}
              setEvaluations={setSpecificJobCompetencies}
              levels={competencyLevels}
            />
          </div>
          )}
          {currentPage === 6 && (
            <div className="bg-white p-8 rounded-xl shadow-2xl transition-all duration-300 border border-gray-200 w-full max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Récapitulatif de l'Évaluation</h2>
              
              <div className="space-y-8">
                {/* Informations Générales Card */}
                <div className="bg-slate-50 p-6 rounded-lg shadow-md border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Informations Générales</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Stagiaire:</dt><dd className="text-gray-800 text-right">{formData.studentName || 'Non spécifié'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Email Stagiaire:</dt><dd className="text-gray-800 text-right">{formData.studentEmail || 'Non spécifié'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Institution:</dt><dd className="text-gray-800 text-right">{formData.stagiaireInstitution || 'Non spécifiée'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Entreprise:</dt><dd className="text-gray-800 text-right">{formData.companyName || 'Non spécifiée'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Tuteur:</dt><dd className="text-gray-800 text-right">{formData.tutorName || 'Non spécifié'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Email Tuteur:</dt><dd className="text-gray-800 text-right">{formData.tutorEmail || 'Non spécifié'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Période:</dt><dd className="text-gray-800 text-right">{formData.dateDebut && formData.dateFin ? `Du ${new Date(formData.dateDebut).toLocaleDateString()} au ${new Date(formData.dateFin).toLocaleDateString()}` : 'Non spécifiée'}</dd></div>
                  </dl>
              </div>
              
                {/* Projet et Objectifs Card */}
                <div className="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200">
                  <h3 className="text-xl font-semibold text-teal-700 mb-4 border-b pb-2">Projet et Objectifs</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Thème du projet:</dt><dd className="text-gray-800 text-right">{formData.projectTheme || 'Non spécifié'}</dd></div>
                    <div><dt className="font-medium text-gray-600 mb-1">Objectifs:</dt><dd className="text-gray-800 whitespace-pre-wrap text-sm bg-white p-2 rounded">{formData.objectives || 'Non spécifiés'}</dd></div>
                  </dl>
              </div>
              
                {/* Appréciations Card */}
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md border border-indigo-200">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-4 border-b pb-2">Appréciations Globales</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Implication:</dt><dd className="text-gray-800 text-right">{formData.implication || 'Non évaluée'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Ouverture aux autres:</dt><dd className="text-gray-800 text-right">{formData.openness || 'Non évaluée'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Qualité du travail:</dt><dd className="text-gray-800 text-right">{formData.quality || 'Non évaluée'}</dd></div>
                    <div><dt className="font-medium text-gray-600 mb-1">Observations Générales:</dt><dd className="text-gray-800 whitespace-pre-wrap text-sm bg-white p-2 rounded">{formData.observations || 'Aucune observation'}</dd></div>
                  </dl>
              </div>
              
                {/* Notes d'Évaluation Card */}
                <div className="bg-rose-50 p-6 rounded-lg shadow-md border border-rose-200">
                  <h3 className="text-xl font-semibold text-rose-700 mb-4 border-b pb-2">Notes d'Évaluation des Compétences</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Compétences liées à l'individu:</dt><dd className="text-gray-800 font-semibold text-right">{individualScore ? `${individualScore}/20` : 'Non notée'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Compétences liées à l'entreprise:</dt><dd className="text-gray-800 font-semibold text-right">{companyScore ? `${companyScore}/20` : 'Non notée'}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-gray-600">Compétences Sci. et Techniques:</dt><dd className="text-gray-800 font-semibold text-right">{technicalScore ? `${technicalScore}/20` : 'Non notée'}</dd></div>
                    {/* Consider adding a section for specific job competencies if they are scored globally */}
                  </dl>
              </div>
              
                <div className="pt-6 text-center">
                  <p className="text-gray-600 mb-6 italic">Veuillez vérifier attentivement toutes les informations ci-dessus avant de soumettre le formulaire d'évaluation.</p>
              </div>
            </div>
          </div>
          )}
          {currentPage === 7 && (
          <Dashboard userData={formData} />
          )}
        </>
        );
    } else if (activeTab === 'dashboard') {
      return <Dashboard />;
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button - Only visible on small screens */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-blue-600 text-white rounded-lg shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar - Hidden on mobile unless menu button is clicked */}
      <div className={`fixed md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-20 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-gradient-to-b from-blue-800 to-indigo-900 text-white p-6 shadow-xl h-full overflow-y-auto`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Gestion des Stages</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {setCurrentPage(1); setActiveTab('form'); setIsMobileMenuOpen(false);}}
                className={`w-full text-left p-3 rounded-lg flex items-center transition-all duration-200 ${
                  currentPage === 1 && activeTab === 'form'
                    ? 'bg-blue-600 shadow-md' 
                    : 'bg-blue-700/50 hover:bg-blue-600/70'
                }`}
              >
                <HomeIcon />
                <span className="ml-3">Détails du Stage</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {setCurrentPage(2); setActiveTab('form'); setIsMobileMenuOpen(false);}}
                className={`w-full text-left p-3 rounded-lg flex items-center transition-all duration-200 ${
                  currentPage === 2 && activeTab === 'form'
                    ? 'bg-blue-600 shadow-md' 
                    : 'bg-blue-700/50 hover:bg-blue-600/70'
                }`}
              >
                <AssessmentIcon />
                <span className="ml-3">Appréciations</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {setCurrentPage(3); setActiveTab('form'); setIsMobileMenuOpen(false);}}
                className={`w-full text-left p-3 rounded-lg flex items-center transition-all duration-200 ${
                  currentPage === 3 && activeTab === 'form'
                    ? 'bg-blue-600 shadow-md' 
                    : 'bg-blue-700/50 hover:bg-blue-600/70'
                }`}
              >
                <SkillsIcon />
                <span className="ml-3">Compétences</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {setCurrentPage(4); setActiveTab('form'); setIsMobileMenuOpen(false);}}
                className={`w-full text-left p-3 rounded-lg flex items-center transition-all duration-200 ${
                  currentPage === 4 && activeTab === 'form'
                    ? 'bg-blue-600 shadow-md' 
                    : 'bg-blue-700/50 hover:bg-blue-600/70'
                }`}
              >
                <TechnicalIcon />
                <span className="ml-3">Compétences Techniques</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {setCurrentPage(5); setActiveTab('form'); setIsMobileMenuOpen(false);}}
                className={`w-full text-left p-3 rounded-lg flex items-center transition-all duration-200 ${
                  currentPage === 5 && activeTab === 'form'
                    ? 'bg-blue-600 shadow-md' 
                    : 'bg-blue-700/50 hover:bg-blue-600/70'
                }`}
              >
                <SpecificIcon />
                <span className="ml-3">Compétences Métier</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {setCurrentPage(6); setActiveTab('form'); setIsMobileMenuOpen(false);}}
                className={`w-full text-left p-3 rounded-lg flex items-center transition-all duration-200 ${
                  currentPage === 6 && activeTab === 'form'
                    ? 'bg-blue-600 shadow-md' 
                    : 'bg-blue-700/50 hover:bg-blue-600/70'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="ml-3">Récapitulatif</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {setCurrentPage(7); setActiveTab('form'); setIsMobileMenuOpen(false);}}
                className={`w-full text-left p-3 rounded-lg flex items-center transition-all duration-200 ${
                  currentPage === 7 && activeTab === 'form'
                    ? 'bg-blue-600 shadow-md' 
                    : 'bg-blue-700/50 hover:bg-blue-600/70'
                }`}
              >
                <DashboardIcon />
                <span className="ml-3">Tableau de Bord</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 md:px-4 min-h-[calc(100vh-4rem)] flex flex-col">
          {renderPage()}
          
          {/* Only show navigation buttons for the form */}
          {activeTab === 'form' && (
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevPage}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200 disabled:opacity-50 shadow-md flex items-center"
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Précédent
              </button>
              {currentPage < totalPages ? (
                <button
                  onClick={handleNextPage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center"
                >
                  Suivant
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`${
                    submitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                  } text-white px-6 py-3 rounded-lg transition duration-200 shadow-md flex items-center`}
                >
                  {submitting ? 'Envoi en cours...' : 'Soumettre'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Notification component */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={closeNotification} 
        />
      )}
    </div>
  );
}

export default App;