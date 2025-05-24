import React, { useState } from 'react';
import { apiClient } from '../services/api';

const DataCheckTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testCase, setTestCase] = useState('stagiaire');

  // Test simple pour l'insertion d'un stagiaire
  const testStagiaire = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Données de test pour un stagiaire
      const stagiaireData = {
        nom: "Test",
        prenom: "Stagiaire",
        email: "test.stagiaire@example.com",
        institution: "Institution Test"
      };
      
      // Envoyer directement à l'API sans passer par les services
      const response = await apiClient.post('/stagiaires', stagiaireData);
      setResult({
        success: true,
        data: response.data,
        endpoint: '/stagiaires'
      });
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message || 'Error during test');
      setResult({
        success: false,
        error: err.message,
        endpoint: '/stagiaires'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Test simple pour la période
  const testPeriode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // D'abord créer un stage
      const stageData = {
        description: "Stage test",
        objectif: "Test objectif",
        entreprise: "Entreprise Test"
      };
      
      const stageResponse = await apiClient.post('/stages', stageData);
      const stageId = stageResponse.data.id;
      
      // Ensuite créer un stagiaire
      const stagiaireData = {
        nom: "Test",
        prenom: "Stagiaire",
        email: `test.stagiaire.${Date.now()}@example.com`,
        institution: "Institution Test"
      };
      
      const stagiaireResponse = await apiClient.post('/stagiaires', stagiaireData);
      const stagiaireId = stagiaireResponse.data.id;
      
      // Maintenant créer une période
      const periodeData = {
        dateDebut: "2024-05-01",
        dateFin: "2024-07-31",
        stage: { id: stageId },
        stagiaire: { id: stagiaireId }
      };
      
      const periodeResponse = await apiClient.post('/periodes', periodeData);
      
      setResult({
        success: true,
        data: {
          stage: stageResponse.data,
          stagiaire: stagiaireResponse.data,
          periode: periodeResponse.data
        },
        endpoint: '/periodes'
      });
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message || 'Error during test');
      setResult({
        success: false,
        error: err.message,
        endpoint: '/periodes'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Test complet pour l'appréciation et les compétences
  const testAppreciation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Utiliser le nouvel endpoint simplifié pour le test complet
      await apiClient.post('/evaluations/test-complet', {});
      
      setResult({
        success: true,
        data: {
          message: "Test exécuté avec succès. Veuillez vérifier la base de données pour confirmer."
        },
        endpoint: 'Test complet'
      });
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message || 'Error during test');
      setResult({
        success: false,
        error: err.message,
        endpoint: 'Test complet'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const runSelectedTest = () => {
    switch(testCase) {
      case 'stagiaire':
        testStagiaire();
        break;
      case 'periode':
        testPeriode();
        break;
      case 'appreciation':
        testAppreciation();
        break;
      default:
        testStagiaire();
    }
  };
  
  return (
    <div className="data-check-container p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Test d'insertion des données</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Sélectionner un test:</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="stagiaire"
              checked={testCase === 'stagiaire'}
              onChange={() => setTestCase('stagiaire')}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Stagiaire</span>
          </label>
          
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="periode"
              checked={testCase === 'periode'}
              onChange={() => setTestCase('periode')}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Période</span>
          </label>
          
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="appreciation"
              checked={testCase === 'appreciation'}
              onChange={() => setTestCase('appreciation')}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Test complet</span>
          </label>
        </div>
      </div>
      
      <button
        onClick={runSelectedTest}
        disabled={loading}
        className={`px-4 py-2 rounded font-medium ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Test en cours...' : 'Exécuter le test'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Erreur:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className={`mt-4 p-4 rounded border ${
          result.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
        }`}>
          <h3 className="font-bold text-lg mb-2">
            {result.success ? 'Test réussi' : 'Échec du test'}
          </h3>
          <p><strong>Endpoint:</strong> {result.endpoint}</p>
          
          {result.success ? (
            <div className="mt-2">
              <h4 className="font-semibold">Données insérées:</h4>
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto max-h-96 text-sm">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-red-600 mt-2">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DataCheckTest; 