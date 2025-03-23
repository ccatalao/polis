import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import overpassService from '../services/OverpassService';
import '../styles/main.css';
import '../styles/map.css';
import { highlightSearchTerm } from '../utils/search';

// Feature types with user-friendly names
const featureTypes = [
  { id: 'schools', name: 'Escolas', icon: '🏫' },
  { id: 'historical_sites', name: 'Locais Históricos', icon: '🏛️' },
  { id: 'environmental_features', name: 'Ambiente', icon: '🌳' },
  { id: 'urban_elements', name: 'Elementos Urbanos', icon: '🏙️' },
  { id: 'wineries', name: 'Adegas', icon: '🍷', custom: ['craft=winery', 'amenity=winery'] },
  { id: 'transport_hubs', name: 'Transportes', icon: '🚌' },
  { id: 'healthcare_facilities', name: 'Saúde', icon: '🏥' },
  { id: 'commercial_areas', name: 'Comércio', icon: '🏬' }
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
  const [activeFilters, setActiveFilters] = useState({});
  
  // Define filter options for each feature type
  const filterOptions = {
    schools: [
      { id: 'primary', label: 'Primária', property: 'isced', value: '1' },
      { id: 'secondary', label: 'Secundária', property: 'isced', value: '2,3' }
    ],
    historical_sites: [
      { id: 'castle', label: 'Castelo', property: 'historic', value: 'castle' },
      { id: 'monument', label: 'Monumento', property: 'historic', value: 'monument' },
      { id: 'ruins', label: 'Ruínas', property: 'historic', value: 'ruins' },
      { id: 'archaeological', label: 'Arqueológico', property: 'historic', value: 'archaeological_site' }
    ],
    environmental_features: [
      { id: 'park', label: 'Parques', property: 'leisure', value: 'park' },
      { id: 'forest', label: 'Florestas', property: 'landuse', value: 'forest' },
      { id: 'water', label: 'Água', property: 'natural', value: 'water' }
    ],
    urban_elements: [
      { id: 'restaurant', label: 'Restaurantes', property: 'amenity', value: 'restaurant' },
      { id: 'building', label: 'Edifícios', property: 'building', value: 'yes' }
    ],
    wineries: [
      { id: 'winery', label: 'Adegas', property: 'craft', value: 'winery' },
      { id: 'vineyard', label: 'Vinhas', property: 'landuse', value: 'vineyard' }
    ],
    transport_hubs: [
      { id: 'bus', label: 'Paragens de Autocarro', property: 'highway', value: 'bus_stop' },
      { id: 'train', label: 'Estações de Comboio', property: 'railway', value: 'station,halt' },
      { id: 'parking', label: 'Estacionamentos', property: 'amenity', value: 'parking' },
      { id: 'fuel', label: 'Postos de Combustível', property: 'amenity', value: 'fuel' },
      { id: 'taxi', label: 'Praças de Táxi', property: 'amenity', value: 'taxi' }
    ],
    healthcare_facilities: [
      { id: 'hospital', label: 'Hospitais', property: 'amenity', value: 'hospital' },
      { id: 'clinic', label: 'Clínicas', property: 'amenity', value: 'clinic' },
      { id: 'doctors', label: 'Consultórios', property: 'amenity', value: 'doctors' },
      { id: 'pharmacy', label: 'Farmácias', property: 'amenity', value: 'pharmacy' },
      { id: 'dentist', label: 'Dentistas', property: 'amenity', value: 'dentist' },
      { id: 'veterinary', label: 'Veterinários', property: 'amenity', value: 'veterinary' }
    ],
    commercial_areas: [
      { id: 'mall', label: 'Centros Comerciais', property: 'shop', value: 'mall' },
      { id: 'supermarket', label: 'Supermercados', property: 'shop', value: 'supermarket' },
      { id: 'convenience', label: 'Lojas de Conveniência', property: 'shop', value: 'convenience' },
      { id: 'department_store', label: 'Grandes Armazéns', property: 'shop', value: 'department_store' },
      { id: 'marketplace', label: 'Mercados', property: 'amenity', value: 'marketplace' },
      { id: 'commercial', label: 'Zonas Comerciais', property: 'landuse', value: 'commercial' },
      { id: 'retail', label: 'Zonas de Retalho', property: 'landuse', value: 'retail' }
    ]
  };
  
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
            case 'transport_hubs':
              data = await overpassService.getTransportHubs();
              break;
            case 'healthcare_facilities':
              data = await overpassService.getHealthcareFacilities();
              break;
            case 'commercial_areas':
              data = await overpassService.getCommercialAreas();
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
  
  // Highlight search terms when the component mounts
  useEffect(() => {
    if (!loading) {
      highlightSearchTerm();
    }
  }, [loading]);
  
  // Update the displayed data when filters change
  const [filteredData, setFilteredData] = useState(null);
  
  useEffect(() => {
    if (geojsonData) {
      const filtered = getFilteredData(geojsonData);
      setFilteredData(filtered);
    } else {
      setFilteredData(null);
    }
  }, [geojsonData, activeFilters, selectedFeatureType]); // Re-apply filters when any of these change
  
  // Handle feature selection change
  const handleFeatureTypeChange = (event) => {
    setSelectedFeatureType(event.target.value);
    // Clear filters when changing feature type
    setActiveFilters(prev => ({
      ...prev,
      [event.target.value]: []
    }));
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
      'religion': 'Religião',
      // Transport-related labels
      'highway': 'Tipo de Via',
      'railway': 'Tipo Ferroviário',
      'ref': 'Referência',
      'route_ref': 'Linhas',
      'public_transport': 'Transporte Público',
      'network': 'Rede',
      'parking': 'Estacionamento',
      'fee': 'Pagamento',
      'fuel:diesel': 'Gasóleo',
      'fuel:petrol': 'Gasolina',
      'fuel:lpg': 'GPL',
      'payment:credit_card': 'Cartão de Crédito',
      'payment:debit_card': 'Cartão de Débito',
      // Healthcare-related labels
      'healthcare': 'Tipo de Saúde',
      'healthcare:speciality': 'Especialidade',
      'emergency': 'Emergência',
      'dispensing': 'Dispensa Medicamentos',
      'doctor:type': 'Tipo de Médico',
      'vaccination': 'Vacinação',
      'medical_supply': 'Suprimentos Médicos',
      'wheelchair': 'Acessibilidade',
      'contact:phone': 'Telefone de Contacto',
      'contact:email': 'Email de Contacto',
      'health_facility:type': 'Tipo de Instalação de Saúde',
      // Commerce-related labels
      'shop': 'Tipo de Loja',
      'brand': 'Marca',
      'brand:wikidata': 'Marca (Wikidata)',
      'department': 'Departamento',
      'payment:cash': 'Pagamento em Dinheiro',
      'second_hand': 'Segunda Mão',
      'self_service': 'Self-Service',
      'organic': 'Produtos Orgânicos',
      'origin': 'Origem',
      'produce': 'Produtos',
      'construction': 'Construção',
      'clothes': 'Roupas',
      'merchandise': 'Mercadorias',
      'indoor': 'Interior',
      'level': 'Nível'
    };
    
    return labelMap[key] || key;
  };
  
  // Function to apply filters to the geojson data
  const getFilteredData = (data) => {
    if (!data || !data.features || data.features.length === 0) return data;
    
    // Get active filters for the current feature type
    const currentFilters = activeFilters[selectedFeatureType] || [];
    
    // If no filters are active, return the original data
    if (currentFilters.length === 0) return data;
    
    // Apply filters to the data
    const filteredFeatures = data.features.filter(feature => {
      // If no filters are active, include all features
      if (currentFilters.length === 0) return true;
      
      // Check if the feature matches any of the active filters
      return currentFilters.some(filterId => {
        const filter = filterOptions[selectedFeatureType].find(f => f.id === filterId);
        if (!filter) return false;
        
        const { property, value } = filter;
        const featureValue = feature.properties[property];
        
        // Handle multiple values (comma-separated)
        if (value.includes(',')) {
          const allowedValues = value.split(',');
          return featureValue && allowedValues.includes(featureValue);
        }
        
        return featureValue && featureValue === value;
      });
    });
    
    return {
      ...data,
      features: filteredFeatures
    };
  };
  
  return (
    <div className="full-width-container">
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
              <option value="dark">Negro</option>
            </select>
          </div>
          
          {/* Add filter options if available for the selected feature type */}
          {filterOptions[selectedFeatureType] && filterOptions[selectedFeatureType].length > 0 && (
            <div className="filter-options">
              <div className="filter-title">Filtrar por:</div>
              <div className="filter-checkboxes">
                {filterOptions[selectedFeatureType].map(filter => (
                  <label key={filter.id} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={activeFilters[selectedFeatureType]?.includes(filter.id) || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setActiveFilters(prev => {
                          // Get current filters for this feature type
                          const currentTypeFilters = prev[selectedFeatureType] || [];
                          
                          // Update the filters
                          const updatedTypeFilters = isChecked
                            ? [...currentTypeFilters, filter.id]
                            : currentTypeFilters.filter(id => id !== filter.id);
                          
                          // Return the updated state
                          return {
                            ...prev,
                            [selectedFeatureType]: updatedTypeFilters
                          };
                        });
                      }}
                    />
                    {filter.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="full-width map-container">
        <div className="intro-content">
          <h2 className="section-title">
            {activeFeatureType.icon} {activeFeatureType.name} {filteredData && !loading ? `(${filteredData.features.length})` : ''}
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
              geojsonData={filteredData}
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
              {filteredData && geojsonData && (
                filteredData.features.length === geojsonData.features.length ?
                `${filteredData.features.length} elementos encontrados.` :
                `${filteredData.features.length} elementos filtrados de ${geojsonData.features.length} totais.`
              )}
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