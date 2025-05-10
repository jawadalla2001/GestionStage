import { useState, useEffect } from 'react';

const EvaluationVisualizer = ({ evaluationData = {}, showDetails = true }) => {
  const [activeTab, setActiveTab] = useState('categories');
  
  // Extract data
  const categories = evaluationData.categories || [];
  const competencies = evaluationData.competencies || [];
  const evaluations = evaluationData.evaluations || [];

  // Calculate stats
  const totalCategories = categories.length;
  const totalCompetencies = competencies.length;
  const totalEvaluations = evaluations.length;
  const averageScore = evaluations.length > 0 
    ? (evaluations.reduce((sum, evaluation) => sum + parseFloat(evaluation.valeur || 0), 0) / evaluations.length).toFixed(1)
    : 'N/A';

  // Generate colors for chart elements
  const generateColor = (index, total) => {
    const hue = (index / total) * 360;
    return `hsl(${hue}, 70%, 65%)`;
  };

  // Render radar chart for competencies
  const renderRadarChart = () => {
    // Size parameters
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 100;
    const angles = competencies.map((_, i) => (i / competencies.length) * 2 * Math.PI);
    
    // Calculate positions for each competency
    const points = competencies.map((comp, i) => {
      const score = comp.note || 0;
      const radius = (score / 5) * maxRadius; // Assuming score is between 0-5
      const x = centerX + radius * Math.sin(angles[i]);
      const y = centerY - radius * Math.cos(angles[i]);
      return { x, y, label: comp.intitule };
    });
    
    // Generate polygon path
    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
    
    return (
      <div className="flex justify-center my-4">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Background circles */}
          {[1, 2, 3, 4, 5].map(level => (
            <circle 
              key={level} 
              cx={centerX} 
              cy={centerY} 
              r={level * maxRadius / 5} 
              fill="none" 
              stroke="#e5e7eb" 
              strokeWidth="1" 
            />
          ))}
          
          {/* Axis lines */}
          {angles.map((angle, i) => (
            <line 
              key={i}
              x1={centerX} 
              y1={centerY} 
              x2={centerX + maxRadius * Math.sin(angle)} 
              y2={centerY - maxRadius * Math.cos(angle)} 
              stroke="#e5e7eb" 
              strokeWidth="1" 
            />
          ))}
          
          {/* Data polygon */}
          <polygon 
            points={polygonPoints} 
            fill="rgba(59, 130, 246, 0.3)" 
            stroke="#3b82f6" 
            strokeWidth="2" 
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <circle 
              key={i} 
              cx={point.x} 
              cy={point.y} 
              r="4" 
              fill="#3b82f6" 
            />
          ))}
          
          {/* Labels */}
          {competencies.map((comp, i) => {
            const labelX = centerX + (maxRadius + 20) * Math.sin(angles[i]);
            const labelY = centerY - (maxRadius + 20) * Math.cos(angles[i]);
            return (
              <text 
                key={i}
                x={labelX} 
                y={labelY} 
                textAnchor="middle" 
                fontSize="10" 
                fill="#4b5563"
              >
                {comp.intitule}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  // Render bar chart for categories
  const renderBarChart = () => {
    const maxValue = Math.max(...categories.map(cat => cat.valeur || 0), 5);
    
    return (
      <div className="space-y-4 my-4">
        {categories.map((category, index) => (
          <div key={index} className="relative">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{category.intitule}</span>
              <span className="text-sm text-gray-600">{category.valeur || 0}/5</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ 
                  width: `${((category.valeur || 0) / maxValue) * 100}%`,
                  backgroundColor: generateColor(index, categories.length)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Visualisation des Évaluations</h2>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800">Catégories</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCategories}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800">Compétences</h3>
          <p className="text-3xl font-bold text-green-600">{totalCompetencies}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800">Évaluations</h3>
          <p className="text-3xl font-bold text-purple-600">{totalEvaluations}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800">Score moyen</h3>
          <p className="text-3xl font-bold text-amber-600">{averageScore}</p>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('categories')}
              className={`inline-block py-2 px-4 text-sm font-medium rounded-t-lg ${
                activeTab === 'categories' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Catégories
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('competencies')}
              className={`inline-block py-2 px-4 text-sm font-medium rounded-t-lg ${
                activeTab === 'competencies' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compétences
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('relations')}
              className={`inline-block py-2 px-4 text-sm font-medium rounded-t-lg ${
                activeTab === 'relations' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Relations
            </button>
          </li>
        </ul>
      </div>
      
      {/* Tab content */}
      <div>
        {activeTab === 'categories' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Évaluation par Catégorie</h3>
            {categories.length > 0 ? (
              renderBarChart()
            ) : (
              <p className="text-gray-500 italic">Aucune catégorie disponible</p>
            )}
          </div>
        )}
        
        {activeTab === 'competencies' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Évaluation par Compétence</h3>
            {competencies.length > 0 ? (
              renderRadarChart()
            ) : (
              <p className="text-gray-500 italic">Aucune compétence disponible</p>
            )}
          </div>
        )}
        
        {activeTab === 'relations' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Relations entre Évaluations</h3>
            {evaluations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compétence</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {evaluations.map((evaluation, index) => {
                      const category = categories.find(cat => cat.id === evaluation.categorie_id);
                      const competency = competencies.find(comp => comp.id === evaluation.competences_id);
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category?.intitule || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{competency?.intitule || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {evaluation.valeur || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{evaluation.commentaire || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucune évaluation disponible</p>
            )}
          </div>
        )}
      </div>
      
      {/* Empty state */}
      {totalCategories === 0 && totalCompetencies === 0 && totalEvaluations === 0 && (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune donnée à afficher</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter des catégories et des compétences pour visualiser les évaluations.
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationVisualizer;