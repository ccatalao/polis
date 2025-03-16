/**
 * Utility functions for handling image paths in both local and deployed environments
 */

// Map of image paths to their require statements
const imageMap = {
  // Home images
  '/images/home/municipio.jpeg': require('../../assets/images/home/municipio.jpeg'),
  '/images/home/projects.jpeg': require('../../assets/images/home/projects.jpeg'),
  '/images/home/funding.jpeg': require('../../assets/images/home/funding.jpeg'),
  '/images/home/publicacoes.jpeg': require('../../assets/images/home/publicacoes.jpeg'),
  
  // Projects images
  '/images/projects/cordis.jpeg': require('../../assets/images/projects/cordis.jpeg'),
  '/images/projects/espon.jpeg': require('../../assets/images/projects/espon.jpeg'),
  '/images/projects/jpi-urban.jpeg': require('../../assets/images/projects/jpi-urban.jpeg'),
  '/images/projects/keep-eu.jpeg': require('../../assets/images/projects/keep-eu.jpeg'),
  '/images/projects/uia.jpeg': require('../../assets/images/projects/uia.jpeg'),
  '/images/projects/urbact.jpeg': require('../../assets/images/projects/urbact.jpeg'),
  
  // Funding images
  '/images/funding/bauhaus.jpeg': require('../../assets/images/funding/bauhaus.jpeg'),
  '/images/funding/dut.jpeg': require('../../assets/images/funding/dut.jpeg'),
  '/images/funding/feder.jpeg': require('../../assets/images/funding/feder.jpeg'),
  '/images/funding/interreg.jpeg': require('../../assets/images/funding/interreg.jpeg'),
  '/images/funding/investeu.jpeg': require('../../assets/images/funding/investeu.jpeg'),
  '/images/funding/jtf.jpeg': require('../../assets/images/funding/jtf.jpeg'),
  '/images/funding/life.jpeg': require('../../assets/images/funding/life.jpeg'),
  '/images/funding/rrf.jpeg': require('../../assets/images/funding/rrf.jpeg'),
  '/images/funding/uia.jpeg': require('../../assets/images/funding/uia.jpeg'),
  
  // Publications images - main categories
  '/images/publications/urbanism.jpeg': require('../../assets/images/publications/urbanism.jpeg'),
  '/images/publications/planning.jpeg': require('../../assets/images/publications/planning.jpeg'),
  '/images/publications/architecture.jpeg': require('../../assets/images/publications/architecture.jpeg'),
  
  // Publications images - individual journals
  '/images/publications/articulo.jpeg': require('../../assets/images/publications/articulo.jpeg'),
  '/images/publications/archive.jpeg': require('../../assets/images/publications/archive.jpeg'),
  '/images/publications/buildings.jpeg': require('../../assets/images/publications/buildings.jpeg'),
  '/images/publications/cidades.jpeg': require('../../assets/images/publications/cidades.jpeg'),
  '/images/publications/city-environment-interactions.jpeg': require('../../assets/images/publications/citty-environment-interactions.jpeg'),
  '/images/publications/ciudades.jpeg': require('../../assets/images/publications/ciudades.jpeg'),
  '/images/publications/computational-urban-science.jpeg': require('../../assets/images/publications/computational-urban-science.jpeg'),
  '/images/publications/current-urban-studies.jpeg': require('../../assets/images/publications/current-urban-studies.jpeg'),
  '/images/publications/frontiers-built-environment.jpeg': require('../../assets/images/publications/frontiers-built-environment.jpeg'),
  '/images/publications/future-cities-environment.jpeg': require('../../assets/images/publications/future-cities-environment.jpeg'),
  '/images/publications/smart-cities.jpeg': require('../../assets/images/publications/smart-cities.jpeg'),
  '/images/publications/urban-sustainable.jpeg': require('../../assets/images/publications/urban-sustainable.jpeg'),
  '/images/publications/irspsd.jpeg': require('../../assets/images/publications/irspsd.jpeg'),
  '/images/publications/urban-ecology.jpeg': require('../../assets/images/publications/urban-ecology.jpeg'),
  '/images/publications/urban-management.jpeg': require('../../assets/images/publications/urban-management.jpeg'),
  '/images/publications/urban-mobility.jpeg': require('../../assets/images/publications/urban-mobility.jpeg'),
  '/images/publications/research-urbanism.jpeg': require('../../assets/images/publications/research-urbanism.jpeg'),
  '/images/publications/resilient-cities.jpeg': require('../../assets/images/publications/resilient-cities.jpeg'),
  '/images/publications/smart-construction.jpeg': require('../../assets/images/publications/smart-construction.jpeg'),
  '/images/publications/urban-agriculture.jpeg': require('../../assets/images/publications/urban-agriculture.jpeg'),
  '/images/publications/urban-governance.jpeg': require('../../assets/images/publications/urban-governance.jpeg'),
  '/images/publications/urban-lifeline.jpeg': require('../../assets/images/publications/urban-lifeline.jpeg'),
  '/images/publications/urban-planning.jpeg': require('../../assets/images/publications/urban-planning.jpeg'),
  '/images/publications/urban-planning-transport.jpeg': require('../../assets/images/publications/urban-planning-transport.jpeg'),
  '/images/publications/urban-science.jpeg': require('../../assets/images/publications/urban-science.jpeg'),
  '/images/publications/urban-transcripts.jpeg': require('../../assets/images/publications/urban-transcripts.jpeg'),
  '/images/publications/urban-transformations.jpeg': require('../../assets/images/publications/urban-transformations.jpeg'),
  '/images/publications/urbana.jpeg': require('../../assets/images/publications/urbana.jpeg'),
  '/images/publications/urbe.jpeg': require('../../assets/images/publications/urbe.jpeg'),
  '/images/publications/blue-green-systems.jpeg': require('../../assets/images/publications/blue-green-systems.jpeg'),
  '/images/publications/creative-practices.jpeg': require('../../assets/images/publications/creative-practices.jpeg'),
  '/images/publications/spatial-development.jpeg': require('../../assets/images/publications/spatial-development.jpeg'),
  '/images/publications/finisterra.jpeg': require('../../assets/images/publications/finisterra.jpeg'),
  '/images/publications/urban-rural-planning.jpeg': require('../../assets/images/publications/urban-rural-planning.jpeg'),
  '/images/publications/regional-development.jpeg': require('../../assets/images/publications/regional-development.jpeg'),
  '/images/publications/public-space.jpeg': require('../../assets/images/publications/public-space.jpeg'),
  '/images/publications/public-transportation.jpeg': require('../../assets/images/publications/public-transportation.jpeg'),
  '/images/publications/spatial-information.jpeg': require('../../assets/images/publications/spatial-information.jpeg'),
  '/images/publications/planext.jpeg': require('../../assets/images/publications/planext.jpeg'),
  '/images/publications/regional-practice.jpeg': require('../../assets/images/publications/regional-practice.jpeg'),
  '/images/publications/regional-studies.jpeg': require('../../assets/images/publications/regional-studies.jpeg'),
  '/images/publications/scienze-territorio.jpeg': require('../../assets/images/publications/scienze-territorio.jpeg'),
  '/images/publications/tema.jpeg': require('../../assets/images/publications/tema.jpeg'),
  '/images/publications/territorial-identity.jpeg': require('../../assets/images/publications/territorial-identity.jpeg'),
  '/images/publications/architecture-mps.jpeg': require('../../assets/images/publications/architecture-mps.jpeg'),
  '/images/publications/mps.jpeg': require('../../assets/images/publications/mps.jpeg'),
  '/images/publications/agathon.jpeg': require('../../assets/images/publications/agathon.jpeg'),
  '/images/publications/arte-publica.jpeg': require('../../assets/images/publications/arte-publica.jpeg'),
  '/images/publications/docomomo.jpeg': require('../../assets/images/publications/docomomo.jpeg'),
  '/images/publications/enq.jpeg': require('../../assets/images/publications/enq.jpeg'),
  '/images/publications/estudo-previo.jpeg': require('../../assets/images/publications/estudo-previo.jpeg'),
  '/images/publications/field.jpeg': require('../../assets/images/publications/field.jpeg'),
  '/images/publications/architecture-urbanism.jpeg': require('../../assets/images/publications/architecture-urbanism.jpeg'),
  '/images/publications/revista-arquitectura.jpeg': require('../../assets/images/publications/revista-arquitectura.jpeg')
};

// Check if we're running in a web environment
const isWeb = typeof window !== 'undefined' && window.navigator && window.navigator.product === 'Gecko';

// Add debugging information
if (isWeb) {
  console.log('Running in web environment');
  if (window.location.href.includes('github.io')) {
    console.log('GitHub Pages detected:', window.location.href);
  }
}

/**
 * Gets the correct image path based on the environment (local or deployed)
 * @param {string|object} imagePath - The image path or object with image paths
 * @returns {any} - The required image module or path
 */
export const getImagePath = (imagePath) => {
  if (!imagePath) return null;
  
  // If imagePath is an object with webp and fallback properties
  if (typeof imagePath === 'object') {
    const path = imagePath.fallback || imagePath.webp;
    return processImagePath(path);
  }
  
  // For string paths
  return processImagePath(imagePath);
};

/**
 * Process an image path to return the correct format based on environment
 * @param {string} path - The image path
 * @returns {any} - The processed image path
 */
const processImagePath = (path) => {
  try {
    // Normalize the path to start with /images/
    let normalizedPath = path;
    
    // Convert ./images to /images for consistency
    if (normalizedPath.startsWith('./images/')) {
      normalizedPath = normalizedPath.replace(/^\.\//, '/');
    }
    
    // For web environment in production (GitHub Pages)
    if (isWeb && window.location.href.includes('github.io')) {
      // Extract the parts of the path
      const pathParts = normalizedPath.split('/');
      if (pathParts.length >= 4) {
        const category = pathParts[2]; // e.g., 'funding', 'projects', 'publications'
        const filename = pathParts[3]; // e.g., 'dut.jpeg', 'cordis.jpeg'
        
        // Hardcoded paths for each category to ensure they work
        if (category === 'funding') {
          return `https://ccatalao.github.io/polis/assets/images/funding/${filename}`;
        } else if (category === 'projects') {
          return `https://ccatalao.github.io/polis/assets/images/projects/${filename}`;
        } else if (category === 'publications') {
          return `https://ccatalao.github.io/polis/assets/images/publications/${filename}`;
        } else if (category === 'home') {
          return `https://ccatalao.github.io/polis/assets/images/home/${filename}`;
        }
      }
      
      // Fallback to a direct path
      console.log('Using direct GitHub Pages path:', normalizedPath);
      return `https://ccatalao.github.io/polis/assets${normalizedPath}`;
    }
    
    // For native environment or local web development
    if (imageMap[normalizedPath]) {
      return imageMap[normalizedPath];
    }
    
    // For paths not in our map, return as is (might be a URL)
    console.log('Using path as is:', path);
    return path;
  } catch (error) {
    console.error(`Error loading image: ${path}`, error);
    return null;
  }
};

/**
 * Creates a mapping of image IDs to their paths
 * @param {string} category - The category of images (e.g., 'funding', 'projects')
 * @param {Array} items - The array of items with IDs
 * @returns {Object} - A mapping of IDs to image paths
 */
export const createImageMapping = (category, items) => {
  const mapping = {};
  
  items.forEach(item => {
    if (item.id) {
      mapping[item.id] = getImagePath(`/images/${category}/${item.id}.jpeg`);
    }
  });
  
  return mapping;
}; 