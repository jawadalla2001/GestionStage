import React, { useState } from 'react';
import { apiClient } from '../services/api';

const EndpointTester = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stageId, setStageId] = useState('');
  const [tuteurId, setTuteurId] = useState('');
  const [periodeId, setPeriodeId] = useState('');
  const [method, setMethod] = useState('POST');

  // Tester création de période
  const testCreatePeriode = async () => {
    if (!stageId) {
      setError("ID du stage obligatoire");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const periodeData = {
        dateDebut: "2024-05-01",
        dateFin: "2024-07-31",
        stage: { id: parseInt(stageId) }
      };
      
      let response;
      if (method === 'POST') {
        response = await apiClient.post('/periodes', periodeData);
      } else {
        if (!periodeId) {
          setError("ID de période requis pour la méthode PUT");
          setLoading(false);
          return;
        }
        response = await apiClient.put(`/periodes/${periodeId}`, {
          ...periodeData,
          id: parseInt(periodeId)
        });
      }
      
      setResult({
        success: true,
        method: method,
        endpoint: method === 'POST' ? '/periodes' : `/periodes/${periodeId}`,
        data: response.data
      });
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message || 'Error during test');
      setResult({
        success: false,
        method: method,
        endpoint: method === 'POST' ? '/periodes' : `/periodes/${periodeId}`,
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Tester association tuteur-periode
  const testLinkTuteurPeriode = async () => {
    if (!periodeId || !tuteurId) {
      setError("IDs période et tuteur obligatoires");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = `/periodes/${periodeId}/tuteur/${tuteurId}`;
      
      let response;
      if (method === 'POST') {
        response = await apiClient.post(endpoint);
      } else {
        response = await apiClient.put(endpoint);
      }
      
      setResult({
        success: true,
        method: method,
        endpoint: endpoint,
        data: response.data
      });
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message || 'Error during test');
      setResult({
        success: false,
        method: method,
        endpoint: `/periodes/${periodeId}/tuteur/${tuteurId}`,
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Testeur d'Endpoints Spécifiques</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Méthode HTTP</h3>
        <div className="flex space-x-4 mb-4">
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              value="POST" 
              checked={method === 'POST'} 
              onChange={() => setMethod('POST')}
              className="form-radio"
            />
            <span className="ml-2">POST</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              value="PUT" 
              checked={method === 'PUT'} 
              onChange={() => setMethod('PUT')}
              className="form-radio"
            />
            <span className="ml-2">PUT</span>
          </label>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Création Période</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID du Stage
          </label>
          <input
            type="number"
            value={stageId}
            onChange={(e) => setStageId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="ex: 1"
          />
        </div>
        <button
          onClick={testCreatePeriode}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Tester Création Période
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Association Tuteur-Période</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID de la Période
          </label>
          <input
            type="number"
            value={periodeId}
            onChange={(e) => setPeriodeId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="ex: 1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID du Tuteur
          </label>
          <input
            type="number"
            value={tuteurId}
            onChange={(e) => setTuteurId(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="ex: 1"
          />
        </div>
        <button
          onClick={testLinkTuteurPeriode}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Tester Association Tuteur-Période
        </button>
      </div>
      
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
          <p><strong>Méthode:</strong> {result.method}</p>
          <p><strong>Endpoint:</strong> {result.endpoint}</p>
          
          {result.success ? (
            <div className="mt-2">
              <h4 className="font-semibold">Données reçues:</h4>
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

export default EndpointTester; 