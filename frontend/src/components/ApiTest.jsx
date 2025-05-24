import React, { useState, useEffect } from 'react';
import {
  stageApi,
  periodeApi,
  tuteurApi,
  stagiaireApi,
  appreciationApi,
  competencesApi,
  categorieApi,
  evaluationApi
} from '../services/api';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const runApiTests = async () => {
    setLoading(true);
    setError(null);
    const results = {};
    
    try {
      // Test stagiaire API
      console.log('Testing stagiaire API...');
      const stagiairesResponse = await stagiaireApi.getAll();
      results.stagiaires = {
        success: true,
        count: stagiairesResponse.data.length,
        data: stagiairesResponse.data.slice(0, 3) // Just show first 3 for brevity
      };
      
      // Test tuteur API
      console.log('Testing tuteur API...');
      const tuteursResponse = await tuteurApi.getAll();
      results.tuteurs = {
        success: true,
        count: tuteursResponse.data.length,
        data: tuteursResponse.data.slice(0, 3)
      };
      
      // Test stage API
      console.log('Testing stage API...');
      const stagesResponse = await stageApi.getAll();
      results.stages = {
        success: true,
        count: stagesResponse.data.length,
        data: stagesResponse.data.slice(0, 3)
      };
      
      // Test periode API
      console.log('Testing periode API...');
      const periodesResponse = await periodeApi.getAll();
      results.periodes = {
        success: true,
        count: periodesResponse.data.length,
        data: periodesResponse.data.slice(0, 3)
      };
      
      // Test appreciation API
      console.log('Testing appreciation API...');
      const appreciationsResponse = await appreciationApi.getAll();
      results.appreciations = {
        success: true,
        count: appreciationsResponse.data.length,
        data: appreciationsResponse.data.slice(0, 3)
      };
      
      // Test competences API
      console.log('Testing competences API...');
      const competencesResponse = await competencesApi.getAll();
      results.competences = {
        success: true,
        count: competencesResponse.data.length,
        data: competencesResponse.data.slice(0, 3)
      };
      
      // Test categorie API
      console.log('Testing categorie API...');
      const categoriesResponse = await categorieApi.getAll();
      results.categories = {
        success: true,
        count: categoriesResponse.data.length,
        data: categoriesResponse.data.slice(0, 3)
      };
      
      // Test evaluations API
      console.log('Testing evaluations API...');
      const evaluationsResponse = await evaluationApi.getAll();
      results.evaluations = {
        success: true,
        count: evaluationsResponse.data.length,
        data: evaluationsResponse.data.slice(0, 3)
      };
      
      setTestResults(results);
    } catch (err) {
      console.error('API test error:', err);
      setError(err.message || 'Une erreur est survenue lors des tests API');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Auto-run tests when component mounts
    runApiTests();
  }, []);
  
  return (
    <div className="api-test-container" style={{ padding: '20px' }}>
      <h2>API Connection Test</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', margin: '15px 0' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <button 
        onClick={runApiTests} 
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Testing APIs...' : 'Run API Tests'}
      </button>
      
      {loading && <p>Running tests, please wait...</p>}
      
      {!loading && Object.keys(testResults).length > 0 && (
        <div className="results-container" style={{ marginTop: '20px' }}>
          <h3>Test Results</h3>
          
          {Object.entries(testResults).map(([apiName, result]) => (
            <div key={apiName} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd' }}>
              <h4 style={{ 
                color: result.success ? 'green' : 'red',
                display: 'flex',
                alignItems: 'center'
              }}>
                {result.success ? '✅' : '❌'} {apiName.charAt(0).toUpperCase() + apiName.slice(1)} API
              </h4>
              
              {result.success && (
                <>
                  <p>Found {result.count} records</p>
                  {result.count > 0 && (
                    <div>
                      <h5>Sample Data:</h5>
                      <pre style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '10px', 
                        borderRadius: '5px',
                        overflow: 'auto',
                        maxHeight: '200px'
                      }}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTest; 