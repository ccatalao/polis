import axios from 'axios';

/**
 * Service to handle OpenStreetMap data retrieval via Overpass API
 * Focused on Palmela, Portugal region
 */
class OverpassService {
  constructor() {
    // Primary and backup endpoints
    this.endpoints = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
    ];
    this.currentEndpoint = 0; // Index of the current endpoint
  }

  /**
   * Get the current working endpoint
   * @returns {string} The current endpoint URL
   */
  _getEndpoint() {
    return this.endpoints[this.currentEndpoint];
  }

  /**
   * Switch to the next endpoint if the current one fails
   */
  _switchEndpoint() {
    this.currentEndpoint = (this.currentEndpoint + 1) % this.endpoints.length;
    console.info(`Switching to endpoint: ${this._getEndpoint()}`);
  }

  /**
   * Generate a cache key based on query type
   * @param {string} queryType - Type of query for caching (e.g., "schools", "parks")
   * @returns {string} Cache key
   */
  _getCacheKey(queryType) {
    return `palmela_${queryType}_cache`;
  }

  /**
   * Save data to local storage cache
   * @param {object} data - Data to cache
   * @param {string} queryType - Type of query for caching
   */
  _saveToCache(data, queryType) {
    const cacheKey = this._getCacheKey(queryType);
    const cacheItem = {
      data,
      timestamp: new Date().getTime()
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      console.info(`Saved data to cache: ${cacheKey}`);
    } catch (error) {
      console.error(`Error saving to cache: ${error}`);
    }
  }

  /**
   * Load data from local storage cache if available and not too old
   * @param {string} queryType - Type of query for caching
   * @param {number} maxAgeHours - Maximum age of cache in hours
   * @returns {object|null} Cached data or null
   */
  _loadFromCache(queryType, maxAgeHours = 24) {
    const cacheKey = this._getCacheKey(queryType);
    
    try {
      const cacheItem = localStorage.getItem(cacheKey);
      
      if (!cacheItem) {
        return null;
      }
      
      const { data, timestamp } = JSON.parse(cacheItem);
      const ageHours = (new Date().getTime() - timestamp) / (1000 * 60 * 60);
      
      if (ageHours > maxAgeHours) {
        console.info(`Cache too old (${ageHours.toFixed(1)} hours)`);
        return null;
      }
      
      console.info(`Loaded data from cache: ${cacheKey}`);
      return data;
    } catch (error) {
      console.error(`Error loading from cache: ${error}`);
      return null;
    }
  }

  /**
   * Query the Overpass API with retry and caching logic
   * @param {string} query - The Overpass QL query
   * @param {string} queryType - Type of query for caching
   * @param {boolean} forceRefresh - Whether to force a refresh from the API
   * @returns {Promise<object>} The JSON response from Overpass
   */
  async queryOverpass(query, queryType, forceRefresh = false) {
    // Try to load from cache first
    if (!forceRefresh) {
      const cachedData = this._loadFromCache(queryType);
      if (cachedData) {
        return cachedData;
      }
    }
    
    // Prepare the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'PalmelaThematicMapsApp/1.0'
    };
    
    // Try each endpoint with retries
    const maxRetries = 3;
    let retryDelay = 2000; // Initial delay in milliseconds
    
    for (let attempt = 0; attempt < maxRetries * this.endpoints.length; attempt++) {
      try {
        const endpoint = this._getEndpoint();
        console.info(`Querying ${endpoint} for ${queryType} data`);
        
        const response = await axios.post(
          endpoint,
          query,
          { 
            headers,
            timeout: 30000 // 30 seconds timeout
          }
        );
        
        if (response.status === 200 && response.data) {
          // Cache the successful response
          this._saveToCache(response.data, queryType);
          return response.data;
        }
      } catch (error) {
        console.error(`Request failed: ${error.message}`);
        
        if (error.response && error.response.status === 429) {
          console.warn("Rate limited, waiting longer before retry");
          await new Promise(resolve => setTimeout(resolve, retryDelay * 5));
        }
      }
      
      // Switch endpoint or increase delay
      if ((attempt + 1) % this.endpoints.length === 0) {
        retryDelay *= 2; // Exponential backoff
      }
      
      this._switchEndpoint();
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    
    console.error("All API endpoints failed after multiple retries");
    return { error: "Failed to fetch data from Overpass API" };
  }

  /**
   * Get all schools in Palmela
   * @returns {Promise<object>} Schools data from Overpass API
   */
  async getSchools() {
    const query = `
      [out:json];
      area["name"="Palmela"]["admin_level"="8"]->.palmelaArea;
      (
        node["amenity"="school"](area.palmelaArea);
        way["amenity"="school"](area.palmelaArea);
        relation["amenity"="school"](area.palmelaArea);
      );
      out body;
      >;
      out skel qt;
    `;
    return this.queryOverpass(query, "schools");
  }

  /**
   * Get historical sites in Palmela
   * @returns {Promise<object>} Historical sites data from Overpass API
   */
  async getHistoricalSites() {
    const query = `
      [out:json];
      area["name"="Palmela"]["admin_level"="8"]->.palmelaArea;
      (
        node["historic"](area.palmelaArea);
        way["historic"](area.palmelaArea);
        relation["historic"](area.palmelaArea);
        
        node["tourism"="museum"](area.palmelaArea);
        way["tourism"="museum"](area.palmelaArea);
        
        node["heritage"](area.palmelaArea);
        way["heritage"](area.palmelaArea);
        relation["heritage"](area.palmelaArea);
      );
      out body;
      >;
      out skel qt;
    `;
    return this.queryOverpass(query, "historical_sites");
  }

  /**
   * Get environmental features in Palmela
   * @returns {Promise<object>} Environmental features data from Overpass API
   */
  async getEnvironmentalFeatures() {
    const query = `
      [out:json];
      area["name"="Palmela"]["admin_level"="8"]->.palmelaArea;
      (
        // Parks and green spaces
        node["leisure"="park"](area.palmelaArea);
        way["leisure"="park"](area.palmelaArea);
        relation["leisure"="park"](area.palmelaArea);
        
        // Nature reserves
        node["leisure"="nature_reserve"](area.palmelaArea);
        way["leisure"="nature_reserve"](area.palmelaArea);
        relation["leisure"="nature_reserve"](area.palmelaArea);
        
        // Forest areas
        way["landuse"="forest"](area.palmelaArea);
        relation["landuse"="forest"](area.palmelaArea);
        
        // Water features
        way["natural"="water"](area.palmelaArea);
        relation["natural"="water"](area.palmelaArea);
      );
      out body;
      >;
      out skel qt;
    `;
    return this.queryOverpass(query, "environmental_features");
  }

  /**
   * Get urban planning elements in Palmela
   * @returns {Promise<object>} Urban elements data from Overpass API
   */
  async getUrbanElements() {
    const query = `
      [out:json];
      area["name"="Palmela"]["admin_level"="8"]->.palmelaArea;
      (
        // Land use
        way["landuse"](area.palmelaArea);
        relation["landuse"](area.palmelaArea);
        
        // Buildings
        way["building"](area.palmelaArea);
        
        // Roads
        way["highway"](area.palmelaArea);
      );
      out body;
      >;
      out skel qt;
    `;
    return this.queryOverpass(query, "urban_elements");
  }

  /**
   * Query features within a bounding box instead of administrative boundary
   * @param {string[]} featureTypes - List of OSM feature types to query, e.g. ["amenity=restaurant"]
   * @param {number} south - South boundary of the bounding box
   * @param {number} west - West boundary of the bounding box
   * @param {number} north - North boundary of the bounding box
   * @param {number} east - East boundary of the bounding box
   * @returns {Promise<object>} Features data from Overpass API
   */
  async getByBoundingBox(featureTypes, south = 38.54, west = -8.92, north = 38.64, east = -8.58) {
    const bbox = `${south},${west},${north},${east}`;
    
    // Build the query from feature types
    const featureQueries = [];
    featureTypes.forEach(feature => {
      if (feature.includes("=")) {
        const [key, value] = feature.split("=");
        featureQueries.push(`node["${key}"="${value}"](${bbox});`);
        featureQueries.push(`way["${key}"="${value}"](${bbox});`);
        featureQueries.push(`relation["${key}"="${value}"](${bbox});`);
      } else {
        featureQueries.push(`node["${feature}"](${bbox});`);
        featureQueries.push(`way["${feature}"](${bbox});`);
        featureQueries.push(`relation["${feature}"](${bbox});`);
      }
    });
    
    const query = `
      [out:json];
      (
        ${featureQueries.join('\n')}
      );
      out body;
      >;
      out skel qt;
    `;
    
    const queryType = `bbox_${featureTypes.join('-').replace(/=/g, '_')}`;
    return this.queryOverpass(query, queryType);
  }

  /**
   * Convert Overpass API data to GeoJSON format
   * @param {object} overpassData - Data from Overpass API
   * @returns {object} GeoJSON FeatureCollection
   */
  convertToGeoJSON(overpassData) {
    // Create basic GeoJSON structure
    const geojson = {
      "type": "FeatureCollection",
      "features": []
    };
    
    if (!overpassData || !overpassData.elements) {
      return geojson;
    }
    
    // First, collect all nodes for way geometry reconstruction
    const nodes = {};
    overpassData.elements.forEach(element => {
      if (element.type === "node") {
        nodes[element.id] = {
          lat: element.lat,
          lon: element.lon
        };
      }
    });
    
    // Process each element
    overpassData.elements.forEach(element => {
      // Only process elements with tags
      if (!element.tags) {
        return;
      }
      
      if (element.type === "node" && element.lat !== undefined && element.lon !== undefined) {
        // Process point features
        geojson.features.push({
          "type": "Feature",
          "id": `node/${element.id}`,
          "properties": {
            ...element.tags,
            "osm_type": "node",
            "osm_id": element.id
          },
          "geometry": {
            "type": "Point",
            "coordinates": [element.lon, element.lat]
          }
        });
      } else if (element.type === "way" && element.nodes) {
        // Try to construct way geometry
        const coordinates = [];
        element.nodes.forEach(nodeId => {
          if (nodes[nodeId]) {
            coordinates.push([nodes[nodeId].lon, nodes[nodeId].lat]);
          }
        });
        
        if (coordinates.length > 0) {
          // Check if it's a closed way (polygon)
          if (coordinates.length > 3 && element.nodes[0] === element.nodes[element.nodes.length - 1]) {
            geojson.features.push({
              "type": "Feature",
              "id": `way/${element.id}`,
              "properties": {
                ...element.tags,
                "osm_type": "way",
                "osm_id": element.id
              },
              "geometry": {
                "type": "Polygon",
                "coordinates": [coordinates]
              }
            });
          } else {
            geojson.features.push({
              "type": "Feature",
              "id": `way/${element.id}`,
              "properties": {
                ...element.tags,
                "osm_type": "way",
                "osm_id": element.id
              },
              "geometry": {
                "type": "LineString",
                "coordinates": coordinates
              }
            });
          }
        }
      }
      // Relations are complex and would need more processing
    });
    
    return geojson;
  }
}

// Create and export a singleton instance
const overpassService = new OverpassService();
export default overpassService; 