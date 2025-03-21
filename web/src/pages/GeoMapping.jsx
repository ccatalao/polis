import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import overpassService from '../services/OverpassService';
import '../main.css';
import '../styles/map.css';

// Feature types with user-friendly names
const featureTypes = [
  { id: 'schools', name: 'Escolas', icon: '🏫' },
  { id: 'historical_sites', name: 'Locais Históricos', icon: '🏛️' },
  { id: 'environmental_features', name: 'Ambiente', icon: '🌳' },
  { id: 'urban_elements', name: 'Elementos Urbanos', icon: '🏙️' },
  { id: 'wineries', name: 'Adegas', icon: '🍷', custom: ['craft=winery', 'amenity=winery'] }
];

// Legend items for map features
const legendItems = [
  { color: '#ff0000', label: 'Escolas' },
  { color: '#995500', label: 'Locais Históricos' },
  { color: '#00aa00', label: 'Parques e Florestas' },
  { color: '#0099ff', label: 'Água' },
  { color: '#999999', label: 'Edifícios' },
  { color: '#ff7800', label: 'Pontos de Interesse' }
];

const GeoMapping = () => {
  const [selectedFeatureType, setSelectedFeatureType] = useState('schools');
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [mapStyle, setMapStyle] = useState('streets');
  
  // Handle resize events for mobile responsiveness
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
    
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMounted(false);
        setTimeout(() => setMounted(true), 50);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);
  
  // Fetch data when the selected feature type changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setSelectedFeature(null);
      
      try {
        let data;
        const featureTypeInfo = featureTypes.find(f => f.id === selectedFeatureType);
        
        if (featureTypeInfo.custom) {
          // Handle custom feature types with bounding box queries
          data = await overpassService.getByBoundingBox(featureTypeInfo.custom);
        } else {
          // Handle standard feature types
          switch (selectedFeatureType) {
            case 'schools':
              data = await overpassService.getSchools();
              break;
            case 'historical_sites':
              data = await overpassService.getHistoricalSites();
              break;
            case 'environmental_features':
              data = await overpassService.getEnvironmentalFeatures();
              break;
            case 'urban_elements':
              data = await overpassService.getUrbanElements();
              break;
            default:
              data = await overpassService.getSchools();
          }
        }
        
        // Convert Overpass data to GeoJSON
        const geoJson = overpassService.convertToGeoJSON(data);
        setGeojsonData(geoJson);
        
        console.log(`Loaded ${geoJson.features.length} features for ${selectedFeatureType}`);
      } catch (error) {
        console.error(`Error fetching ${selectedFeatureType} data:`, error);
        setError(`Failed to load ${selectedFeatureType} data. Please try again.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedFeatureType]);
  
  // Handle feature selection change
  const handleFeatureTypeChange = (event) => {
    setSelectedFeatureType(event.target.value);
  };
  
  // Enhanced feature click handler
  const handleFeatureClick = (feature, event) => {
    console.log('Feature clicked:', feature);
    setSelectedFeature(feature);
    
    // You can customize additional behavior here
    // For example, zoom to the feature or highlight it
  };
  
  // Find the selected feature type object
  const activeFeatureType = featureTypes.find(f => f.id === selectedFeatureType);
  
  // Function to get a user-friendly name for a property key
  const getPropertyLabel = (key) => {
    const labelMap = {
      'name': 'Nome',
      'amenity': 'Tipo',
      'historic': 'Tipo Histórico',
      'tourism': 'Turismo',
      'leisure': 'Lazer',
      'natural': 'Tipo Natural',
      'building': 'Edifício',
      'addr:street': 'Rua',
      'addr:housenumber': 'Número',
      'addr:postcode': 'Código Postal',
      'addr:city': 'Cidade',
      'opening_hours': 'Horário de Funcionamento',
      'phone': 'Telefone',
      'website': 'Website',
      'description': 'Descrição',
      'operator': 'Operador',
      'access': 'Acesso',
      'capacity': 'Capacidade',
      'heritage': 'Património',
      'start_date': 'Data de Início',
      'ele': 'Elevação',
      'layer': 'Camada',
      'craft': 'Artesanato',
      'landuse': 'Uso da Terra',
      'height': 'Altura',
      'denomination': 'Denominação',
      'religion': 'Religião'
    };
    
    return labelMap[key] || key;
  };
  
  return (
    <div className="full-width-container">
      <div className="title-container">
        <h1 className="card-title">Mapeamento Geográfico de Palmela</h1>
      </div>
      
      <div className="introduction full-width">
        <div className="intro-content">
          <p>
            Explore os dados geográficos do município de Palmela através de mapas interativos.
            Selecione diferentes conjuntos de dados para visualizar no mapa.
          </p>
          
          <div className="feature-selector">
            <label htmlFor="feature-select">Selecionar dados a exibir: </label>
            <select 
              id="feature-select" 
              value={selectedFeatureType}
              onChange={handleFeatureTypeChange}
              className="feature-select"
            >
              {featureTypes.map(feature => (
                <option key={feature.id} value={feature.id}>
                  {feature.icon} {feature.name}
                </option>
              ))}
            </select>
            
            <label htmlFor="map-style-select" style={{ marginLeft: '20px' }}>Estilo do mapa: </label>
            <select 
              id="map-style-select" 
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="feature-select"
            >
              <option value="streets">Normal</option>
              <option value="satellite">Satélite</option>
              <option value="terrain">Terreno</option>
              <option value="dark">Escuro</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="full-width map-container">
        <div className="intro-content">
          <h2 className="section-title">
            {activeFeatureType.icon} {activeFeatureType.name} {geojsonData && !loading ? `(${geojsonData.features.length})` : ''}
          </h2>
          
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>A carregar dados de {activeFeatureType.name}...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setSelectedFeatureType(selectedFeatureType)}>
                Tentar novamente
              </button>
            </div>
          )}
          
          <div className="map-wrapper">
            <MapComponent 
              geojsonData={geojsonData}
              onFeatureClick={handleFeatureClick}
              center={[38.569, -8.8]} // Palmela coordinates
              zoom={12}
              height="600px"
              mapStyle={mapStyle}
            />
            
            {selectedFeature && (
              <div className="feature-details-panel">
                <h3 className="feature-detail-title">
                  {selectedFeature.properties.name || 'Elemento Selecionado'}
                </h3>
                <div className="feature-properties">
                  {Object.entries(selectedFeature.properties)
                    .filter(([key]) => !key.startsWith('osm_') && key !== 'id')
                    .map(([key, value]) => (
                      <div key={key} className="feature-property-item">
                        <span className="property-label">{getPropertyLabel(key)}:</span>
                        <span className="property-value">
                          {typeof value === 'string' && value.startsWith('http') 
                            ? <a href={value} target="_blank" rel="noreferrer">{value}</a> 
                            : value}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="feature-actions">
                  <button 
                    className="close-panel-btn" 
                    onClick={() => setSelectedFeature(null)}
                  >
                    Fechar
                  </button>
                  {selectedFeature.properties.osm_id && (
                    <a 
                      href={`https://www.openstreetmap.org/${selectedFeature.properties.osm_type}/${selectedFeature.properties.osm_id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="view-osm-btn"
                    >
                      Ver no OpenStreetMap
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="data-info">
            <p>
              {geojsonData && `${geojsonData.features.length} elementos encontrados.`}
              Os dados são obtidos do OpenStreetMap através da API Overpass.
            </p>
            <p className="data-attribution">
              © Contribuidores do <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoMapping; 