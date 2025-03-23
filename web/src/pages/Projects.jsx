import React, { useState, useEffect } from 'react';
import projectsData from '../data/projects.json';
import '../styles/map.css';

// Enhanced Project Card component with features directly embedded
const ProjectCard = ({ project }) => {
  // State to track image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Ensure proper image path handling, consistent with Home.jsx
  const getImagePath = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=Project';
    
    // Return the original path if it already includes the full URL or starts with /polis/
    if (path.startsWith('http') || path.startsWith('/polis/')) {
      return path;
    }
    
    // For fallback image paths in the project data
    if (path.startsWith('./')) {
      return `/polis${path.substring(1)}`;
    }
    
    // Otherwise, prefix with /polis/
    return `/polis${path}`;
  };
  
  const imageUrl = project.imageUrl?.fallback || project.imageUrl;
  
  const handleOpenUrl = (url) => {
    // More forceful scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Short delay before opening the URL to ensure scroll completes
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 100);
  };
  
  return (
    <div className="content-card mobile-fullwidth">
      <div className="content-image-link" onClick={() => handleOpenUrl(project.url)}>
        <div className={`content-image ${!imageLoaded ? 'loading' : ''}`}>
          <picture>
            <img 
              src={getImagePath(imageUrl)} 
              alt={project.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                if (!imageFailed) {
                  setImageFailed(true);
                  console.error(`Image error for ${project.id}`);
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
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        
        {/* Always visible features section */}
        <div className="feature-list">
          <h4 className="feature-list-title">Destaques:</h4>
          {project.features.map((feature, index) => (
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
          onClick={() => handleOpenUrl(project.url)}
        >
          Visitar site
        </button>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
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
      if (projectsData && projectsData.projects) {
        console.log(`Loaded ${projectsData.projects.length} projects`);
        setProjects(projectsData.projects);
      } else {
        console.warn("No projects data available or invalid format");
        setProjects([]);
      }
    } catch (error) {
      console.error("Error loading projects data:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">A carregar projetos europeus...</p>
      </div>
    );
  }

  // If no projects data is available yet, show placeholder
  if (projects.length === 0) {
    return (
      <div className="full-width-container">
        <div className="introduction full-width">
          <div className="intro-content">
            <p>
              Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano.
            </p>
            

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="full-width-container">
      <div className="introduction full-width">
        <div className="intro-content">
          <p>
            Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano.
          </p>
        </div>
      </div>
      
      <div className="full-width-grid">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects; 