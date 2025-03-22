import React, { useState, useEffect } from 'react';
import municipioData from '../data/municipio.json';
import '../main.css';

// Enhanced Municipal Service Card component with features directly embedded
const ServiceCard = ({ service }) => {
  // State to track image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Ensure proper image path handling, consistent with Projects.jsx
  const getImagePath = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=Serviço';
    
    // Return the original path if it already includes the full URL or starts with /polis/
    if (path.startsWith('http') || path.startsWith('/polis/')) {
      return path;
    }
    
    // For fallback image paths in the service data
    if (path.startsWith('./')) {
      return `/polis${path.substring(1)}`;
    }
    
    // Otherwise, prefix with /polis/
    return `/polis${path}`;
  };
  
  const imageUrl = service.imageUrl?.fallback || service.imageUrl;
  
  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="content-card mobile-fullwidth">
      <div className="content-image-link" onClick={() => handleOpenUrl(service.url)}>
        <div className={`content-image ${!imageLoaded ? 'loading' : ''}`}>
          <picture>
            <img 
              src={getImagePath(imageUrl)} 
              alt={service.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                if (!imageFailed) {
                  setImageFailed(true);
                  console.error(`Image error for ${service.id}`);
                  e.target.src = 'https://via.placeholder.com/400x300?text=Error';
                }
              }}
            />
          </picture>
        </div>
        <div className="image-overlay">
          <span>Visitar site</span>
        </div>
      </div>

      <div className="content-info">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        
        {/* Always visible features section */}
        <div className="feature-list">
          <h4 className="feature-list-title">Destaques:</h4>
          {service.features.map((feature, index) => (
            <div className="feature-list-item" key={index}>
              <a 
                href={feature.featureURL} 
                target="_blank" 
                rel="noreferrer"
                className="feature-link"
              >
                • {feature.feature}
              </a>
            </div>
          ))}
        </div>
        
        <button 
          className="visit-button" 
          onClick={() => handleOpenUrl(service.url)}
        >
          Visitar site
        </button>
      </div>
    </div>
  );
};

const Municipio = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted state to true after component mounts
    // This forces a re-render after the component is mounted
    if (!mounted) {
      setMounted(true);
    }
    
    // Add a resize event listener to force re-renders on orientation change
    const handleResize = () => {
      // Only force re-render on significant changes
      if (window.innerWidth <= 768) {
        // Force a re-render by toggling mounted state
        setMounted(false);
        setTimeout(() => setMounted(true), 50);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);
  
  useEffect(() => {
    // Load data from JSON
    try {
      if (municipioData && municipioData.municipio) {
        console.log(`Loaded ${municipioData.municipio.length} municipal services`);
        setServices(municipioData.municipio);
      } else {
        console.warn("No municipio data available or invalid format");
        setServices([]);
      }
    } catch (error) {
      console.error("Error loading municipio data:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">A carregar serviços municipais...</p>
      </div>
    );
  }

  // If no services data is available yet, show placeholder
  if (services.length === 0) {
    return (
      <div className="full-width-container">
        <div className="title-container">
          <h1 className="card-title">Serviços Municipais</h1>
        </div>
        
        <div className="introduction full-width">
          <div className="intro-content">
            <p>
              Aceda aos serviços e recursos municipais em matéria de urbanismo, 
              ordenamento do território e habitação.
            </p>
            
            <p style={{ textAlign: 'center', marginTop: '40px', fontWeight: 'bold' }}>
              Informação em atualização.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="full-width-container">
      <div className="title-container">
        <h1 className="card-title">Serviços Municipais</h1>
      </div>
      
      <div className="introduction full-width">
        <div className="intro-content">
          <p>
            Aceda aos serviços e recursos municipais em matéria de urbanismo, 
            ordenamento do território e habitação.
          </p>
        </div>
      </div>
      
      <div className="full-width-grid">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}
      </div>
    </div>
  );
};

export default Municipio; 