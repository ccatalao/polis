import React, { useState, useEffect } from 'react';
import municipioData from '../data/municipio.json';

// Service Card component
const ServiceCard = ({ service, onOpenDetails }) => {
  return (
    <div className="service-card">
      <div className="service-content">
        <h3 className="service-title">{service.title}</h3>
        <p className="service-description">{service.description.substring(0, 150)}...</p>
        <button 
          className="service-link" 
          onClick={() => onOpenDetails(service)}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

// Service Detail Modal
const ServiceDetailModal = ({ service, onClose }) => {
  if (!service) return null;

  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{service.title}</h2>
        <p className="modal-description">{service.description}</p>
        
        <div className="feature-list">
          <h3 className="feature-list-title">Serviços disponíveis:</h3>
          {service.features.map((feature, index) => (
            <div className="feature-list-item" key={index}>
              <a 
                href={feature.featureURL} 
                className="feature-list-link" 
                target="_blank"
                rel="noopener noreferrer"
              >
                • {feature.feature}
              </a>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <button 
            className="modal-link-button" 
            onClick={() => handleOpenUrl(service.url)}
          >
            Visitar site
          </button>
          
          <button className="modal-close-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const Municipio = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // Load data from JSON
    if (municipioData && municipioData.municipio) {
      setServices(municipioData.municipio);
      setLoading(false);
    } else {
      console.error('Failed to load municipio data');
      setLoading(false);
    }
  }, []);

  const handleOpenDetails = (service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">A carregar serviços municipais...</p>
      </div>
    );
  }

  return (
    <div className="municipio-container">
      <div className="hero">
        <div className="container">
          <h1>Serviços Municipais</h1>
          <p>
            Aceda aos serviços e recursos municipais em matéria de urbanismo, 
            ordenamento do território e habitação.
          </p>
        </div>
      </div>
      
      <div className="services-container">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>
      
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Municipio; 