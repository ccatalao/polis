import React, { useState, useEffect } from 'react';
import fundingData from '../data/funding.json';

// Funding Card component
const FundingCard = ({ funding, onOpenDetails }) => {
  return (
    <div className="funding-card">
      <img 
        src={funding.imageUrl?.fallback ? `/polis${funding.imageUrl.fallback}` : 'https://via.placeholder.com/400x300?text=Funding'} 
        alt={funding.title}
        className="funding-image"
        onError={(e) => {
          console.error(`Image error for ${funding.id}`);
          e.target.src = 'https://via.placeholder.com/400x300?text=Error';
        }}
      />
      <div className="funding-content">
        <h3 className="funding-title">{funding.title}</h3>
        <p className="funding-description">{funding.description}</p>
        {funding.deadline && (
          <p className="funding-deadline">Prazo: {funding.deadline}</p>
        )}
        <button 
          className="funding-button" 
          onClick={() => onOpenDetails(funding)}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

// Funding Detail Modal
const FundingDetailModal = ({ funding, onClose }) => {
  if (!funding) return null;

  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{funding.title}</h2>
        <p className="modal-description">{funding.description}</p>
        
        <div className="info-section">
          <h3 className="info-label">Prazo:</h3>
          <p className="info-value">{funding.deadline}</p>
        </div>
        
        <div className="info-section">
          <h3 className="info-label">Elegibilidade:</h3>
          <p className="info-value">{funding.eligibility}</p>
        </div>
        
        {funding.features && funding.features.length > 0 && (
          <div className="info-section">
            <h3 className="info-label">Características:</h3>
            {funding.features.map((feature, index) => (
              <p key={index} className="info-value">
                • {typeof feature === 'string' ? feature : feature.feature}
              </p>
            ))}
          </div>
        )}
        
        <div className="modal-actions">
          <button 
            className="modal-link-button" 
            onClick={() => handleOpenUrl(funding.url)}
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

const Funding = () => {
  const [fundingSources, setFundingSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunding, setSelectedFunding] = useState(null);

  useEffect(() => {
    // Load data from JSON
    try {
      if (fundingData && fundingData.funding) {
        console.log(`Loaded ${fundingData.funding.length} funding opportunities`);
        setFundingSources(fundingData.funding);
      } else {
        console.warn("No funding data available or invalid format");
        setFundingSources([]);
      }
    } catch (error) {
      console.error("Error loading funding data:", error);
      setFundingSources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenDetails = (funding) => {
    setSelectedFunding(funding);
  };

  const handleCloseModal = () => {
    setSelectedFunding(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">A carregar fontes de financiamento...</p>
      </div>
    );
  }

  // If no funding data is available yet, show placeholder
  if (fundingSources.length === 0) {
    return (
      <div>
        <div className="hero">
          <div className="container">
            <h1>Financiamento</h1>
            <p>
              Descubra fontes de financiamento disponíveis para projetos de desenvolvimento urbano sustentável.
            </p>
          </div>
        </div>
        
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Em desenvolvimento</h2>
          <p>
            Esta secção está atualmente em desenvolvimento. Em breve, encontrará aqui informação sobre fontes
            de financiamento para projetos urbanos, incluindo fundos nacionais, europeus e programas de incentivo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="funding-page">
      <div className="hero">
        <div className="container">
          <h1>Financiamento</h1>
          <p>
            Descubra fontes de financiamento disponíveis para projetos de desenvolvimento urbano sustentável.
          </p>
        </div>
      </div>
      
      <div className="funding-container">
        {fundingSources.map(fund => (
          <FundingCard 
            key={fund.id} 
            funding={fund} 
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>
      
      {selectedFunding && (
        <FundingDetailModal
          funding={selectedFunding}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Funding; 