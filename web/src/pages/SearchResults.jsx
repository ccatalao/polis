import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../styles/main.css';
import { forceScrollToTop } from '../utils/scroll';

// Import all JSON data
import projectsData from '../data/projects.json';
import municipioData from '../data/municipio.json';
import chaptersData from '../data/chapters.json';
import mappingData from '../data/mappingData.json';

// Helper function to get the query parameter
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Function to highlight text based on search term
const HighlightText = ({ text, searchTerm, onMatchFound }) => {
  if (!text || !searchTerm) return <>{text}</>;
  
  // Check if the text contains the search term at all
  const containsMatch = text.toLowerCase().includes(searchTerm.toLowerCase());
  
  // Call onMatchFound just once when component mounts, if there's a match
  // Using a proper useEffect with an empty dependency array for mount-only
  React.useEffect(() => {
    if (containsMatch && onMatchFound) {
      onMatchFound();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs only on mount
  
  const parts = text.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the search term (case insensitive)
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <span 
              key={index} 
              className="search-term-highlight" 
              data-search-term={searchTerm}
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

// Function to scroll to a specific element by ID
const scrollToElement = (elementId) => {
  // Small delay to ensure the page has loaded
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Add a temporary highlight effect
      element.classList.add('highlight-element');
      setTimeout(() => {
        element.classList.remove('highlight-element');
      }, 2000);
    } else {
      // Fallback to top if element isn't found
      forceScrollToTop();
    }
  }, 300);
};

const SearchResults = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const searchTerm = query.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset state when search term changes
    setLoading(true);
    setResults([]);

    if (searchTerm) {
      // Perform search across all data sources
      const term = searchTerm.toLowerCase();
      const searchResults = [];
      
      // Process Projects data
      if (projectsData && projectsData.projects) {
        const projectResults = projectsData.projects
          .filter(project => 
            (project.title && project.title.toLowerCase().includes(term)) || 
            (project.description && project.description.toLowerCase().includes(term)) ||
            (project.features && project.features.some(feature => 
              (typeof feature === 'string' && feature.toLowerCase().includes(term)) ||
              (feature.feature && feature.feature.toLowerCase().includes(term))
            ))
          )
          .map(project => ({
            id: `project-${project.id}`,
            title: project.title,
            description: project.description,
            type: 'projects',
            link: '/projects',
            originalData: project
          }));
        
        searchResults.push(...projectResults);
      }
      
      // Process Municipio data
      if (municipioData && municipioData.municipio) {
        const municipioResults = municipioData.municipio
          .filter(service => 
            (service.title && service.title.toLowerCase().includes(term)) || 
            (service.description && service.description.toLowerCase().includes(term)) ||
            (service.features && service.features.some(feature => 
              feature.feature && feature.feature.toLowerCase().includes(term)
            ))
          )
          .map(service => ({
            id: `municipio-${service.id}`,
            title: service.title,
            description: service.description,
            type: 'municipio',
            link: '/municipio',
            originalData: service
          }));
        
        searchResults.push(...municipioResults);
      }
      
      // Process Chapters data
      if (chaptersData && chaptersData.chapters) {
        // Search in chapter titles and descriptions
        const chapterEntries = Object.entries(chaptersData.chapters);
        
        const chapterResults = chapterEntries
          .filter(([_, chapter]) => 
            (chapter.title && chapter.title.toLowerCase().includes(term)) || 
            (chapter.description && chapter.description.toLowerCase().includes(term))
          )
          .map(([id, chapter]) => ({
            id: `chapter-${id}`,
            title: chapter.title,
            description: chapter.description,
            type: 'chapters',
            link: '/chapters',
            originalData: chapter
          }));
        
        searchResults.push(...chapterResults);
        
        // Search in individual publications within chapters
        chapterEntries.forEach(([chapterId, chapter]) => {
          if (chapter.content) {
            const publicationResults = chapter.content
              .filter(publication => 
                (publication.title && publication.title.toLowerCase().includes(term)) || 
                (publication.description && publication.description.toLowerCase().includes(term))
              )
              .map(publication => ({
                id: `publication-${publication.id}`,
                title: publication.title,
                description: `${chapter.title} - ${publication.description}`,
                type: 'chapters',
                link: '/chapters',
                originalData: publication,
                parentData: chapter
              }));
            
            searchResults.push(...publicationResults);
          }
        });
      }
      
      // Process Mapping data
      if (mappingData && mappingData.mapping) {
        const mappingResults = mappingData.mapping
          .filter(item => 
            (item.title && item.title.toLowerCase().includes(term)) || 
            (item.description && item.description.toLowerCase().includes(term)) ||
            (item.keywords && item.keywords.some(keyword => 
              keyword.toLowerCase().includes(term)
            ))
          )
          .map(item => ({
            id: `mapping-${item.id}`,
            title: item.title,
            description: item.description,
            type: 'mapping',
            link: '/mapping',
            originalData: item
          }));
        
        searchResults.push(...mappingResults);
      }
      
      // Update state with search results
      setResults(searchResults);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [searchTerm]);

  // Function to handle result click
  const handleResultClick = (result) => {
    // Find the most relevant matches within the title and description
    let matchingSegments = [];
    const term = searchTerm.toLowerCase();
    
    // Helper function to extract context around the match (50 chars before and after)
    const extractMatchContext = (text, term) => {
      const lowerText = text.toLowerCase();
      const termIndex = lowerText.indexOf(term);
      if (termIndex === -1) return null;
      
      // Get context around the match (50 characters before and after)
      const startPos = Math.max(0, termIndex - 50);
      const endPos = Math.min(text.length, termIndex + term.length + 50);
      
      return {
        fullText: text,
        matchedText: text.substring(startPos, endPos),
        exactMatch: text.substring(termIndex, termIndex + term.length),
        position: termIndex,
        startPos: startPos,
        endPos: endPos
      };
    };
    
    // Process title matches with context
    if (result.title.toLowerCase().includes(term)) {
      const context = extractMatchContext(result.title, term);
      if (context) {
        matchingSegments.push({
          field: 'title',
          text: result.title,
          matchedText: context.matchedText,
          exactMatch: context.exactMatch,
          position: context.position
        });
      }
    }
    
    // Process description matches with context
    if (result.description.toLowerCase().includes(term)) {
      const context = extractMatchContext(result.description, term);
      if (context) {
        matchingSegments.push({
          field: 'description',
          text: result.description,
          matchedText: context.matchedText,
          exactMatch: context.exactMatch,
          position: context.position
        });
      }
    }
    
    // Sort matches by field priority (title > description) and then by position
    matchingSegments.sort((a, b) => {
      if (a.field === 'title' && b.field !== 'title') return -1;
      if (a.field !== 'title' && b.field === 'title') return 1;
      return a.position - b.position;
    });
    
    // Store search term and result info in sessionStorage
    sessionStorage.setItem('lastSearch', searchTerm);
    sessionStorage.setItem('lastSearchResultId', result.id);
    
    // Store additional information about the content that matched
    const matchInfo = {
      term: searchTerm,
      elementId: result.id,
      type: result.type,
      title: result.title,
      description: result.description,
      matches: matchingSegments,
      exactText: matchingSegments.length > 0 ? 
                matchingSegments[0].matchedText || matchingSegments[0].text : '',
      exactMatch: matchingSegments.length > 0 ? matchingSegments[0].exactMatch : searchTerm
    };
    sessionStorage.setItem('searchMatchInfo', JSON.stringify(matchInfo));
    
    // Navigate to the target page
    navigate(result.link);
  };

  // Track which result components have found matches
  const [foundMatches, setFoundMatches] = useState({});
  
  // Simplified handleMatchFound function that doesn't rely on text content
  const handleMatchFound = (resultId, field) => {
    // This is now only called on component mount
    setFoundMatches(prev => ({
      ...prev,
      [resultId]: {
        ...prev[resultId],
        [field]: true
      }
    }));
  };

  // Function to get an icon based on the result type
  const getIconForType = (type) => {
    switch(type) {
      case 'municipio':
        return (
          <svg className="result-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="10" width="16" height="11"></rect>
            <path d="M4 10 L12 3 L20 10"></path>
          </svg>
        );
      case 'projects':
        return (
          <svg className="result-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        );
      case 'mapping':
        return (
          <svg className="result-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        );
      case 'chapters':
        return (
          <svg className="result-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        );
      default:
        return (
          <svg className="result-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        );
    }
  };

  // Function to get type name in Portuguese
  const getTypeName = (type) => {
    switch(type) {
      case 'municipio':
        return 'Município';
      case 'projects':
        return 'Projetos';
      case 'mapping':
        return 'Mapas';
      case 'chapters':
        return 'Publicações';
      default:
        return 'Geral';
    }
  };

  return (
    <div className="full-width-container">
      <div className="introduction full-width">
        <div className="intro-content">
          {searchTerm ? (
            <p>Resultados da pesquisa para: <strong>"{searchTerm}"</strong></p>
          ) : (
            <p>Por favor, introduza um termo de pesquisa para encontrar conteúdo.</p>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">A pesquisar...</p>
        </div>
      ) : (
        <div className="search-results">
          {results.length > 0 ? (
            results.map(result => (
              <div 
                key={result.id} 
                className="search-result-item"
                onClick={() => handleResultClick(result)}
                role="button"
                tabIndex={0}
              >
                <div className="result-icon-container">
                  {getIconForType(result.type)}
                </div>
                <div className="result-content">
                  <h3 className="result-title">
                    <HighlightText 
                      text={result.title} 
                      searchTerm={searchTerm}
                      onMatchFound={() => handleMatchFound(result.id, 'title')}
                    />
                  </h3>
                  <p>
                    <HighlightText 
                      text={result.description} 
                      searchTerm={searchTerm}
                      onMatchFound={() => handleMatchFound(result.id, 'description')}
                    />
                  </p>
                  <div className="result-type">{getTypeName(result.type)}</div>
                </div>
              </div>
            ))
          ) : (
            searchTerm && (
              <div className="no-results">
                <p>Nenhum resultado encontrado para "{searchTerm}".</p>
                <p>Tente procurar por diferentes palavras-chave.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 