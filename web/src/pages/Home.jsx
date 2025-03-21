import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../main.css';

// Feature Card Component with path handling logic
const FeatureCard = ({ title, description, imageUrl, linkTo }) => {
  // State to track image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Ensure proper image path handling
  const getImagePath = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=Feature';
    
    // Return the original path if it already includes the full URL or starts with /polis/
    if (path.startsWith('http') || path.startsWith('/polis/')) {
      return path;
    }
    
    // Otherwise, prefix with /polis/
    return `/polis${path}`;
  };
  
  // Clean up the path to try alternatives if loading fails
  const handleImageError = () => {
    if (!imageFailed) {
      setImageFailed(true);
      // If image failed, we might want to try a different format or fallback
      console.log(`Image failed to load: ${imageUrl}`);
    }
  };

  return (
    <div className="content-card mobile-fullwidth">
      <div className="content-image-link">
        <div className={`content-image ${!imageLoaded ? 'loading' : ''}`}>
          <picture>
            <img 
              src={getImagePath(imageUrl)} 
              alt={title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          </picture>
        </div>
        <div className="image-overlay">
          <span>Explore</span>
        </div>
      </div>
      <div className="content-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={linkTo} className="visit-button">
          Ver mais
        </Link>
      </div>
    </div>
  );
};

const Home = () => {
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

  return (
    <div className="full-width-container">
      <div className="title-container">
        <h1 className="card-title">Planeamento Urbano Informado</h1>
      </div>
      
      <div className="introduction full-width">
        <div className="intro-content">
          <p>
            Um guia para políticas de desenvolvimento local mais eficazes e sustentáveis. 
            Descubra recursos, serviços e conhecimentos relacionados ao planeamento urbano.
          </p>
          
          <p>
            A plataforma <strong>Polis</strong> oferece acesso a:
          </p>
          
          <ul>
            <li>Publicações académicas de acesso aberto sobre urbanismo</li>
            <li>Projetos europeus de desenvolvimento urbano</li>
            <li>Oportunidades de financiamento para iniciativas locais</li>
            <li>Informações sobre serviços municipais de planeamento e habitação</li>
          </ul>
        </div>
      </div>
      
      <div className="full-width-grid">
        <FeatureCard
          title="Serviços Municipais"
          description="Aceda aos serviços e recursos municipais em matéria de urbanismo, ordenamento do território e habitação."
          imageUrl="/images/home/municipio.webp"
          linkTo="/municipio"
        />

        <FeatureCard
          title="Projetos europeus"
          description="Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano."
          imageUrl="/images/home/projects.webp"
          linkTo="/projects"
        />

        <FeatureCard
          title="Financiamento"
          description="Descubra fontes de financiamento disponíveis para projetos de desenvolvimento urbano sustentável."
          imageUrl="/images/home/funding.webp"
          linkTo="/funding"
        />

        <FeatureCard
          title="Publicações de acesso aberto"
          description="Aceda a revistas científicas e recursos académicos sobre urbanismo e ordenamento do território."
          imageUrl="/images/home/publicacoes.webp"
          linkTo="/chapters"
        />
      </div>
      
      <div className="about-footer full-width">
        <div className="footer-content">
          <h3>Sobre o Polis</h3>
          <p>
            Polis é uma plataforma abrangente de informação sobre planeamento urbano, 
            desenhada para fornecer acesso a recursos, serviços e conhecimentos 
            relacionados com planeamento e desenvolvimento urbano. A aplicação serve 
            como um hub centralizado para diversos interessados, incluindo urbanistas, 
            funcionários municipais, investigadores e cidadãos interessados no 
            desenvolvimento urbano.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 