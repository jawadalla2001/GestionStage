import { useState } from 'react';

const competencyLevels = ['NA', 'DEBUTANT', 'AUTONOME', 'AUTONOME +'];

// Define color mapping for competency levels
const levelColors = {
  'NA': 'bg-gray-100 border-gray-300 text-gray-800',
  'DEBUTANT': 'bg-blue-50 border-blue-300 text-blue-800',
  'AUTONOME': 'bg-green-50 border-green-300 text-green-800',
  'AUTONOME +': 'bg-indigo-50 border-indigo-300 text-indigo-800'
};

const CompetencyTable = ({ title, competencies, evaluations, setEvaluations, levels = competencyLevels }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Get the appropriate level color class
  const getLevelColorClass = (level) => {
    return levelColors[level] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  // Count number of evaluations completed
  const completedCount = Object.keys(evaluations).length;
  const totalCount = competencies.length;
  const completionPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mb-8">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <div className="text-sm text-gray-600 flex items-center">
            <span className="mr-2">Complété: {completedCount}/{totalCount}</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <th className="p-4 text-left border-b border-gray-300 font-medium">Compétence</th>
              {levels.map((level) => (
                <th key={level} className="p-4 text-center border-b border-gray-300 font-medium">
                  <div className={`inline-block rounded-md px-2 py-1 ${getLevelColorClass(level)}`}>
                    {level}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competencies.map((comp, index) => (
              <tr 
                key={index} 
                className={`hover:bg-blue-50 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="p-4 border-b border-gray-300">{comp}</td>
                {levels.map((level) => {
                  const isSelected = evaluations[comp] === level;
                  const isHovered = hoveredCell === `${comp}-${level}`;
                  
                  return (
                    <td 
                      key={level} 
                      className="p-3 text-center border-b border-gray-300"
                      onMouseEnter={() => setHoveredCell(`${comp}-${level}`)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <label 
                        className={`flex justify-center items-center cursor-pointer w-full h-full transition-all duration-150 rounded-md ${
                          isSelected 
                            ? `ring-2 ring-offset-2 ${level === 'NA' ? 'ring-gray-400' : level === 'DEBUTANT' ? 'ring-blue-400' : level === 'AUTONOME' ? 'ring-green-400' : 'ring-indigo-500'}`
                            : isHovered ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name={`${comp}-level`}
                            checked={isSelected}
                            onChange={() => setEvaluations((prev) => ({ ...prev, [comp]: level }))}
                            className="opacity-0 absolute h-8 w-8 cursor-pointer"
                            aria-label={`Niveau ${level} pour ${comp}`}
                          />
                          <div className={`w-6 h-6 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                            isSelected 
                              ? `${level === 'NA' ? 'border-gray-500 bg-gray-100' : level === 'DEBUTANT' ? 'border-blue-500 bg-blue-100' : level === 'AUTONOME' ? 'border-green-500 bg-green-100' : 'border-indigo-600 bg-indigo-100'}`
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && (
                              <div className={`w-3 h-3 rounded-full ${
                                level === 'NA' ? 'bg-gray-500' : level === 'DEBUTANT' ? 'bg-blue-500' : level === 'AUTONOME' ? 'bg-green-500' : 'bg-indigo-600'
                              }`}></div>
                            )}
                          </div>
                        </div>
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend for mobile view */}
      <div className="mt-4 md:hidden">
        <div className="text-sm text-gray-600 mb-2">Légende:</div>
        <div className="flex flex-wrap gap-2">
          {levels.map(level => (
            <div key={level} className={`text-xs px-2 py-1 rounded-md ${getLevelColorClass(level)}`}>
              {level}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetencyTable;