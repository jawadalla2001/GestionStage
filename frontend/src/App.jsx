import { useState } from 'react';
import CompetencyTable from './components/CompetencyTable';
import './index.css';
import { submissionService } from './services/api';

const competencyLevels = ['NA', 'DEBUTANT', 'AUTONOME', 'AUTONOME +'];
const implicationLevels = ['Paresseux', 'Le juste nécessaire', 'Bonne', 'Très forte', 'Dépasse ses objectifs'];
const opennessLevels = ['Isolé(e) ou en opposition', 'Renfermé(e) ou obtus', 'Bonne', 'Très bonne', 'Excellente'];
const qualityLevels = ['Médiocre', 'Acceptable', 'Bonne', 'Très bonne', 'Très professionnelle'];

function App() {
  const [formData, setFormData] = useState({
    studentName: '',
    companyName: '',
    tutorName: '',
    period: '',
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
  const [individualScore, setIndividualScore] = useState(''); // New state for individual competencies score
  const [companyScore, setCompanyScore] = useState('');
  const [technicalScore, setTechnicalScore] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Log the data being submitted (keep this for debugging)
      console.log('Form Data:', formData);
      console.log('Individual Competencies:', individualCompetencies);
      console.log('Individual Score:', individualScore);
      console.log('Company Competencies:', companyCompetencies);
      console.log('Technical Competencies:', technicalCompetencies);
      console.log('Specific Job Competencies:', specificJobCompetencies);
      console.log('Company Score:', companyScore);
      console.log('Technical Score:', technicalScore);
      
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
      
      const result = await submissionService.submitFormData(formData, competencyEvaluations);
      
      setSubmitResult(result);
      
      if (result.success) {
        alert('Données enregistrées avec succès dans la base de données!');
      } else {
        alert(`Erreur lors de l'enregistrement: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitResult({ success: false, error: error.message });
      alert(`Erreur lors de l'enregistrement: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
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

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Détails du Stage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Nom et Prénom du stagiaire"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Nom de l'entreprise"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="tutorName"
                value={formData.tutorName}
                onChange={handleInputChange}
                placeholder="Nom et Prénom du tuteur"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                placeholder="Période du stage"
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              name="projectTheme"
              value={formData.projectTheme}
              onChange={handleInputChange}
              placeholder="Thème du projet principal"
              className="w-full border border-gray-300 p-3 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <textarea
              name="objectives"
              value={formData.objectives}
              onChange={handleInputChange}
              placeholder="Objectifs assignés"
              className="w-full border border-gray-300 p-3 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Appréciations Globales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Implication dans ses activités</label>
                <select
                  name="implication"
                  value={formData.implication}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  {implicationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Ouverture aux autres</label>
                <select
                  name="openness"
                  value={formData.openness}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  {opennessLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Qualité de ses productions</label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  {qualityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Observations sur l'ensemble du travail accompli"
                className="w-full border border-gray-300 p-3 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300">
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
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="20"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300">
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
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="20"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Compétences Spécifiques Métier</h2>
            <CompetencyTable
              
              competencies={specificJobCompetencyList}
              evaluations={specificJobCompetencies}
              setEvaluations={setSpecificJobCompetencies}
              levels={competencyLevels}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-8">Gestion des Stages</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-full text-left p-3 rounded-lg ${currentPage === 1 ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-700'}`}
              >
                Détails du Stage
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-full text-left p-3 rounded-lg ${currentPage === 2 ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-700'}`}
              >
                Appréciations
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage(3)}
                className={`w-full text-left p-3 rounded-lg ${currentPage === 3 ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-700'}`}
              >
                Compétences
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage(4)}
                className={`w-full text-left p-3 rounded-lg ${currentPage === 4 ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-700'}`}
              >
                Compétences Techniques
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage(5)}
                className={`w-full text-left p-3 rounded-lg ${currentPage === 5 ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-700'}`}
              >
                Compétences Spécifiques Métier
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
          {renderPage()}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            {currentPage < 5 ? (
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`${
                  submitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                } text-white px-6 py-3 rounded-lg transition duration-200`}
              >
                {submitting ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;