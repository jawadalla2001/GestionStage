import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Create axios instance with base configuration
// Add request/response interceptors for debugging
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for slow connections
  timeout: 10000
});

// Vérificateur d'état de l'API
export const apiHealthCheck = {
  // Vérifier si l'API est accessible
  isBackendAvailable: async () => {
    try {
      // Tenter une requête simple pour vérifier si le backend répond
      const response = await apiClient.get('/');
      console.log('Backend health check successful', response.status);
      return true;
    } catch (error) {
      if (error.response) {
        // Si on reçoit une réponse, même une erreur 404, c'est que le backend est joignable
        console.log('Backend accessible mais endpoint de test non trouvé');
        return true;
      }
      console.error('Backend health check failed', error);
      return false;
    }
  },
  
  // Vérifier si une entité spécifique est accessible
  canAccessEndpoint: async (endpoint) => {
    try {
      const response = await apiClient.get(endpoint);
      return { success: true, status: response.status };
    } catch (error) {
      if (error.response) {
        // Si on reçoit une erreur HTTP, l'endpoint est techniquement accessible
        return { 
          success: false, 
          status: error.response.status,
          message: error.response.data?.message || 'Endpoint inaccessible'
        };
      }
      return { 
        success: false, 
        status: 0,
        message: 'Impossible de contacter le serveur'
      };
    }
  },
  
  // Exécuter une série de vérifications avant une opération importante
  validateBackendConnection: async () => {
    const isAvailable = await apiHealthCheck.isBackendAvailable();
    if (!isAvailable) {
      return {
        success: false,
        message: 'Le serveur backend est inaccessible. Vérifiez votre connexion réseau ou contactez l\'administrateur.'
      };
    }
    
    // Vérifier les principaux endpoints utilisés
    const endpoints = [
      '/stages',
      '/stagiaires',
      '/tuteurs',
      '/periodes',
      '/appreciations',
      '/evaluations',
      '/competences',
      '/categories'
    ];
    
    const results = {};
    let allSuccess = true;
    
    for (const endpoint of endpoints) {
      const check = await apiHealthCheck.canAccessEndpoint(endpoint);
      results[endpoint] = check;
      if (!check.success && check.status !== 404) {
        // Le 404 est acceptable car peut-être qu'aucune entité n'existe encore
        allSuccess = false;
      }
    }
    
    return {
      success: allSuccess,
      results,
      message: allSuccess 
        ? 'Tous les endpoints sont accessibles'
        : 'Certains endpoints sont inaccessibles, vérifiez la configuration'
    };
  }
};

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
  async error => {
    console.error('API Error:', error);
    
    const originalRequest = error.config;
    
    // Ajouter un compteur de tentatives pour éviter les boucles infinies
    if (!originalRequest._retry) {
      if (error.response) {
        // Server responded with an error status
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
        
        // Gestion des erreurs 500 - on peut retenter une fois
        if (error.response.status === 500 && !originalRequest._retry) {
          console.log('Tentative de nouvel essai après erreur 500...');
          originalRequest._retry = true;
          
          // Attendre un peu avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Réessayer la requête
          return apiClient(originalRequest);
        }
        
        // Gestion des erreurs 404 pour certains endpoints qui ont des chemins alternatifs
        if (error.response.status === 404) {
          const url = originalRequest.url;
          
          // Si c'est une requête GET pour un élément par intitulé, on peut essayer de créer
          if (url.includes('/intitule/') && originalRequest.method === 'get') {
            console.log('Entité non trouvée, possibilité de la créer ensuite');
          }
          
          // Si on cherche à lier des entités via un endpoint dédié mais il n'existe pas
          if ((url.includes('/appreciation/') || url.includes('/evaluation/')) && 
              !originalRequest._triedAlternative) {
            console.log('Endpoint spécifique non trouvé, sera géré par le code appelant');
          }
        }
      } else if (error.request) {
        // Request was made but no response received - possible network error
        console.error('No Response Received:', error.request);
        
        // On peut réessayer une fois en cas d'erreur réseau
        if (!originalRequest._networkRetry) {
          console.log('Tentative de nouvel essai après échec réseau...');
          originalRequest._networkRetry = true;
          
          // Attendre un peu plus longtemps pour les erreurs réseau
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Réessayer la requête
          return apiClient(originalRequest);
        }
      } else {
        // Request setup failed
        console.error('Request Setup Error:', error.message);
      }
    } else {
      console.error('La requête a déjà été retentée une fois, abandon.');
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
  createWithIds: (stageData, stagiaireId) => {
    // Use the minimal format expected by JPA/Hibernate
    const data = {
      ...stageData,
      stagiaires: [{ id: stagiaireId }]
    };
    
    console.log('Creating stage with minimal ID references:', JSON.stringify(data, null, 2));
    return apiClient.post('/stages', data);
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
  
  // Create new period with proper relationships
  create: (periodeData) => apiClient.post('/periodes', periodeData),
  
  // Create new period for a stage - include stagiaire_id explicitly
  createForStage: (stageId, stagiaireId, periodeData) => {
    // Vérifier si les IDs sont valides
    if (!stageId || !stagiaireId) {
      console.error('createForStage: stageId ou stagiaireId manquant');
      return Promise.reject(new Error('Stage ID et Stagiaire ID sont requis'));
    }
    
    // Inclure stagiaireId comme objet pour JPA
    const completeData = {
      ...periodeData,
      stage: { id: stageId },
      stagiaire: { id: stagiaireId }
    };
    
    // Utiliser l'endpoint principal avec toutes les relations
    console.log('Création période avec données complètes:', completeData);
    return apiClient.post('/periodes', completeData);
  },
  
  // Create new period with all relationships explicitly specified
  createComplete: (stageId, stagiaireId, periodeData) => {
    const completeData = {
      ...periodeData,
      stage: { id: stageId },
      stagiaire: { id: stagiaireId }
    };
    return apiClient.post('/periodes', completeData);
  },
  
  // Update period
  update: (id, periodeData) => apiClient.put(`/periodes/${id}`, periodeData),
  
  // Associate a tutor with a period - try different endpoint formats
  addTuteur: (periodeId, tuteurId) => {
    // Vérifier si les IDs sont valides
    if (!periodeId || !tuteurId) {
      console.error('addTuteur: periodeId ou tuteurId manquant');
      return Promise.reject(new Error('Periode ID et Tuteur ID sont requis'));
    }
    
    console.log(`Tentative d'association tuteur ${tuteurId} à période ${periodeId}`);
    
    // Essayer plusieurs approches en séquence
    return new Promise((resolve, reject) => {
      // Approche 1: PUT à l'endpoint dédié
      apiClient.put(`/periodes/${periodeId}/tuteur/${tuteurId}`)
        .then(response => {
          console.log('Association réussie via PUT /periodes/{id}/tuteur/{id}');
          resolve(response);
        })
        .catch(error1 => {
          console.error('Échec méthode PUT, tentative avec POST:', error1);
          
          // Approche 2: POST à l'endpoint dédié (si PUT n'est pas accepté)
          apiClient.post(`/periodes/${periodeId}/tuteur/${tuteurId}`)
            .then(response => {
              console.log('Association réussie via POST /periodes/{id}/tuteur/{id}');
              resolve(response);
            })
            .catch(error2 => {
              console.error('Échec méthode POST, tentative mise à jour complète:', error2);
              
              // Approche 3: Mettre à jour l'objet période entier
              apiClient.get(`/periodes/${periodeId}`)
                .then(periodeResponse => {
                  const periodeActuelle = periodeResponse.data;
                  const periodeUpdated = {
                    ...periodeActuelle,
                    tuteur: { id: tuteurId }
                  };
                  
                  return apiClient.put(`/periodes/${periodeId}`, periodeUpdated);
                })
                .then(response => {
                  console.log('Association réussie via mise à jour complète');
                  resolve(response);
                })
                .catch(error3 => {
                  console.error('Toutes les tentatives ont échoué:', error3);
                  reject(error3);
                });
            });
        });
    });
  },
  
  // Alternative method to associate tutor with period
  addTuteurAlt: (periodeId, tuteurId) => {
    // Récupérer d'abord la période
    return apiClient.get(`/periodes/${periodeId}`)
      .then(response => {
        const periode = response.data;
        // Mettre à jour avec le tuteur
        return apiClient.put(`/periodes/${periodeId}`, { 
          ...periode,
          tuteur: { id: tuteurId } 
        });
      });
  },
  
  // Get all periods associated with a tutor
  getByTuteur: (tuteurId) => apiClient.get(`/periodes/tuteur/${tuteurId}`),
};

// Tuteur (Tutor) API
export const tuteurApi = {
  // Get all tutors
  getAll: () => apiClient.get('/tuteurs'),
  
  // Get tutor by ID
  getById: (id) => apiClient.get(`/tuteurs/${id}`),
  
  // Create new tutor
  create: (tuteurData) => apiClient.post('/tuteurs', tuteurData),
  
  // Find or create a tutor by email with unique email generation
  findOrCreate: async (tuteurData) => {
    // Generate a more unique email with timestamp to avoid conflicts
    const timestamp = new Date().getTime();
    const baseEmail = `${tuteurData.nom.toLowerCase()}.${
      tuteurData.prenom ? tuteurData.prenom.toLowerCase() : 'x'
    }`;
    const uniqueEmail = `${baseEmail}-${timestamp}@${tuteurData.entreprise.toLowerCase().replace(/\s/g, '')}.com`;
    
    try {
      console.log(`Checking if tuteur exists with name: ${tuteurData.nom} ${tuteurData.prenom}`);
      
      // Try to find by exact email first
      let existingTuteur = null;
      try {
        const exactEmailResponse = await apiClient.get(`/tuteurs/email/${tuteurData.email}`);
        existingTuteur = exactEmailResponse.data;
        console.log('Found existing tuteur by exact email:', existingTuteur);
      } catch (emailError) {
        if (emailError.response && emailError.response.status === 404) {
          // Try to find by name and company if implemented
          try {
            // Alternative: try to find by name and company if implemented
            // const response = await apiClient.get(`/tuteurs/search?nom=${tuteurData.nom}&prenom=${tuteurData.prenom}&entreprise=${tuteurData.entreprise}`);
            // existingTuteur = response.data;
            console.log('No tuteur found with this email, will create new');
          } catch (error) {
            console.log('No tuteur found with these criteria, will create new');
          }
        } else {
          throw emailError; 
        }
      }
      
      if (existingTuteur) {
        return existingTuteur;
      }
      
      // If not found, create new tutor with unique email
      const dataToCreate = {
        ...tuteurData,
        email: uniqueEmail
      };
      
      console.log('Creating new tuteur with data:', dataToCreate);
      const createResponse = await apiClient.post('/tuteurs', dataToCreate);
      return createResponse.data;
    } catch (error) {
      console.error('Error in findOrCreate tuteur:', error);
      
      // If creation failed due to duplicate email, try with an even more unique email
      if (error.response && error.response.status === 500 && 
          error.response.data && 
          error.response.data.message &&
          error.response.data.message.includes('Duplicate')) {
        
        console.log('Duplicate email detected, retrying with more unique email');
        const veryUniqueEmail = `${baseEmail}-${timestamp}-${Math.random().toString(36).substring(2, 8)}@${tuteurData.entreprise.toLowerCase().replace(/\s/g, '')}.com`;
        
        const retryData = {
          ...tuteurData,
          email: veryUniqueEmail
        };
        
        try {
          const retryResponse = await apiClient.post('/tuteurs', retryData);
          return retryResponse.data;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          throw retryError;
        }
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
  
  // Get by email or null if not found
  getByEmail: async (email) => {
    try {
      const response = await apiClient.get(`/stagiaires/email/${email}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },
  
  // Find or create an intern by email with retry logic and unique email generation
  findOrCreate: async (stagiaireData) => {
    // Generate a more unique email with timestamp to avoid conflicts
    const timestamp = new Date().getTime();
    const baseEmail = `${stagiaireData.nom.toLowerCase()}.${
      stagiaireData.prenom ? stagiaireData.prenom.toLowerCase() : 'x'
    }`;
    const uniqueEmail = `${baseEmail}-${timestamp}@example.com`;
    
    try {
      console.log(`Checking if stagiaire exists with name: ${stagiaireData.nom} ${stagiaireData.prenom}`);
      
      // Try to find by exact email first
      let existingStagiaire = null;
      try {
        const exactEmailResponse = await apiClient.get(`/stagiaires/email/${stagiaireData.email}`);
        existingStagiaire = exactEmailResponse.data;
        console.log('Found existing stagiaire by exact email:', existingStagiaire);
      } catch (emailError) {
        if (emailError.response && emailError.response.status === 404) {
          // Try to find by name
          try {
            // Alternative: try to find by name if implemented on backend
            // const nameResponse = await apiClient.get(`/stagiaires/search?nom=${stagiaireData.nom}&prenom=${stagiaireData.prenom}`);
            // existingStagiaire = nameResponse.data;
            console.log('No stagiaire found with this email, will create new');
          } catch (nameError) {
            console.log('No stagiaire found with this name, will create new');
          }
        } else {
          throw emailError;
        }
      }
      
      if (existingStagiaire) {
        return existingStagiaire;
      }
      
      // If not found, create new intern with unique email
      const dataToCreate = {
        ...stagiaireData,
        email: uniqueEmail
      };
      
      console.log('Creating new stagiaire with data:', dataToCreate);
      const createResponse = await apiClient.post('/stagiaires', dataToCreate);
      return createResponse.data;
    } catch (error) {
      console.error('Error in findOrCreate stagiaire:', error);
      
      // If creation failed due to duplicate email, try with an even more unique email
      if (error.response && error.response.status === 500 && 
          error.response.data && 
          error.response.data.message &&
          error.response.data.message.includes('Duplicate')) {
        
        console.log('Duplicate email detected, retrying with more unique email');
        const veryUniqueEmail = `${baseEmail}-${timestamp}-${Math.random().toString(36).substring(2, 8)}@example.com`;
        
        const retryData = {
          ...stagiaireData,
          email: veryUniqueEmail
        };
        
        try {
          const retryResponse = await apiClient.post('/stagiaires', retryData);
          return retryResponse.data;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          throw retryError;
        }
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
  
  // Create new appreciation
  create: (appreciationData) => apiClient.post('/appreciations', appreciationData),
  
  // Create new appreciation for a tutor
  createForTuteur: (tuteurId, appreciationData) => {
    // Filtrer pour ne garder que les champs valides
    const filteredData = {};
    // Ajouter le tuteur
    filteredData.tuteur = { id: tuteurId };
    
    return apiClient.post('/appreciations', filteredData);
  },
  
  // Create new appreciation for a tutor using the explicit endpoint
  createForTuteurExplicit: (tuteurId) => 
    apiClient.post(`/appreciations/tuteur/${tuteurId}`, {}),
  
  // Create new appreciation with all relationships
  createComplete: (tuteurId, periodeId) => {
    const data = {
      tuteur: { id: tuteurId },
      periode: { id: periodeId }
    };
    return apiClient.post('/appreciations', data);
  },
  
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
      // Si la compétence existe mais qu'on veut mettre à jour sa note
      if (note > 0 && response.data.note !== note) {
        // Mettre à jour la note de la compétence existante
        try {
          const updateResponse = await apiClient.put(`/competences/${response.data.id}`, {
            ...response.data,
            note: note
          });
          return updateResponse.data;
        } catch (updateError) {
          console.error(`Failed to update competence note for ${competenceTitle}:`, updateError);
          return response.data;
        }
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Create new competence if not found - with the exact note value
        const createResponse = await apiClient.post('/competences', {
          intitule: competenceTitle,
          note: note // Utiliser la valeur exacte
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
  
  // Create new evaluation
  create: (evaluationData) => apiClient.post('/evaluations', evaluationData),
  
  // Create evaluation for appreciation and category
  createForCategory: (appreciationId, categorieId, evaluationData) => {
    try {
      return apiClient.post(`/evaluations/appreciation/${appreciationId}/categorie/${categorieId}`, evaluationData);
    } catch (err) {
      console.error('Error creating evaluation for category:', err);
      // Essayer une autre approche si la première échoue
      const fullData = {
        ...evaluationData,
        appreciation: { id: appreciationId },
        categorie: { id: categorieId }
      };
      return apiClient.post('/evaluations', fullData);
    }
  },
  
  // Create evaluation for appreciation and competence
  createForCompetence: (appreciationId, competenceId, evaluationData) => {
    try {
      return apiClient.post(`/evaluations/appreciation/${appreciationId}/competences/${competenceId}`, evaluationData);
    } catch (err) {
      console.error('Error creating evaluation for competence:', err);
      // Essayer une autre approche si la première échoue
      const fullData = {
        ...evaluationData,
        appreciation: { id: appreciationId },
        competences: { id: competenceId }
      };
      return apiClient.post('/evaluations', fullData);
    }
  },
  
  // Alternative method for creating evaluations directly
  createDirect: (appreciationId, competenceId, categorieId, evaluationData) => {
    const fullData = {
      ...evaluationData,
      appreciation: { id: appreciationId }
    };
    
    if (competenceId) {
      fullData.competences = { id: competenceId };
    }
    
    if (categorieId) {
      fullData.categorie = { id: categorieId };
    }
    
    return apiClient.post('/evaluations', fullData);
  }
};

// Submission Service - Centralized form submission logic
export const submissionService = {
  submitFormData: async (backendData) => {
    console.log('Submitting complete form data via submissionService:', backendData);
    try {
      // L'URL du endpoint est /stages/create-from-dto
      const response = await apiClient.post('/stages/create-from-dto', backendData);
      console.log('Form data submitted successfully:', response.data);
      return { success: true, data: response.data };
      } catch (error) {
      console.error('Error submitting form data via submissionService:', error.response ? error.response.data : error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Erreur inconnue lors de la soumission.',
        error: error.response?.data || error
      };
    }
  }
};

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