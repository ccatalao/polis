import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Import custom stylesheet for the map
import '../styles/map.css';

// Fix Leaflet's default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Define feature type icons and colors
const featureIcons = {
  school: { icon: '🏫', color: '#ff0000' },
  college: { icon: '🎓', color: '#ff0000' },
  university: { icon: '🎓', color: '#ff0000' },
  library: { icon: '📚', color: '#995500' },
  museum: { icon: '🏛️', color: '#995500' },
  historic: { icon: '🏛️', color: '#995500' },
  archaeological_site: { icon: '🏺', color: '#995500' },
  monument: { icon: '🗿', color: '#995500' },
  memorial: { icon: '🪦', color: '#995500' },
  castle: { icon: '🏰', color: '#995500' },
  ruins: { icon: '🏚️', color: '#995500' },
  park: { icon: '🌳', color: '#00aa00' },
  garden: { icon: '🌷', color: '#00aa00' },
  forest: { icon: '🌲', color: '#00aa00' },
  nature_reserve: { icon: '🌿', color: '#00aa00' },
  water: { icon: '💧', color: '#0099ff' },
  river: { icon: '🏞️', color: '#0099ff' },
  lake: { icon: '🏞️', color: '#0099ff' },
  reservoir: { icon: '💦', color: '#0099ff' },
  winery: { icon: '🍷', color: '#722F37' },
  vineyard: { icon: '🍇', color: '#722F37' },
  restaurant: { icon: '🍽️', color: '#ff7800' },
  cafe: { icon: '☕', color: '#ff7800' },
  bar: { icon: '🍺', color: '#ff7800' },
  hotel: { icon: '🏨', color: '#ff7800' },
  guest_house: { icon: '🏠', color: '#ff7800' },
  hostel: { icon: '🛏️', color: '#ff7800' },
  campsite: { icon: '⛺', color: '#ff7800' },
  information: { icon: 'ℹ️', color: '#ff7800' },
  viewpoint: { icon: '🔭', color: '#ff7800' },
  picnic_site: { icon: '🧺', color: '#ff7800' },
  building: { icon: '🏢', color: '#999999' },
  residential: { icon: '🏘️', color: '#999999' },
  commercial: { icon: '🏬', color: '#999999' },
  industrial: { icon: '🏭', color: '#999999' },
  default: { icon: '📍', color: '#3388ff' }
};

// Function to find appropriate icon and color for a feature
const getFeatureStyle = (properties) => {
  if (!properties) return featureIcons.default;
  
  if (properties.amenity === 'school') return featureIcons.school;
  if (properties.amenity === 'college') return featureIcons.college;
  if (properties.amenity === 'university') return featureIcons.university;
  if (properties.amenity === 'library') return featureIcons.library;
  if (properties.amenity === 'museum') return featureIcons.museum;
  if (properties.amenity === 'restaurant') return featureIcons.restaurant;
  if (properties.amenity === 'cafe') return featureIcons.cafe;
  if (properties.amenity === 'bar') return featureIcons.bar;
  if (properties.amenity === 'winery') return featureIcons.winery;
  if (properties.tourism === 'hotel') return featureIcons.hotel;
  if (properties.tourism === 'guest_house') return featureIcons.guest_house;
  if (properties.tourism === 'hostel') return featureIcons.hostel;
  if (properties.tourism === 'information') return featureIcons.information;
  if (properties.tourism === 'viewpoint') return featureIcons.viewpoint;
  if (properties.tourism === 'picnic_site') return featureIcons.picnic_site;
  if (properties.tourism === 'museum') return featureIcons.museum;
  if (properties.tourism === 'camp_site') return featureIcons.campsite;
  if (properties.historic) return featureIcons[properties.historic] || featureIcons.historic;
  if (properties.leisure === 'park') return featureIcons.park;
  if (properties.leisure === 'garden') return featureIcons.garden;
  if (properties.leisure === 'nature_reserve') return featureIcons.nature_reserve;
  if (properties.natural === 'water') return featureIcons.water;
  if (properties.water === 'river') return featureIcons.river;
  if (properties.water === 'lake') return featureIcons.lake;
  if (properties.water === 'reservoir') return featureIcons.reservoir;
  if (properties.craft === 'winery' || properties.amenity === 'winery') return featureIcons.winery;
  if (properties.landuse === 'vineyard') return featureIcons.vineyard;
  if (properties.landuse === 'forest') return featureIcons.forest;
  if (properties.building === 'yes') return featureIcons.building;
  if (properties.building === 'residential') return featureIcons.residential;
  if (properties.building === 'commercial') return featureIcons.commercial;
  if (properties.building === 'industrial') return featureIcons.industrial;
  
  return featureIcons.default;
};

// Component to manage map bounds when GeoJSON changes
const SetBoundsComponent = ({ geojsonData }) => {
  const map = useMap();
  
  useEffect(() => {
    if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
      try {
        const geoJsonLayer = L.geoJSON(geojsonData);
        const bounds = geoJsonLayer.getBounds();
        
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error("Error setting map bounds:", error);
      }
    }
  }, [geojsonData, map]);
  
  return null;
};

// Main Map Component
const MapComponent = ({ 
  geojsonData, 
  center = [38.569, -8.8],  // Default: Palmela coordinates
  zoom = 12,
  height = '600px',
  showPopups = true,
  onFeatureClick = null,
  style = {},
  mapStyle = 'streets' // Add mapStyle prop with default
}) => {
  const [map, setMap] = useState(null);
  const geojsonLayerRef = useRef(null);
  
  // Map tile URL and attribution based on selected style
  const getMapTileInfo = () => {
    switch (mapStyle) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        };
      case 'terrain':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        };
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        };
      case 'streets':
      default:
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        };
    }
  };
  
  const mapTileInfo = getMapTileInfo();
  
  // Style function for GeoJSON features
  const featureStyle = (feature) => {
    // Basic styles based on geometry type
    const baseStyle = {
      weight: 2,
      opacity: 0.8,
      color: '#3388ff',
      dashArray: '',
      fillOpacity: 0.4,
      fillColor: '#3388ff'
    };
    
    // Adjust opacity and weights based on map style
    if (mapStyle === 'dark') {
      baseStyle.opacity = 1;
      baseStyle.fillOpacity = 0.6;
      baseStyle.weight = 3;
    } else if (mapStyle === 'satellite') {
      baseStyle.opacity = 1;
      baseStyle.fillOpacity = 0.5;
      baseStyle.weight = 3;
      baseStyle.color = '#ffffff';
    }
    
    // Apply different styles based on feature type
    if (feature.properties) {
      const { color } = getFeatureStyle(feature.properties);
      
      // Schools
      if (feature.properties.amenity === 'school') {
        return { 
          ...baseStyle, 
          fillColor: color, 
          color: mapStyle === 'dark' ? '#ff6666' : '#800000' 
        };
      }
      
      // Parks and green spaces
      if (feature.properties.leisure === 'park' || feature.properties.landuse === 'forest') {
        return { 
          ...baseStyle, 
          fillColor: color, 
          color: mapStyle === 'dark' ? '#66ff66' : '#006600' 
        };
      }
      
      // Historical sites
      if (feature.properties.historic) {
        return { 
          ...baseStyle, 
          fillColor: color, 
          color: mapStyle === 'dark' ? '#ffaa66' : '#663300' 
        };
      }
      
      // Water features
      if (feature.properties.natural === 'water') {
        return { 
          ...baseStyle, 
          fillColor: color, 
          color: mapStyle === 'dark' ? '#66aaff' : '#0066cc' 
        };
      }
      
      // Buildings
      if (feature.properties.building) {
        return { 
          ...baseStyle, 
          fillColor: color, 
          color: mapStyle === 'dark' ? '#aaaaaa' : '#666666', 
          weight: mapStyle === 'dark' ? 2 : 1 
        };
      }
      
      // Roads
      if (feature.properties.highway) {
        return { 
          ...baseStyle, 
          weight: feature.properties.highway === 'primary' ? 5 
                : feature.properties.highway === 'secondary' ? 4 
                : feature.properties.highway === 'tertiary' ? 3 
                : 2,
          color: mapStyle === 'dark' ? '#dddddd' : '#ffffff',
          opacity: 0.9
        };
      }
      
      // Wineries
      if (feature.properties.craft === 'winery' || feature.properties.amenity === 'winery') {
        return { 
          ...baseStyle, 
          fillColor: color, 
          color: mapStyle === 'dark' ? '#ff99aa' : '#4A1D24' 
        };
      }
    }
    
    return baseStyle;
  };
  
  // Point to layer function for handling point features
  const pointToLayer = (feature, latlng) => {
    const { color } = getFeatureStyle(feature.properties);
    
    // Adjust point style based on map background
    const pointOptions = {
      radius: 8,
      fillColor: color,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    
    // Modify the point style for dark and satellite modes
    if (mapStyle === 'dark') {
      pointOptions.color = "#fff";
      pointOptions.weight = 2;
      pointOptions.fillOpacity = 0.9;
    } else if (mapStyle === 'satellite') {
      pointOptions.color = "#fff";
      pointOptions.weight = 2;
      pointOptions.radius = 9;
      pointOptions.fillOpacity = 0.9;
    }
    
    return L.circleMarker(latlng, pointOptions);
  };
  
  // Function to generate popup content
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      // Add tooltip with name if available
      if (feature.properties.name) {
        layer.bindTooltip(
          `<div class="feature-tooltip">${feature.properties.name}</div>`,
          { 
            permanent: false, 
            direction: 'top',
            className: 'feature-tooltip-container',
            offset: [0, -10]
          }
        );
      }
      
      // Create popup content from feature properties
      const filteredProperties = Object.entries(feature.properties)
        .filter(([key]) => !key.startsWith('osm_') && key !== 'building' && key !== 'highway')
        .sort(([a], [b]) => {
          // Prioritize common properties like name
          if (a === 'name') return -1;
          if (b === 'name') return 1;
          return a.localeCompare(b);
        });
      
      const popupContent = filteredProperties
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
        .join('<br/>');
      
      if (popupContent && showPopups) {
        layer.bindPopup(
          `<div class="custom-popup-content">${popupContent}</div>`,
          {
            maxWidth: 300,
            className: 'custom-popup'
          }
        );
      }
      
      // Add click handler if provided
      if (onFeatureClick) {
        layer.on('click', (e) => {
          e.originalEvent.stopPropagation();
          onFeatureClick(feature, e);
        });
      }
    }
  };
  
  // Update the GeoJSON layer when the data changes
  useEffect(() => {
    if (map && geojsonLayerRef.current) {
      geojsonLayerRef.current.clearLayers();
      
      if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
        try {
          geojsonLayerRef.current.addData(geojsonData);
          console.log(`Rendered ${geojsonData.features.length} features on the map`);
        } catch (error) {
          console.error("Error adding GeoJSON data to map:", error);
        }
      }
    }
  }, [geojsonData, map]);
  
  // Force redraw when geojsonData changes
  useEffect(() => {
    if (map && geojsonLayerRef.current) {
      // This will ensure the Leaflet container re-renders
      map.invalidateSize();
    }
  }, [geojsonData, map]);
  
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height, ...style }} 
      whenCreated={setMap}
      className={`custom-map-container map-${mapStyle}`}
    >
      <TileLayer
        attribution={mapTileInfo.attribution}
        url={mapTileInfo.url}
      />
      
      {geojsonData && (
        <GeoJSON 
          key={JSON.stringify(geojsonData)}
          data={geojsonData}
          style={featureStyle}
          pointToLayer={pointToLayer}
          onEachFeature={onEachFeature}
          ref={geojsonLayerRef}
        />
      )}
      
      <SetBoundsComponent geojsonData={geojsonData} />
    </MapContainer>
  );
};

export default MapComponent; 