const competencyLevels = ['NA', 'DEBUTANT', 'AUTONOME', 'AUTONOME +'];

const CompetencyTable = ({ title, competencies, evaluations, setEvaluations }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead>
            <tr className="bg-blue-100">
              <th className="border border-gray-200 p-4 text-left">Compétence</th>
              {competencyLevels.map((level) => (
                <th key={level} className="border border-gray-200 p-4 text-center">
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competencies.map((comp, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-4">{comp}</td>
                {competencyLevels.map((level) => (
                  <td key={level} className="border border-gray-200 p-4 text-center">
                    <input
                      type="radio"
                      name={`${comp}-level`}
                      checked={evaluations[comp] === level}
                      onChange={() => setEvaluations((prev) => ({ ...prev, [comp]: level }))}
                      className="h-5 w-5 text-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetencyTable;