import { useState, useEffect } from 'react';
import { stageApi, periodeApi, evaluationApi, categorieApi, competencesApi, appreciationApi } from '../services/api';
import EvaluationVisualizer from './EvaluationVisualizer';

const ViewDetailsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.001.007-.001.013 0 .02-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7-.001-.007-.001-.013 0-.02z" />
  </svg>
);

const Dashboard = () => {
  const [view, setView] = useState('list');
  const [stages, setStages] = useState([]);
  const [selectedStageDetails, setSelectedStageDetails] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await stageApi.getAll();
        setStages(response.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des stages:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des stages.");
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, []);

  const fetchStageDetails = async (stageId) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedStageDetails(null);

      const stageResponse = await stageApi.getById(stageId);
      if (!stageResponse.data) {
        throw new Error("Stage non trouvé.");
      }
      const stage = stageResponse.data;
      
      let periode = null;
      if (stage.periodes && stage.periodes.length > 0) {
         periode = stage.periodes[0]; 
      } else {
        console.warn("Aucune période directement associée au stage dans l'objet stage. Verififez la structure des données.");
        const allPeriodesRes = await periodeApi.getAll();
        const foundPeriode = allPeriodesRes.data.find(p => p.stage && p.stage.id === stageId);
        if (foundPeriode) {
            periode = foundPeriode;
        } else {
             console.error(`Aucune période trouvée pour le stage ID: ${stageId}`);
        }
      }
      
      let appreciationsData = [];
      let evaluationsData = [];
      let competencesData = [];
      let categoriesData = [];

      if (periode && periode.id) {
        const allAppreciationsRes = await appreciationApi.getAll();
        appreciationsData = allAppreciationsRes.data.filter(app => app.periode && app.periode.id === periode.id);

        const evaluationIds = new Set();
        const competenceIds = new Set();
        appreciationsData.forEach(app => {
          if (app.evaluation) evaluationIds.add(app.evaluation.id);
          if (app.competences) competenceIds.add(app.competences.id);
        });

        if (evaluationIds.size > 0) {
          const allEvalsRes = await evaluationApi.getAll();
          evaluationsData = allEvalsRes.data.filter(ev => evaluationIds.has(ev.id));
        }

        if (competenceIds.size > 0) {
          const allCompsRes = await competencesApi.getAll();
          competencesData = allCompsRes.data.filter(c => competenceIds.has(c.id));
          
          const categoryIds = new Set();
          competencesData.forEach(c => {
            if (c.categorie) categoryIds.add(c.categorie.id);
          });
          if (categoryIds.size > 0) {
            const allCatsRes = await categorieApi.getAll();
            categoriesData = allCatsRes.data.filter(cat => categoryIds.has(cat.id));
          }
        }
    } else {
        console.warn(`Période non trouvée pour le stage ${stageId}, détails d'appréciation incomplets.`);
      }
      
      setSelectedStageDetails({
        stage,
        periode,
        appreciations: appreciationsData,
        evaluations: evaluationsData,
        competences: competencesData,
        categories: categoriesData
      });
      setView('details');

    } catch (err) {
      console.error(`Erreur lors de la récupération des détails du stage ${stageId}: `, err);
      setError(err.message || "Une erreur est survenue lors du chargement des détails.");
      setView('list');
    } finally {
      setLoading(false);
    }
  };
  
  const renderListView = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Liste des Évaluations</h2>
      {stages.length === 0 ? (
        <p className="text-gray-600">Aucune évaluation soumise pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700">Stagiaire</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700">Entreprise</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700">Tuteur</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700">Période</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {stages.map((stage) => {
                const periode = stage.periodes && stage.periodes.length > 0 ? stage.periodes[0] : null;
                const studentName = stage.stagiaire ? `${stage.stagiaire.prenom || ''} ${stage.stagiaire.nom || 'N/A'}`.trim() : 'N/A';
                const tutorName = stage.tuteur ? `${stage.tuteur.prenom || ''} ${stage.tuteur.nom || 'N/A'}`.trim() : 'N/A';
                const companyName = stage.entreprise || 'N/A';
                const periodeDates = periode ? 
                  `${new Date(periode.dateDebut).toLocaleDateString()} - ${new Date(periode.dateFin).toLocaleDateString()}` 
                  : 'N/A';

                return (
                  <tr key={stage.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{studentName}</td>
                    <td className="py-3 px-4">{companyName}</td>
                    <td className="py-3 px-4">{tutorName}</td>
                    <td className="py-3 px-4">{periodeDates}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => fetchStageDetails(stage.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center transition-colors"
                        title="Voir les détails"
                      >
                        <ViewDetailsIcon />
                        <span className="ml-2">Détails</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderDetailsView = () => {
    if (!selectedStageDetails) {
      return <p className="text-gray-600">Sélectionnez une évaluation pour voir les détails.</p>;
    }

    const { stage, periode, appreciations, evaluations, competences, categories } = selectedStageDetails;

    const getGeneralAppreciationValue = (intitule) => {
      const appreciation = appreciations.find(app => 
        app.evaluation && app.evaluation.categorieStr === intitule &&
        app.competences && app.competences.categorie && app.competences.categorie.intitule === "Appréciations Générales"
      );
      return appreciation && appreciation.evaluation ? (appreciation.evaluation.valeur !== null ? `${appreciation.evaluation.valeur}/20` : 'Non évalué') : 'N/A';
    };
    
    const getGeneralAppreciationComment = (intitule) => {
         const appreciation = appreciations.find(app => 
            app.evaluation && app.evaluation.categorieStr === intitule &&
            app.competences && app.competences.categorie && app.competences.categorie.intitule === "Appréciations Générales"
         );
         return appreciation && appreciation.evaluation ? appreciation.evaluation.commentaire || '' : 'Aucun commentaire';
    };

    const calculateCategoryAverage = (categoryName) => {
        const relevantCompetences = competences.filter(c => c.categorie && c.categorie.intitule === categoryName);
        if (!relevantCompetences.length) return 'N/A';
        
        let totalScore = 0;
        let count = 0;
        
        relevantCompetences.forEach(comp => {
            const appreciation = appreciations.find(app => app.competences && app.competences.id === comp.id);
            if (appreciation && appreciation.evaluation && appreciation.evaluation.valeur !== null) {
                totalScore += appreciation.evaluation.valeur;
                count++;
            }
        });
        
        return count > 0 ? (totalScore / count).toFixed(1) + "/20" : "Non noté";
    };
    
    const getCategoryOverallScore = (categoryName) => {
        const cat = categories.find(c => c.intitule === categoryName);
        return cat && cat.valeur !== null ? cat.valeur.toFixed(1) + "/20" : "N/A (global)";
    };

  const evaluationDataForVisualizer = {
    categories,
    competencies: competences,
    evaluations
  };
    
    const studentName = stage.stagiaire ? `${stage.stagiaire.prenom || ''} ${stage.stagiaire.nom || 'N/A'}`.trim() : 'N/A';
    const tutorName = stage.tuteur ? `${stage.tuteur.prenom || ''} ${stage.tuteur.nom || 'N/A'}`.trim() : 'N/A';

  return (
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Détails de l'Évaluation</h2>
          <button
            onClick={() => { setView('list'); setSelectedStageDetails(null); }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            &larr; Retour à la liste
          </button>
      </div>
      
        <div className="space-y-8">
          <div className="bg-slate-50 p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Informations Générales</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div><dt className="font-medium text-gray-600">Stagiaire:</dt><dd className="text-gray-800">{studentName}</dd></div>
              <div><dt className="font-medium text-gray-600">Email Stagiaire:</dt><dd className="text-gray-800">{stage.stagiaire ? stage.stagiaire.email : 'N/A'}</dd></div>
              <div><dt className="font-medium text-gray-600">Institution:</dt><dd className="text-gray-800">{stage.stagiaire ? stage.stagiaire.institution : 'N/A'}</dd></div>
              <div><dt className="font-medium text-gray-600">Entreprise:</dt><dd className="text-gray-800">{stage.entreprise || 'N/A'}</dd></div>
              <div><dt className="font-medium text-gray-600">Tuteur:</dt><dd className="text-gray-800">{tutorName}</dd></div>
              <div><dt className="font-medium text-gray-600">Email Tuteur:</dt><dd className="text-gray-800">{stage.tuteur ? stage.tuteur.email : 'N/A'}</dd></div>
              {periode && (
                <>
                  <div><dt className="font-medium text-gray-600">Date de début:</dt><dd className="text-gray-800">{new Date(periode.dateDebut).toLocaleDateString()}</dd></div>
                  <div><dt className="font-medium text-gray-600">Date de fin:</dt><dd className="text-gray-800">{new Date(periode.dateFin).toLocaleDateString()}</dd></div>
                </>
              )}
            </dl>
                  </div>
                  
          <div className="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200">
            <h3 className="text-xl font-semibold text-teal-700 mb-4 border-b pb-2">Projet et Objectifs</h3>
            <dl className="space-y-3">
              <div><dt className="font-medium text-gray-600">Thème du projet (Description):</dt><dd className="text-gray-800">{stage.description || 'Non spécifié'}</dd></div>
              <div><dt className="font-medium text-gray-600">Objectifs:</dt><dd className="text-gray-800 whitespace-pre-wrap">{stage.objectif || 'Non spécifiés'}</dd></div>
            </dl>
                  </div>
                  
          <div className="bg-indigo-50 p-6 rounded-lg shadow-md border border-indigo-200">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4 border-b pb-2">Appréciations Générales</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div><dt className="font-medium text-gray-600">Implication dans ses activités:</dt><dd className="text-gray-800">{getGeneralAppreciationValue('Implication dans ses activités')}</dd></div>
              <div><dt className="font-medium text-gray-600">Commentaire Implication:</dt><dd className="text-gray-800 text-sm italic">{getGeneralAppreciationComment('Implication dans ses activités')}</dd></div>
              
              <div><dt className="font-medium text-gray-600">Ouverture aux autres:</dt><dd className="text-gray-800">{getGeneralAppreciationValue('Ouverture aux autres')}</dd></div>
              <div><dt className="font-medium text-gray-600">Commentaire Ouverture:</dt><dd className="text-gray-800 text-sm italic">{getGeneralAppreciationComment('Ouverture aux autres')}</dd></div>

              <div><dt className="font-medium text-gray-600">Qualité du travail:</dt><dd className="text-gray-800">{getGeneralAppreciationValue('Qualité du travail')}</dd></div>
              <div><dt className="font-medium text-gray-600">Commentaire Qualité:</dt><dd className="text-gray-800 text-sm italic">{getGeneralAppreciationComment('Qualité du travail')}</dd></div>
            </dl>
            {/* Display overall observations for the stage */}
            {stage.observations && (
              <div className="mt-4 pt-3 border-t border-indigo-200">
                <dt className="font-medium text-gray-700 mb-1">Observations Générales du Tuteur:</dt>
                <dd className="text-gray-800 whitespace-pre-wrap bg-white p-3 rounded-md shadow-sm text-sm">{stage.observations}</dd>
                    </div>
            )}
                </div>
                
          <div className="bg-rose-50 p-6 rounded-lg shadow-md border border-rose-200">
            <h3 className="text-xl font-semibold text-rose-700 mb-4 border-b pb-2">Scores Globaux des Catégories de Compétences</h3>
             <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div><dt className="font-medium text-gray-600">Compétences liées à l'individu:</dt><dd className="text-gray-800 font-semibold">{getCategoryOverallScore('Compétences liées à l\'individu')}</dd></div>
                <div><dt className="font-medium text-gray-600">Compétences liées à l'entreprise:</dt><dd className="text-gray-800 font-semibold">{getCategoryOverallScore('Compétences liées à l\'entreprise')}</dd></div>
                <div><dt className="font-medium text-gray-600">Compétences Scientifiques et Techniques:</dt><dd className="text-gray-800 font-semibold">{getCategoryOverallScore('Compétences Scientifiques et Techniques')}</dd></div>
                <div><dt className="font-medium text-gray-600">Compétences Spécifiques Métier:</dt><dd className="text-gray-800 font-semibold">{getCategoryOverallScore('Compétences Spécifiques Métier')}</dd></div>
                <div><dt className="font-medium text-gray-600">Appréciations Générales (Score Global):</dt><dd className="text-gray-800 font-semibold">{getCategoryOverallScore('Appréciations Générales')}</dd></div>
            </dl>
                  </div>
                  
          <div className="bg-sky-50 p-6 rounded-lg shadow-md border border-sky-200">
                <h3 className="text-xl font-semibold text-sky-700 mb-4 border-b pb-2">Détail des Compétences Évaluées</h3>
                {categories.filter(cat => cat.intitule !== "Appréciations Générales").map(category => (
                    <div key={category.id} className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">{category.intitule} (Score Global: {category.valeur !== null ? category.valeur.toFixed(1) + "/20" : "N/A"})</h4>
                        {competences.filter(comp => comp.categorie && comp.categorie.id === category.id).length > 0 ? (
                            <ul className="list-disc pl-5 space-y-1">
                                {competences.filter(comp => comp.categorie && comp.categorie.id === category.id).map(comp => {
                                    const evalApp = appreciations.find(app => app.competences && app.competences.id === comp.id);
                                    const evaluation = evalApp ? evaluations.find(ev => ev.id === evalApp.evaluation.id) : null;
                                    return (
                                        <li key={comp.id} className="text-sm">
                                            <span className="font-medium">{comp.intitule}:</span> {evaluation ? `${evaluation.valeur}/20` : 'Non évaluée'}
                                            {evaluation && evaluation.commentaire && <span className="italic text-gray-600"> - "{evaluation.commentaire}"</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Aucune compétence détaillée pour cette catégorie.</p>
                        )}
                    </div>
                ))}
                {(!categories.some(cat => cat.intitule !== "Appréciations Générales") || competences.length === 0) && (
                     <p className="text-sm text-gray-500 italic">Aucune compétence détaillée disponible pour cette évaluation.</p>
                  )}
                </div>
              </div>
            </div>
    );
  };

  if (loading && !selectedStageDetails) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50"><p className="text-xl text-gray-700">Chargement du tableau de bord...</p></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <p className="text-xl text-red-600 mb-4">Erreur: {error}</p>
        <button
            onClick={() => { 
                setError(null); 
                setView('list'); 
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
            Retour à la liste
                  </button>
                </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center md:text-left">
          Tableau de Bord des Évaluations
        </h1>
      </header>
      
      {loading && selectedStageDetails && (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
              <p className="text-xl text-blue-600">Chargement des détails de l'évaluation...</p>
          </div>
        )}
        
      {view === 'list' ? renderListView() : renderDetailsView()}
        
    </div>
  );
};

export default Dashboard;