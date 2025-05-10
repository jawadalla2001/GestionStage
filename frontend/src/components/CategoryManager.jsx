import { useState, useEffect } from 'react';

const CategoryManager = ({ onCategorySelect, selectedCategories = [] }) => {
  const [categories, setCategories] = useState([
    { id: 'cat1', intitule: 'Compétences personnelles', items: ['Communication', 'Autonomie', 'Résolution de problèmes'] },
    { id: 'cat2', intitule: 'Compétences techniques', items: ['Programmation', 'Analyse de données', 'Conception'] },
    { id: 'cat3', intitule: 'Compétences professionnelles', items: ['Travail en équipe', 'Gestion du temps', 'Organisation'] },
  ]);
  
  const [newCategory, setNewCategory] = useState('');
  const [newCompetency, setNewCompetency] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    
    const categoryId = `cat${Date.now()}`;
    setCategories([
      ...categories,
      { id: categoryId, intitule: newCategory, items: [] }
    ]);
    setNewCategory('');
    setExpandedCategory(categoryId);
    setSelectedCategoryId(categoryId);
  };

  // Handle adding a new competency to a category
  const handleAddCompetency = () => {
    if (newCompetency.trim() === '' || !selectedCategoryId) return;
    
    setCategories(categories.map(category => 
      category.id === selectedCategoryId 
        ? { ...category, items: [...category.items, newCompetency] }
        : category
    ));
    setNewCompetency('');
  };

  // Handle selecting a competency
  const handleCompetencySelect = (categoryId, competency) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId, competency);
    }
  };

  // Check if a competency is selected
  const isCompetencySelected = (categoryId, competency) => {
    return selectedCategories.some(item => 
      item.categoryId === categoryId && item.competency === competency
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestionnaire de Catégories et Compétences</h2>
      
      {/* Category addition form */}
      <div className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nouvelle catégorie..."
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Ajouter Catégorie
        </button>
      </div>
      
      {/* Category list */}
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category.id} className="border border-gray-200 rounded-lg">
            <div 
              className="flex justify-between items-center p-3 bg-blue-50 rounded-t-lg cursor-pointer"
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
            >
              <h3 className="font-medium text-blue-800">{category.intitule}</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">{category.items.length} compétences</span>
                <button className="p-1 hover:bg-blue-100 rounded-full">
                  {expandedCategory === category.id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {expandedCategory === category.id && (
              <div className="p-3">
                {/* Competency list */}
                <ul className="space-y-2 mb-4">
                  {category.items.map((competency, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{competency}</span>
                      <button
                        onClick={() => handleCompetencySelect(category.id, competency)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          isCompetencySelected(category.id, competency)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {isCompetencySelected(category.id, competency) ? 'Sélectionné' : 'Sélectionner'}
                      </button>
                    </li>
                  ))}
                </ul>
                
                {/* Add competency form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCompetency}
                    onChange={(e) => setNewCompetency(e.target.value)}
                    placeholder="Nouvelle compétence..."
                    className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onFocus={() => setSelectedCategoryId(category.id)}
                  />
                  <button
                    onClick={handleAddCompetency}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Selected competencies summary */}
      {selectedCategories.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Compétences sélectionnées</h3>
          <ul className="space-y-1">
            {selectedCategories.map((item, index) => {
              const category = categories.find(cat => cat.id === item.categoryId);
              return (
                <li key={index} className="text-sm text-gray-700">
                  <span className="font-medium">{category ? category.intitule : 'Catégorie'}</span>: {item.competency}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;