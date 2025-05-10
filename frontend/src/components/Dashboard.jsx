import { useState, useEffect } from 'react';
import CategoryManager from './CategoryManager';
import EvaluationVisualizer from './EvaluationVisualizer';

const Dashboard = ({ userData = {} }) => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mockData, setMockData] = useState({
    categories: [
      { id: 1, intitule: 'Implication', valeur: 4 },
      { id: 2, intitule: 'Ouverture d\'esprit', valeur: 3.5 },
      { id: 3, intitule: 'Qualité du travail', valeur: 4.2 },
    ],
    competencies: [
      { id: 1, intitule: 'Communication', note: 3.5 },
      { id: 2, intitule: 'Autonomie', note: 4.0 },
      { id: 3, intitule: 'Travail en équipe', note: 3.8 },
      { id: 4, intitule: 'Résolution de problèmes', note: 4.2 },
      { id: 5, intitule: 'Analyse', note: 3.7 },
    ],
    evaluations: [
      { id: 1, categorie_id: 1, competences_id: 1, valeur: 4, commentaire: 'Bonne implication' },
      { id: 2, categorie_id: 2, competences_id: 2, valeur: 3, commentaire: 'Quelques difficultés' },
      { id: 3, categorie_id: 3, competences_id: 3, valeur: 5, commentaire: 'Excellent travail en équipe' },
    ]
  });

  // Handle category selection from CategoryManager
  const handleCategorySelect = (categoryId, competency) => {
    const existingIndex = selectedCategories.findIndex(
      item => item.categoryId === categoryId && item.competency === competency
    );
    
    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedCategories(selectedCategories.filter((_, index) => index !== existingIndex));
    } else {
      // Add if not selected
      setSelectedCategories([...selectedCategories, { categoryId, competency }]);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setSelectedView('categories')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'categories' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            Catégories
          </button>
          <button
            onClick={() => setSelectedView('visualizations')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'visualizations' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            Visualisations
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="space-y-6">
        {/* Overview view */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Résumé des évaluations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-blue-800">Stages</h3>
                      <span className="text-3xl font-bold text-blue-600">1</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">Entreprise: {userData.companyName || 'Non spécifiée'}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-green-800">Catégories</h3>
                      <span className="text-3xl font-bold text-green-600">{mockData.categories.length}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">Évaluées et configurées</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-purple-800">Compétences</h3>
                      <span className="text-3xl font-bold text-purple-600">{mockData.competencies.length}</span>
                    </div>
                    <p className="text-sm text-purple-600 mt-1">Évaluées et configurées</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-amber-800">Score moyen</h3>
                      <span className="text-3xl font-bold text-amber-600">
                        {mockData.evaluations.length > 0
                          ? (mockData.evaluations.reduce((sum, ev) => sum + ev.valeur, 0) / mockData.evaluations.length).toFixed(1)
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <p className="text-sm text-amber-600 mt-1">Sur 5 points</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Informations du Stage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Stagiaire</p>
                      <p className="font-medium text-gray-800">{userData.studentName || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Entreprise</p>
                      <p className="font-medium text-gray-800">{userData.companyName || 'Non spécifiée'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tuteur</p>
                      <p className="font-medium text-gray-800">{userData.tutorName || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Période</p>
                      <p className="font-medium text-gray-800">
                        {userData.dateDebut && userData.dateFin 
                          ? `Du ${new Date(userData.dateDebut).toLocaleDateString()} au ${new Date(userData.dateFin).toLocaleDateString()}`
                          : userData.period || 'Non spécifiée'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Appréciations Globales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Implication</p>
                      <p className="font-medium text-gray-800">{userData.implication || 'Non évaluée'}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Ouverture aux autres</p>
                      <p className="font-medium text-gray-800">{userData.openness || 'Non évaluée'}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Qualité du travail</p>
                      <p className="font-medium text-gray-800">{userData.quality || 'Non évaluée'}</p>
                    </div>
                  </div>
                  
                  {userData.observations && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Observations</p>
                      <p className="text-gray-800">{userData.observations}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <EvaluationVisualizer evaluationData={mockData} />
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Actions Rapides</h2>
                <div className="space-y-4">
                  <button className="w-full flex items-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Ajouter une nouvelle compétence
                  </button>
                  
                  <button className="w-full flex items-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Créer une nouvelle évaluation
                  </button>
                  
                  <button className="w-full flex items-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier l'appréciation globale
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Categories view */}
        {selectedView === 'categories' && (
          <CategoryManager onCategorySelect={handleCategorySelect} selectedCategories={selectedCategories} />
        )}
        
        {/* Visualizations view */}
        {selectedView === 'visualizations' && (
          <EvaluationVisualizer evaluationData={mockData} showDetails={true} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;