import React, { useState, useEffect } from 'react';
import chaptersData from '../data/chapters.json';

// Helper function to properly format image paths
const formatImagePath = (imageUrl) => {
  if (!imageUrl || !imageUrl.fallback) {
    return 'https://via.placeholder.com/400x300?text=Image';
  }
  
  // Remove the leading ./ from the path
  const path = imageUrl.fallback.replace(/^\.\//, '');
  return `/polis/${path}`;
};

// Chapter Card component
const ChapterCard = ({ chapter, onOpenDetails }) => {
  return (
    <div className="chapter-card">
      <img 
        src={formatImagePath(chapter.imageUrl)} 
        alt={chapter.title}
        className="chapter-image"
        onError={(e) => {
          if (!e.target.dataset.errorHandled) {
            console.error(`Image error for category ${chapter.id}`);
            e.target.src = 'https://via.placeholder.com/400x300?text=Error';
            e.target.dataset.errorHandled = 'true';
          }
        }}
      />
      <div className="chapter-content">
        <h3 className="chapter-title">{chapter.title}</h3>
        <p className="chapter-description">{chapter.description}</p>
        <button 
          className="chapter-link" 
          onClick={() => onOpenDetails(chapter)}
        >
          Ver publicações
        </button>
      </div>
    </div>
  );
};

// Publication Card component
const PublicationCard = ({ publication, categoryId }) => {
  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="publication-card">
      <img 
        src={formatImagePath(publication.imageUrl)} 
        alt={publication.title}
        className="publication-image"
        onError={(e) => {
          if (!e.target.dataset.errorHandled) {
            console.error(`Image error for publication ${publication.id}`);
            e.target.src = 'https://via.placeholder.com/400x300?text=Error';
            e.target.dataset.errorHandled = 'true';
          }
        }}
      />
      <div className="publication-content">
        <h3 className="publication-title">{publication.title}</h3>
        <p className="publication-description">{publication.description}</p>
        <button 
          className="publication-link" 
          onClick={() => handleOpenUrl(publication.url)}
        >
          Visitar site
        </button>
      </div>
    </div>
  );
};

// Chapter Detail component
const ChapterDetail = ({ chapter, onBack }) => {
  if (!chapter || !chapter.content) return null;

  return (
    <div className="chapter-detail">
      <div className="chapter-detail-header">
        <h2 className="chapter-detail-title">{chapter.title}</h2>
        <p className="chapter-detail-description">{chapter.description}</p>
        <button className="back-button" onClick={onBack}>
          Voltar
        </button>
      </div>
      
      <div className="publications-container">
        {chapter.content.map(publication => (
          <PublicationCard 
            key={publication.id} 
            publication={publication}
            categoryId={chapter.id}
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
      <div>
        <div className="hero">
          <div className="container">
            <h1>Publicações de acesso aberto</h1>
            <p>
              Aceda a revistas científicas e recursos académicos sobre urbanismo e ordenamento do território.
            </p>
          </div>
        </div>
        
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Em desenvolvimento</h2>
          <p>
            Esta secção está atualmente em desenvolvimento. Em breve, encontrará aqui uma biblioteca
            de recursos académicos e publicações científicas sobre planeamento urbano e ordenamento do território.
          </p>
        </div>
      </div>
    );
  }

  // If a chapter is selected, show its details
  if (selectedChapter) {
    return (
      <div className="chapters-page">
        <div className="hero">
          <div className="container">
            <h1>Publicações de acesso aberto</h1>
            <p>
              Aceda a revistas científicas e recursos académicos sobre urbanismo e ordenamento do território.
            </p>
          </div>
        </div>
        
        <div className="container">
          <ChapterDetail 
            chapter={selectedChapter} 
            onBack={handleBackToChapters} 
          />
        </div>
      </div>
    );
  }

  // Show list of chapters
  return (
    <div className="chapters-page">
      <div className="hero">
        <div className="container">
          <h1>Publicações de acesso aberto</h1>
          <p>
            Aceda a revistas científicas e recursos académicos sobre urbanismo e ordenamento do território.
          </p>
        </div>
      </div>
      
      <div className="chapters-container">
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