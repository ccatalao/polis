import React, { useState, useEffect } from 'react';
import projectsData from '../data/projects.json';

// Project Card component
const ProjectCard = ({ project, onOpenDetails }) => {
  return (
    <div className="project-card">
      <img 
        src={project.imageUrl?.fallback ? `/polis${project.imageUrl.fallback}` : 'https://via.placeholder.com/400x300?text=Project'} 
        alt={project.title}
        className="project-image"
        onError={(e) => {
          console.error(`Image error for ${project.id}`);
          e.target.src = 'https://via.placeholder.com/400x300?text=Error';
        }}
      />
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <button 
          className="project-link" 
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
            className="modal-link-button" 
            onClick={() => handleOpenUrl(project.url)}
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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

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
      <div>
        <div className="hero">
          <div className="container">
            <h1>Projetos europeus</h1>
            <p>
              Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano.
            </p>
          </div>
        </div>
        
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Em desenvolvimento</h2>
          <p>
            Esta secção está atualmente em desenvolvimento. Em breve, encontrará aqui informação sobre projetos 
            europeus de desenvolvimento urbano, oportunidades de financiamento e colaborações internacionais.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="hero">
        <div className="container">
          <h1>Projetos europeus</h1>
          <p>
            Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano.
          </p>
        </div>
      </div>
      
      <div className="projects-container">
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