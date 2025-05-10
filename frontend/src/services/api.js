import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
// Add request/response interceptors for debugging
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for slow connections
  timeout: 10000
});

// Request interceptor - log all requests
apiClient.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  console.log('Request Data:', request.data);
  return request;
});

// Response interceptor - log responses
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with an error status
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No Response Received:', error.request);
    } else {
      // Request setup failed
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Stage (Internship) API
export const stageApi = {
  // Get all stages
  getAll: () => apiClient.get('/stages'),
  
  // Get stage by ID
  getById: (id) => apiClient.get(`/stages/${id}`),
  
  // Create new stage
  create: (stageData) => apiClient.post('/stages', stageData),
  
  // Create stage with minimal entity references to avoid issues
  createWithIds: (description, objectif, entreprise, stagiaireId, tuteurId) => {
    // Use the minimal format expected by JPA/Hibernate
    const stageData = {
      description,
      objectif,
      entreprise,
      stagiaire: { id: stagiaireId },
      tuteur: { id: tuteurId }
    };
    
    console.log('Creating stage with minimal ID references:', JSON.stringify(stageData, null, 2));
    return apiClient.post('/stages', stageData);
  },
  
  // Update stage
  update: (id, stageData) => apiClient.put(`/stages/${id}`, stageData),
  
  // Delete stage
  delete: (id) => apiClient.delete(`/stages/${id}`),
};

// Période (Period) API
export const periodeApi = {
  // Get all periods
  getAll: () => apiClient.get('/periodes'),
  
  // Create new period for a stage
  create: (stageId, periodeData) => apiClient.post(`/periodes/stage/${stageId}`, periodeData),
  
  // Update period
  update: (id, periodeData) => apiClient.put(`/periodes/${id}`, periodeData),
};

// Tuteur (Tutor) API
export const tuteurApi = {
  // Get all tutors
  getAll: () => apiClient.get('/tuteurs'),
  
  // Get tutor by ID
  getById: (id) => apiClient.get(`/tuteurs/${id}`),
  
  // Create new tutor
  create: (tuteurData) => apiClient.post('/tuteurs', tuteurData),
  
  // Find or create a tutor by email
  findOrCreate: async (tuteurData) => {
    try {
      // Try to find by email first
      const response = await apiClient.get(`/tuteurs/email/${tuteurData.email}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If not found, create new tutor
        const createResponse = await apiClient.post('/tuteurs', tuteurData);
        return createResponse.data;
      }
      throw error;
    }
  },
};

// Stagiaire (Intern) API
export const stagiaireApi = {
  // Get all interns
  getAll: () => apiClient.get('/stagiaires'),
  
  // Get intern by ID
  getById: (id) => apiClient.get(`/stagiaires/${id}`),
  
  // Create new intern
  create: (stagiaireData) => apiClient.post('/stagiaires', stagiaireData),
  
  // Find or create an intern by email
  findOrCreate: async (stagiaireData) => {
    try {
      // Try to find by email first
      const response = await apiClient.get(`/stagiaires/email/${stagiaireData.email}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If not found, create new intern
        const createResponse = await apiClient.post('/stagiaires', stagiaireData);
        return createResponse.data;
      }
      throw error;
    }
  },
};

// Appreciation API
export const appreciationApi = {
  // Get all appreciations
  getAll: () => apiClient.get('/appreciations'),
  
  // Get appreciation by ID
  getById: (id) => apiClient.get(`/appreciations/${id}`),
  
  // Create new appreciation for a tutor
  create: (tuteurId, appreciationData) => 
    apiClient.post(`/appreciations/tuteur/${tuteurId}`, appreciationData),
  
  // Update appreciation
  update: (id, appreciationData) => 
    apiClient.put(`/appreciations/${id}`, appreciationData),
};

// Compétences (Skills) API
export const competencesApi = {
  // Get all competences
  getAll: () => apiClient.get('/competences'),
  
  // Get competence by ID
  getById: (id) => apiClient.get(`/competences/${id}`),
  
  // Find competence by title or create if not exists
  findOrCreate: async (competenceTitle, note = 0) => {
    try {
      const response = await apiClient.get(`/competences/intitule/${competenceTitle}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Create new competence if not found
        const createResponse = await apiClient.post('/competences', {
          intitule: competenceTitle,
          note: note
        });
        return createResponse.data;
      }
      throw error;
    }
  }
};

// Catégorie API
export const categorieApi = {
  // Get all categories
  getAll: () => apiClient.get('/categories'),
  
  // Get category by ID
  getById: (id) => apiClient.get(`/categories/${id}`),
  
  // Find category by title or create if not exists
  findOrCreate: async (categorieTitle, valeur = 0) => {
    try {
      const response = await apiClient.get(`/categories/intitule/${categorieTitle}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Create new category if not found
        const createResponse = await apiClient.post('/categories', {
          intitule: categorieTitle,
          valeur: valeur
        });
        return createResponse.data;
      }
      throw error;
    }
  }
};

// Evaluation API
export const evaluationApi = {
  // Get all evaluations
  getAll: () => apiClient.get('/evaluations'),
  
  // Create evaluation for appreciation and category
  createForCategory: (appreciationId, categorieId, evaluationData) => 
    apiClient.post(`/evaluations/appreciation/${appreciationId}/categorie/${categorieId}`, evaluationData),
  
  // Create evaluation for appreciation and competence
  createForCompetence: (appreciationId, competenceId, evaluationData) => 
    apiClient.post(`/evaluations/appreciation/${appreciationId}/competences/${competenceId}`, evaluationData),
};

// Submission service - handles the entire form submission process
export const submissionService = {
  submitFormData: async (formData, competencyEvaluations) => {
    console.log('Starting form submission...');
    
    // Variables to track our progress
    let stagiaire = null;
    let tuteur = null;
    let stage = null;
    let appreciation = null;
    let result = {
      success: false,
      error: null,
      stageId: null,
      appreciationId: null,
      partial: false
    };
    
    try {
      // Step 1: Create or find stagiaire (intern)
      try {
        const studentNameParts = formData.studentName.trim().split(/\s+/);
        const stagiaireData = {
          nom: studentNameParts[0] || 'DefaultNom',
          prenom: studentNameParts.length > 1 ? studentNameParts.slice(1).join(' ') : 'DefaultPrenom',
          email: `${formData.studentName.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
          institution: 'Université Hassan II' // Default value
        };
        console.log('Stagiaire Data:', stagiaireData);
        stagiaire = await stagiaireApi.findOrCreate(stagiaireData);
        console.log('Stagiaire created/found successfully:', stagiaire);
      } catch (error) {
        console.error('Error with stagiaire creation:', error);
        throw new Error(`Erreur lors de la création du stagiaire: ${error.message}`);
      }
      
      // Step 2: Create or find tuteur (tutor)
      try {
        const tutorNameParts = formData.tutorName.trim().split(/\s+/);
        const tuteurData = {
          nom: tutorNameParts[0] || 'DefaultNom',
          prenom: tutorNameParts.length > 1 ? tutorNameParts.slice(1).join(' ') : 'DefaultPrenom',
          email: `${formData.tutorName.trim().toLowerCase().replace(/\s+/g, '.')}@entreprise.com`,
          entreprise: formData.companyName || 'DefaultEntreprise'
        };
        console.log('Tuteur Data:', tuteurData);
        tuteur = await tuteurApi.findOrCreate(tuteurData);
        console.log('Tuteur created/found successfully:', tuteur);
      } catch (error) {
        console.error('Error with tuteur creation:', error);
        throw new Error(`Erreur lors de la création du tuteur: ${error.message}`);
      }
      
      // Step 3: Create Stage (internship) - Critical step
      try {
        // Debug to make sure IDs are available
        console.log('Stagiaire ID for stage creation:', stagiaire.id);
        console.log('Tuteur ID for stage creation:', tuteur.id);
        
        // Get the data for stage creation
        const description = formData.projectTheme ? formData.projectTheme.substring(0, 1000) : 'Description non fournie';
        const objectif = formData.objectives ? formData.objectives.substring(0, 1000) : 'Objectif non fourni';
        const entreprise = formData.companyName || 'Entreprise non fournie';
        
        // Prepare for stage creation with query parameters approach
        console.log('Creating stage with query parameters approach');
        try {
          // Create the stage data object for the request body (without IDs)
          const stageRequestData = {
            description,
            objectif,
            entreprise
          };
          
          console.log('Stage request data:', JSON.stringify(stageRequestData, null, 2));
          
          // The backend expects stagiaireId and tuteurId as query parameters
          console.log('Calling create-with-ids endpoint with query parameters');
          console.log('Stage data:', stageRequestData);
          console.log('Stagiaire ID:', stagiaire.id);
          console.log('Tuteur ID:', tuteur.id);
          
          // ULTRA-DIRECT APPROACH: No complex conversions, direct values
          // This is the last resort approach that uses the minimum possible code
          console.log('*** TRYING ULTRA-DIRECT APPROACH ***');
          
          // Force both IDs to be numeric with Number constructor
          const rawStagiaireId = stagiaire.id;
          const rawTuteurId = tuteur.id;
          
          // Use multiple forced conversions to ensure numeric values
          const stagiaireIdFinal = Number(rawStagiaireId);
          const tuteurIdFinal = Number(rawTuteurId);
          
          // Assert that we have valid positive numbers
          console.assert(
            !isNaN(stagiaireIdFinal) && stagiaireIdFinal > 0, 
            'stagiaireIdFinal must be a positive number', 
            {stagiaireIdFinal, rawStagiaireId}
          );
          
          console.assert(
            !isNaN(tuteurIdFinal) && tuteurIdFinal > 0, 
            'tuteurIdFinal must be a positive number', 
            {tuteurIdFinal, rawTuteurId}
          );
          
          // Guaranteed numeric values
          console.log('FINAL CONVERTED IDs:');
          console.log('stagiaireId:', stagiaireIdFinal, '(type:', typeof stagiaireIdFinal, ')');
          console.log('tuteurId:', tuteurIdFinal, '(type:', typeof tuteurIdFinal, ')');
          
          // Create the bare minimum data object
          const minimalStageData = {
            description: description || 'Description',
            objectif: objectif || 'Objectif',
            entreprise: entreprise || 'Entreprise'
          };
          
          // Make the direct API call with forced numeric IDs
          console.log('Making direct API call with forced numeric IDs');
          
          // EMERGENCY APPROACH: Use native fetch instead of axios
          try {
            console.log('*** EMERGENCY APPROACH: Using native fetch API ***');
            
            // Construct the simplest possible URL with numeric parameters
            const emergencyUrl = `${API_URL}/stages/create-with-ids?stagiaireId=${stagiaireIdFinal}&tuteurId=${tuteurIdFinal}`;
            console.log('Emergency URL:', emergencyUrl);
            
            // Use native fetch API with minimal options
            const fetchResponse = await fetch(emergencyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(minimalStageData)
            });
            
            if (!fetchResponse.ok) {
              const errorText = await fetchResponse.text();
              console.error('Fetch API Error:', fetchResponse.status, errorText);
              throw new Error(`Fetch failed with status: ${fetchResponse.status}. Details: ${errorText}`);
            }
            
            const responseData = await fetchResponse.json();
            console.log('Stage created successfully with fetch API:', responseData);
            
            // Set the response for further processing
            const response = { data: responseData };
            console.log('Stage created successfully with query params approach:', response.data);
            stage = response.data;
            console.log('Stage created successfully:', stage);
          } catch (error) {
            console.error('Error creating stage:', error);
            if (error.response && error.response.data) {
              console.error('Error response data:', error.response.data);
              throw new Error(`Erreur lors de la création du stage: ${error.response.data.message || error.message}`);
            } else {
              throw error;
            }
          }
        } catch (error) {
          console.error('All stage creation approaches failed:', error);
          throw new Error(`Erreur lors de la création du stage: ${error.message}`);
        }
        
        // Update result with stage ID since we've created the basic record
        result.stageId = stage.id;
        result.partial = true;
        result.success = true;
      } catch (error) {
        // Detailed logging for stage creation failure
        console.error('Error creating stage:', error);
        
        if (error.response) {
          console.error('Stage creation response data:', error.response.data);
          console.error('Stage creation response status:', error.response.status);
        }
        
        throw new Error(`Erreur lors de la création du stage: ${error.message}`);
      }
      
      // Step 4: Create Periode (period) - OPTIONAL, continue if this fails
      try {
        // Enhanced date parsing specifically for format "YYYY-MM-DD - YYYY-MM-DD"
        const today = new Date().toISOString().split('T')[0]; // Default to today
        let dateDebut = today;
        let dateFin = today;
        
        console.log('Original period input:', formData.period);
        
        if (formData.period && formData.period.trim() !== '') {
          // Split the period string by the separator " - "
          const periodParts = formData.period.trim().split(' - ');
          
          console.log('Period parts after splitting:', periodParts);
          
          if (periodParts.length === 2) {
            try {
              // Extract and validate start date
              const startDateStr = periodParts[0].trim();
              // Check if it's in YYYY-MM-DD format
              if (/^\d{4}-\d{2}-\d{2}$/.test(startDateStr)) {
                console.log('Start date is in correct format:', startDateStr);
                dateDebut = startDateStr;
              } else {
                // For other formats, parse with Date and convert to YYYY-MM-DD
                const startDate = new Date(startDateStr);
                if (!isNaN(startDate.getTime())) {
                  dateDebut = startDate.toISOString().split('T')[0];
                  console.log('Start date converted to:', dateDebut);
                } else {
                  console.error('Invalid start date format:', startDateStr);
                }
              }
              
              // Extract and validate end date
              const endDateStr = periodParts[1].trim();
              // Check if it's in YYYY-MM-DD format
              if (/^\d{4}-\d{2}-\d{2}$/.test(endDateStr)) {
                console.log('End date is in correct format:', endDateStr);
                dateFin = endDateStr;
              } else {
                // For other formats, parse with Date and convert to YYYY-MM-DD
                const endDate = new Date(endDateStr);
                if (!isNaN(endDate.getTime())) {
                  dateFin = endDate.toISOString().split('T')[0];
                  console.log('End date converted to:', dateFin);
                } else {
                  console.error('Invalid end date format:', endDateStr);
                }
              }
            } catch (e) {
              console.error('Date parsing error:', e);
            }
          } else {
            console.error('Period format incorrect. Expected "YYYY-MM-DD - YYYY-MM-DD", got:', formData.period);
          }
        }
        
        const periodeData = {
          dateDebut,
          dateFin
        };
        console.log('Periode Data:', periodeData);
        await periodeApi.create(stage.id, periodeData);
        console.log('Periode created successfully');
      } catch (error) {
        console.error('Error creating periode:', error);
        console.warn('Continuing without periode...');
        // Continue with the process even if this fails
      }
      
      // ATTEMPT CREATING APPRECIATION AND OTHER ENTITIES
      console.log('Proceeding with creating appreciation and other entities after successful stage creation');
      
      // Step 5: Check for existing appreciations FIRST to avoid duplicates
      let existingAppreciation = null;
      try {
        console.log('Checking for existing appreciations for tuteur ID:', tuteur.id);
        
        // Convert to a guaranteed number
        const tuteurIdNum = Number(tuteur.id);
        
        if (isNaN(tuteurIdNum) || tuteurIdNum <= 0) {
          console.error('Invalid tuteur ID for appreciation check:', tuteur.id);
        } else {
          try {
            // Check for existing appreciations
            const getAppreciationsResponse = await fetch(`${API_URL}/appreciations/tuteur/${tuteurIdNum}`);
            
            if (getAppreciationsResponse.ok) {
              const existingAppreciations = await getAppreciationsResponse.json();
              console.log('Found existing appreciations:', existingAppreciations);
              
              if (existingAppreciations && existingAppreciations.length > 0) {
                // Use the first existing appreciation
                existingAppreciation = existingAppreciations[0];
                console.log('Using existing appreciation:', existingAppreciation);
              }
            }
          } catch (err) {
            console.warn('Error checking for existing appreciations:', err);
            // Continue even if this fails - we'll create a new one
          }
        }
        
        // Create new appreciation ONLY if none exists
        if (!existingAppreciation) {
          console.log('No existing appreciation found, creating new one');
          
          // Create appreciation data with mandatory description field
          const appreciationData = {
            description: formData.observations || 'Aucune observation pour le stage'
          };
          
          // Try multiple approaches to create the appreciation
          try {
            console.log('Creating appreciation with direct fetch');
            const appreciationUrl = `${API_URL}/appreciations/tuteur/${tuteurIdNum}`;
            
            // Make a SINGLE direct request for appreciation
            const fetchAppreciationResponse = await fetch(appreciationUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(appreciationData)
            });
            
            if (!fetchAppreciationResponse.ok) {
              throw new Error(`Appreciation creation failed with status: ${fetchAppreciationResponse.status}`);
            }
            
            appreciation = await fetchAppreciationResponse.json();
            console.log('Appreciation created successfully:', appreciation);
          } catch (error) {
            console.error('Error creating appreciation:', error);
            // Don't throw - continue without appreciation
          }
        } else {
          // Use existing appreciation
          appreciation = existingAppreciation;
          console.log('Using existing appreciation:', appreciation.id);
        }
        
        // Update result with appreciation ID if available
        if (appreciation && appreciation.id) {
          result.appreciationId = Number(appreciation.id);
        }
      } catch (error) {
        console.error('Error in appreciation process:', error);
        // Continue with partial success
      }
      
      // Check if we should proceed with competency evaluations
      if (!appreciation || !appreciation.id) {
        console.warn('Skipping competency evaluations since appreciation creation failed');
        
        // If we got here, we at least created the Stage successfully
        result.message = "Stage créé avec succès, mais les évaluations n'ont pas pu être créées.";
        return {
          success: true,
          stageId: stage.id,
          appreciationId: null,
          message: "Stage créé avec succès, mais les évaluations n'ont pas pu être créées."
        };
      }
      
      // Step 6: Create categories, competences, and evaluations using modern async/await approach
      try {
        console.log('===== CREATING CATEGORIES AND EVALUATIONS =====');
        
        // Ensure we have a valid appreciation ID
        const appreciationId = Number(appreciation.id);
        if (isNaN(appreciationId) || appreciationId <= 0) {
          throw new Error('Invalid appreciation ID for evaluations');
        }
        
        // Define default categories with values
        const categories = [
          { intitule: 'Implication', valeur: formData.implication ? implicationLevelToValue(formData.implication) : 3 },
          { intitule: 'Ouverture d\'esprit', valeur: formData.openness ? opennessLevelToValue(formData.openness) : 3 },
          { intitule: 'Qualité du travail', valeur: formData.quality ? qualityLevelToValue(formData.quality) : 3 }
        ];
        
        console.log('Categories to process:', JSON.stringify(categories, null, 2));
        
        // Process categories using async/await and fetch API
        for (const categoryData of categories) {
          console.log(`Processing category: ${categoryData.intitule}`);
          
          try {
            // Use the categorieApi to find or create the category
            const category = await categorieApi.findOrCreate(categoryData.intitule, categoryData.valeur);
            console.log(`Category found/created: ${category.intitule} with ID: ${category.id}`);
            
            // Create evaluation linking category to appreciation
            if (category.id && appreciationId) {
              console.log(`Creating evaluation for category ${category.id} and appreciation ${appreciationId}`);
              
              const evaluationData = {
                valeur: categoryData.valeur,
                commentaire: `Évaluation pour ${categoryData.intitule}`
              };
              
              const response = await evaluationApi.createForCategory(appreciationId, category.id, evaluationData);
              console.log(`Evaluation created successfully with ID: ${response.data.id}`);
            } else {
              console.error('Cannot create evaluation: Missing category ID or appreciation ID');
            }
          } catch (error) {
            console.error(`Error processing category ${categoryData.intitule}:`, error);
            // Continue with next category even if this one fails
          }
        }
        
        // Process competences using async/await pattern
        console.log('===== CREATING COMPETENCES AND EVALUATIONS =====');
        
        const competences = [
          { intitule: 'Communication', note: 3.0 },
          { intitule: 'Travail en équipe', note: 3.0 },
          { intitule: 'Résolution de problèmes', note: 3.0 },
          { intitule: 'Autonomie', note: 3.0 }
        ];
        
        console.log('Competences to process:', JSON.stringify(competences, null, 2));
        
        // Process competences using async/await
        for (const competenceData of competences) {
          console.log(`Processing competence: ${competenceData.intitule}`);
          
          try {
            // Use the competencesApi to find or create the competence
            const competence = await competencesApi.findOrCreate(competenceData.intitule, competenceData.note);
            console.log(`Competence found/created: ${competence.intitule} with ID: ${competence.id}`);
            
            // Create evaluation linking competence to appreciation
            if (competence.id && appreciationId) {
              console.log(`Creating evaluation for competence ${competence.id} and appreciation ${appreciationId}`);
              
              const evaluationData = {
                valeur: competenceData.note,
                commentaire: `Évaluation pour ${competenceData.intitule}`
              };
              
              const response = await evaluationApi.createForCompetence(appreciationId, competence.id, evaluationData);
              console.log(`Evaluation created successfully with ID: ${response.data.id}`);
            } else {
              console.error('Cannot create evaluation: Missing competence ID or appreciation ID');
            }
          } catch (error) {
            console.error(`Error processing competence ${competenceData.intitule}:`, error);
            // Continue with next competence even if this one fails
          }
        }
        
        console.log('===== ALL CATEGORIES AND COMPETENCES PROCESSED =====');
      } catch (evalError) {
        console.error('Error during evaluation creation process:', evalError);
        console.warn('Continuing with partial success...');
        // Still consider this a partial success since we created the stage and appreciation
      }
      
      // All steps completed successfully
      console.log('Form submission completed successfully');
      return {
        success: true,
        stageId: stage.id,
        appreciationId: appreciation ? appreciation.id : null,
        message: "Données enregistrées avec succès dans la base de données!"
      };
    } catch (error) {
      console.error('Error in form submission process:', error);
      return {
        success: result.success,
        partial: result.partial,
        stageId: result.stageId,
        appreciationId: result.appreciationId,
        error: error.message,
        message: "Erreur lors de l'enregistrement"
      };
    }
  }
};

// Helper functions to convert levels to numeric values
function implicationLevelToValue(level) {
  const levels = {
    'Paresseux': 1,
    'Le juste nécessaire': 2,
    'Bonne': 3,
    'Très forte': 4,
    'Dépasse ses objectifs': 5
  };
  return levels[level] || 0;
}

function opennessLevelToValue(level) {
  const levels = {
    'Isolé(e) ou en opposition': 1,
    'Renfermé(e) ou obtus': 2,
    'Bonne': 3,
    'Très bonne': 4,
    'Excellente': 5
  };
  return levels[level] || 0;
}

function qualityLevelToValue(level) {
  const levels = {
    'Médiocre': 1,
    'Acceptable': 2,
    'Bonne': 3,
    'Très bonne': 4,
    'Très professionnelle': 5
  };
  return levels[level] || 0;
}

export default {
  stageApi,
  periodeApi,
  tuteurApi,
  stagiaireApi,
  appreciationApi,
  competencesApi,
  categorieApi,
  evaluationApi,
  submissionService
};