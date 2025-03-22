import React, { useState, useEffect } from 'react';
import fundingData from '../data/funding.json';
import '../main.css';

// Enhanced Funding Card component with features directly embedded
const FundingCard = ({ funding }) => {
  // State to track image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Ensure proper image path handling, consistent with Projects.jsx
  const getImagePath = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=Funding';
    
    // Return the original path if it already includes the full URL or starts with /polis/
    if (path.startsWith('http') || path.startsWith('/polis/')) {
      return path;
    }
    
    // For fallback image paths in the funding data
    if (path.startsWith('./')) {
      return `/polis${path.substring(1)}`;
    }
    
    // Otherwise, prefix with /polis/
    return `/polis${path}`;
  };
  
  const imageUrl = funding.imageUrl?.fallback || funding.imageUrl;
  
  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="content-card mobile-fullwidth">
      <div className="content-image-link" onClick={() => handleOpenUrl(funding.url)}>
        <div className={`content-image ${!imageLoaded ? 'loading' : ''}`}>
          <picture>
            <img 
              src={getImagePath(imageUrl)} 
              alt={funding.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                if (!imageFailed) {
                  setImageFailed(true);
                  console.error(`Image error for ${funding.id}`);
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
        <h3>{funding.title}</h3>
        <p>{funding.description}</p>
        {funding.deadline && (
          <p className="funding-deadline"><strong>Prazo:</strong> {funding.deadline}</p>
        )}
        
        {/* Eligibility if available */}
        {funding.eligibility && (
          <p className="funding-eligibility"><strong>Elegibilidade:</strong> {funding.eligibility}</p>
        )}
        
        {/* Always visible features section */}
        <div className="feature-list">
          <h4 className="feature-list-title">Destaques:</h4>
          {funding.features && funding.features.map((feature, index) => (
            <div className="feature-list-item" key={index}>
              {typeof feature === 'string' ? (
                <div className="feature-text">• {feature}</div>
              ) : (
                <a 
                  href={feature.featureURL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="feature-link"
                >
                  • {feature.feature}
                </a>
              )}
            </div>
          ))}
        </div>
        
        <button 
          className="visit-button" 
          onClick={() => handleOpenUrl(funding.url)}
        >
          Visitar site
        </button>
      </div>
    </div>
  );
};

const Funding = () => {
  const [fundingSources, setFundingSources] = useState([]);
  const [loading, setLoading] = useState(true);
  // Force a re-render once on component mount to ensure proper layout
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
      <div className="full-width-container">
        <div className="title-container">
          <h1 className="card-title">Financiamento</h1>
        </div>
        
        <div className="introduction full-width">
          <div className="intro-content">
            <p>
              Descubra fontes de financiamento disponíveis para projetos de desenvolvimento urbano sustentável.
            </p>
            
            <p style={{ textAlign: 'center', marginTop: '40px', fontWeight: 'bold' }}>
              Esta secção está atualmente em desenvolvimento.
            </p>
            
            <p style={{ textAlign: 'center' }}>
              Em breve, encontrará aqui informação sobre fontes
              de financiamento para projetos urbanos, incluindo fundos nacionais, europeus e programas de incentivo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="full-width-container">
      <div className="title-container">
        <h1 className="card-title">Financiamento</h1>
      </div>
      
      <div className="introduction full-width">
        <div className="intro-content">
          <p>
            Descubra fontes de financiamento disponíveis para projetos de desenvolvimento urbano sustentável.
          </p>
        </div>
      </div>
      
      <div className="full-width-grid">
        {fundingSources.map(fund => (
          <FundingCard
            key={fund.id}
            funding={fund}
          />
        ))}
      </div>
    </div>
  );
};

export default Funding; 