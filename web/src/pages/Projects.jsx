import React, { useState, useEffect } from 'react';
import projectsData from '../data/projects.json';
import '../main.css';

// Project Card component with consistent styling from main.css
const ProjectCard = ({ project, onOpenDetails }) => {
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
  
  return (
    <div className="content-card mobile-fullwidth">
      <div className="content-image-link">
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
          <span>Detalhes</span>
        </div>
      </div>
      <div className="content-info">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <button 
          className="visit-button" 
          onClick={() => onOpenDetails(project)}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

// Project Detail Modal
const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{project.title}</h2>
        <p className="modal-description">{project.description}</p>
        
        <div className="feature-list">
          <h3 className="feature-list-title">Características:</h3>
          {project.features.map((feature, index) => (
            <div className="feature-list-item" key={index}>
              <span className="feature-text">
                • {typeof feature === 'string' ? feature : feature.feature}
              </span>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <button 
            className="visit-button" 
            onClick={() => handleOpenUrl(project.url)}
          >
            Visitar site
          </button>
          
          <button className="back-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
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

  const handleOpenDetails = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

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
        <div className="title-container">
          <h1 className="card-title">Projetos europeus</h1>
        </div>
        
        <div className="introduction full-width">
          <div className="intro-content">
            <p>
              Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano.
            </p>
            
            <p style={{ textAlign: 'center', marginTop: '40px', fontWeight: 'bold' }}>
              Esta secção está atualmente em desenvolvimento.
            </p>
            
            <p style={{ textAlign: 'center' }}>
              Em breve, encontrará aqui informação sobre projetos 
              europeus de desenvolvimento urbano, oportunidades de financiamento e colaborações internacionais.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="full-width-container">
      <div className="title-container">
        <h1 className="card-title">Projetos europeus</h1>
      </div>
      
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
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>
      
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Projects; 