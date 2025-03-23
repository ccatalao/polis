import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

/**
 * SearchBar component
 * 
 * A collapsible search input that appears when the search icon is clicked.
 * The search icon is displayed in the top banner.
 */
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results page with the search term as query parameter
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      // Hide the search input after search
      setSearchVisible(false);
      setSearchTerm('');
    }
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    // When opening the search, focus the input after a small delay to allow for animation
    if (!searchVisible) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Search icon for the header */}
      <div className="header-search-icon" onClick={toggleSearch} aria-label="Toggle search">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="search-icon"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {/* Expandable search input */}
      <div className={`search-bar ${searchVisible ? 'search-visible' : ''}`}>
        <div className="search-overlay" onClick={() => setSearchVisible(false)}></div>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar em todas as secções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
          />
          <button type="submit" className="search-button" aria-label="Submit search">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchBar; 