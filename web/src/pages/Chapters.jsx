import React, { useState, useEffect } from 'react';
import chaptersData from '../data/chapters.json';
import '../main.css';

// Chapter Card component with consistent styling from main.css
const ChapterCard = ({ chapter, onOpenDetails }) => {
  // State to track image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Ensure proper image path handling, consistent with other components
  const getImagePath = (path) => {
    if (!path || !path.fallback) return 'https://via.placeholder.com/400x300?text=Chapter';
    
    // Return the original path if it already includes the full URL or starts with /polis/
    if (path.fallback.startsWith('http') || path.fallback.startsWith('/polis/')) {
      return path.fallback;
    }
    
    // For fallback image paths in the chapter data
    if (path.fallback.startsWith('./')) {
      return `/polis${path.fallback.substring(1)}`;
    }
    
    // Otherwise, prefix with /polis/
    return `/polis/${path.fallback}`;
  };
  
  return (
    <div className="content-card mobile-fullwidth">
      <div className="content-image-link">
        <div className={`content-image ${!imageLoaded ? 'loading' : ''}`}>
          <picture>
            <img 
              src={getImagePath(chapter.imageUrl)} 
              alt={chapter.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                if (!imageFailed) {
                  setImageFailed(true);
                  console.error(`Image error for category ${chapter.id}`);
                  e.target.src = 'https://via.placeholder.com/400x300?text=Error';
                }
              }}
            />
          </picture>
        </div>
        <div className="image-overlay">
          <span>Ver publicações</span>
        </div>
      </div>
      <div className="content-info">
        <h3>{chapter.title}</h3>
        <p>{chapter.description}</p>
        <button 
          className="visit-button" 
          onClick={() => onOpenDetails(chapter)}
        >
          Ver publicações
        </button>
      </div>
    </div>
  );
};

// Publication Card component with consistent styling
const PublicationCard = ({ publication }) => {
  // State to track image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Ensure proper image path handling, consistent with other components
  const getImagePath = (path) => {
    if (!path || !path.fallback) return 'https://via.placeholder.com/400x300?text=Publication';
    
    // Return the original path if it already includes the full URL or starts with /polis/
    if (path.fallback.startsWith('http') || path.fallback.startsWith('/polis/')) {
      return path.fallback;
    }
    
    // For fallback image paths in the publication data
    if (path.fallback.startsWith('./')) {
      return `/polis${path.fallback.substring(1)}`;
    }
    
    // Otherwise, prefix with /polis/
    return `/polis/${path.fallback}`;
  };

  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="content-card mobile-fullwidth">
      <div className="content-image-link">
        <div className={`content-image ${!imageLoaded ? 'loading' : ''}`}>
          <picture>
            <img 
              src={getImagePath(publication.imageUrl)} 
              alt={publication.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                if (!imageFailed) {
                  setImageFailed(true);
                  console.error(`Image error for publication ${publication.id}`);
                  e.target.src = 'https://via.placeholder.com/400x300?text=Error';
                }
              }}
            />
          </picture>
        </div>
        <div className="image-overlay">
          <span>Ver detalhes</span>
        </div>
      </div>
      <div className="content-info">
        <h3>{publication.title}</h3>
        <p>{publication.description}</p>
        <button 
          className="visit-button" 
          onClick={() => handleOpenUrl(publication.url)}
        >
          Visitar site
        </button>
      </div>
    </div>
  );
};

// Chapter Detail component with consistent styling
const ChapterDetail = ({ chapter, onBack }) => {
  if (!chapter || !chapter.content) return null;

  return (
    <div className="full-width-container">
      <div className="title-container">
        <h1 className="card-title">{chapter.title}</h1>
      </div>
      
      <div className="introduction full-width">
        <div className="intro-content">
          <p>{chapter.description}</p>
          <button className="back-button" onClick={onBack} style={{ marginTop: '20px' }}>
            Voltar para publicações
          </button>
        </div>
      </div>
      
      <div className="full-width-grid">
        {chapter.content.map(publication => (
          <PublicationCard 
            key={publication.id} 
            publication={publication}
          />
        ))}
      </div>
    </div>
  );
};

const Chapters = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
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
    // Load chapters from the imported JSON file
    try {
      if (chaptersData && chaptersData.chapters) {
        const formattedChapters = Object.keys(chaptersData.chapters).map(key => ({
          id: key,
          ...chaptersData.chapters[key]
        }));
        setChapters(formattedChapters);
        console.log(`Loaded ${formattedChapters.length} chapters`);
      } else {
        console.warn("No chapters data available or invalid format");
        setChapters([]);
      }
    } catch (error) {
      console.error('Error loading chapters data:', error);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenChapterDetails = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">A carregar publicações...</p>
      </div>
    );
  }

  // If no chapters data is available yet, show placeholder
  if (chapters.length === 0) {
    return (
      <div className="full-width-container">
        <div className="title-container">
          <h1 className="card-title">Publicações</h1>
        </div>
        
        <div className="introduction full-width">
          <div className="intro-content">
            <p>
              Aceda a conhecimento científico sobre urbanismo e ordenamento do território.
            </p>
            
          </div>
        </div>
      </div>
    );
  }

  // If a chapter is selected, show its details
  if (selectedChapter) {
    return <ChapterDetail chapter={selectedChapter} onBack={handleBackToChapters} />;
  }

  // Show list of chapters
  return (
    <div className="full-width-container">
      <div className="title-container">
        <h1 className="card-title">Publicações de acesso aberto</h1>
      </div>
      
      <div className="introduction full-width">
        <div className="intro-content">
          <p>
            Aceda a revistas científicas e recursos académicos sobre urbanismo e ordenamento do território.
          </p>
        </div>
      </div>
      
      <div className="full-width-grid">
        {chapters.map(chapter => (
          <ChapterCard 
            key={chapter.id} 
            chapter={chapter} 
            onOpenDetails={handleOpenChapterDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default Chapters; 