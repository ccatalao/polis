import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';
import { forceScrollToTop } from '../utils/scroll';

// Enhanced function to aggressively scroll to top
const aggressiveScrollToTop = (isMapLink = false) => {
  // Immediately scroll to top without smooth behavior for instant results
  window.scrollTo(0, 0);
  
  // Reset any scroll position values directly
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
  
  // Use the utility function as an additional measure
  forceScrollToTop();
  
  // Multiple attempts with short intervals for problematic cases
  const attempts = isMapLink ? 15 : 5; // More attempts for mapping page
  const interval = isMapLink ? 10 : 50; // Even shorter interval for mapping page (10ms)
  
  for (let i = 1; i <= attempts; i++) {
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }, i * interval);
  }
  
  // For mapping specifically, use requestAnimationFrame for better timing
  if (isMapLink) {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });
    
    // Set a sessionStorage flag for the mapping page
    sessionStorage.setItem('force_map_scroll', 'true');
  }
};

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

  // Determine the button text based on the destination
  const getExploreText = (linkPath) => {
    switch(linkPath) {
      case '/municipio':
        return 'Informação do Município';
      case '/projects':
        return 'Ver Projetos';
      case '/chapters':
        return 'Ler Publicações';
      case '/mapping':
        return 'Explorar Mapa';
      default:
        return 'Explorar';
    }
  };
  
  // Enhanced handle click function with special handling for map
  const handleCardClick = (e) => {
    const isMapLink = linkTo === '/mapping';
    
    if (isMapLink) {
      // For mapping, override the default link behavior to ensure scrolling works
      e.preventDefault();
      
      // Immediately scroll to top without smooth behavior
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Add a stronger hint for the mapping page
      sessionStorage.setItem('force_map_scroll', 'true');
      sessionStorage.setItem('map_scroll_time', Date.now().toString());
      
      // Extra aggressive approach with repeated attempts
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, i * 10);
      }
      
      // Call the normal scroll function too
      aggressiveScrollToTop(true);
      
      // After trying to scroll, navigate programmatically with the correct base URL
      setTimeout(() => {
        // Use the correct URL with the /polis/ base
        window.location.href = `/polis${linkTo}`;
      }, 50);
    } else {
      // For non-map links, use the normal approach
      aggressiveScrollToTop(false);
    }
  };

  return (
    <div className="content-card mobile-fullwidth">
      <Link to={linkTo} className="content-image-link" onClick={handleCardClick}>
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
          <span>{getExploreText(linkTo)}</span>
        </div>
      </Link>
      <div className="content-info">
        <h3>{title}</h3>
        <p>{description}</p>

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
      
      <div className="introduction full-width">
        <div className="intro-content">
          <p>
            Um guia para políticas de desenvolvimento local mais eficazes e sustentáveis. 
            Descubra recursos, serviços e informação sobre ordenamento do território, 
            urbanismo e reabilitação urbana. Oferecemos acesso a:
          </p>

          
          <ul>
            <li>Informação do município de Palmela</li>
            <li>Projetos europeus e oportunidades de financiamento</li>
            <li>Publicações científicas</li>
            <li>Mapeamento interativo de Palmela</li>
          </ul>
        </div>
      </div>
      
      <div className="full-width-grid">
        <FeatureCard
          title="Município de Palmela"
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
          title="Publicações"
          description="Aceda a revistas científicas e recursos académicos sobre urbanismo e ordenamento do território."
          imageUrl="/images/home/publicacoes.webp"
          linkTo="/chapters"
        />
        <FeatureCard
          title="Mapas Interativos"
          description="Explore os dados geográficos de Palmela."
          imageUrl="/images/home/mapa.webp"
          linkTo="/mapping"
        />
      </div>
      
      <div className="about-footer full-width">
        <div className="footer-content">
          <h3>Sobre o Polis</h3>
          <p>
          Polis é um recurso desenvolvido pela Comissão de Ordenamento do Território, Urbanismo, Reabilitação Urbana e Obras Públicas no âmbito do seu trabalho na Assembleia Municipal de Palmela.
          </p>
          <p></p>
          <p>
          Destina-se a cidadãos, decisores políticos e a todos os interessados nas áreas do urbanismo, planeamento territorial e reabilitação urbana em Palmela.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 