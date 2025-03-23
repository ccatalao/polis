import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './styles/main.css';

// Import ScrollToTop component
import ScrollToTop from './components/ScrollToTop';
import SearchBar from './components/SearchBar';
import { forceScrollToTop, enableScrolling, fixScrollContainer } from './utils/scroll';

// Import pages (we'll create these next)
import Home from './pages/Home';
import Municipio from './pages/Municipio';
import Projects from './pages/Projects';
import Chapters from './pages/Chapters';
import GeoMapping from './pages/GeoMapping';
import SearchResults from './pages/SearchResults';

// Version: 1.1.4 - Enhanced mobile scroll handling

// Add viewport CSS variable for better mobile height handling
const setViewportHeight = () => {
  // First we get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Navigation tabs component
const NavigationTabs = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };
  
  // Enhanced function to ensure scroll to top when clicking navigation
  const handleNavClick = (e) => {
    // Enable scrolling first in case it was disabled
    enableScrolling();
    
    // Use our enhanced scroll utility
    forceScrollToTop();
    
    // Check if this is a navigation to the map page (where filters need to be visible)
    const isMapLink = e.currentTarget.getAttribute('href') === '/mapping';
    
    // Multiple attempts with short intervals for problematic cases
    const attempts = isMapLink ? 5 : 3;
    
    for (let i = 1; i <= attempts; i++) {
      setTimeout(() => {
        enableScrolling();
        forceScrollToTop();
      }, i * 100);
    }
  };
  
  return (
    <nav className="bottom-nav">
      <Link to="/" className={isActive('/')} onClick={handleNavClick}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="nav-label">Início</span>
      </Link>
      <Link to="/municipio" className={isActive('/municipio')} onClick={handleNavClick}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10" width="16" height="11"></rect>
          <path d="M4 10 L12 3 L20 10"></path>
          <line x1="9" y1="21" x2="9" y2="14"></line>
          <line x1="15" y1="21" x2="15" y2="14"></line>
          <line x1="9" y1="14" x2="15" y2="14"></line>
        </svg>
        <span className="nav-label">Município</span>
      </Link>
      <Link to="/projects" className={isActive('/projects')} onClick={handleNavClick}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <span className="nav-label">Projetos</span>
      </Link>
      <Link to="/mapping" className={isActive('/mapping')} onClick={handleNavClick}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span className="nav-label">Mapa</span>
      </Link>
      <Link to="/chapters" className={isActive('/chapters')} onClick={handleNavClick}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="8" y1="10" x2="14" y2="10"></line>
          <line x1="8" y1="14" x2="16" y2="14"></line>
        </svg>
        <span className="nav-label">Publicações</span>
      </Link>
    </nav>
  );
};

// Layout component that includes navigation
const Layout = ({ children }) => {
  const location = useLocation();
  const appVersion = "1.1.4"; // App version for tracking
  
  // Enhanced useEffect to force scroll to top and handle mobile scrolling issues
  useEffect(() => {
    // Enable scrolling first (in case it was disabled)
    enableScrolling();
    
    // Force scroll to top with our enhanced utility
    forceScrollToTop();
    
    // Check if this is the mapping page (where filters need to be visible)
    const isMappingPage = location.pathname === '/mapping';
    
    // For mapping page, use more aggressive approach
    if (isMappingPage) {
      // Multiple attempts with decreasing intervals
      const intervals = [10, 50, 100, 300, 600];
      intervals.forEach(delay => {
        setTimeout(() => {
          enableScrolling();
          forceScrollToTop();
        }, delay);
      });
    } else {
      // For other pages, fewer attempts are needed
      setTimeout(() => {
        enableScrolling();
        forceScrollToTop();
      }, 100);
    }
    
  }, [location.pathname]);
  
  // Initialize viewport height on mount
  useEffect(() => {
    // Set initial viewport height
    setViewportHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Add scroll touchmove fix for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.addEventListener('touchmove', function(e) {
        // Allow scrolling in content areas
        if (e.target.closest('.app-content')) {
          return;
        }
        
        // Prevent pull-to-refresh and bounce effects outside of content
        if (document.documentElement.scrollTop === 0) {
          e.preventDefault();
        }
      }, { passive: false });
    }
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
  
  // Function to get the title based on the current route path
  const getSectionTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Palmela Polis';
      case '/municipio':
        return 'Município';
      case '/projects':
        return 'Projetos';
      case '/mapping':
        return 'Mapa';
      case '/chapters':
        return 'Publicações';
      case '/search':
        return 'Resultados da Pesquisa';
      default:
        return 'Palmela Polis';
    }
  };
  
  // Function to handle going back to the previous page
  const handleGoBack = () => {
    window.history.back();
  };
  
  // Only show back button if we're not on the home page
  const showBackButton = location.pathname !== '/';
  
  return (
    <div className="app-container" data-version={appVersion}>
      <header className="app-header">
        <div className="container">
          {showBackButton && (
            <button 
              className="header-back-button" 
              onClick={handleGoBack}
              aria-label="Voltar"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="header-title">{getSectionTitle()}</h1>
          <SearchBar />
        </div>
      </header>
      
      <div className="app-content">
        {children}
      </div>
      
      <NavigationTabs />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter basename="/polis">
      <ScrollToTop />
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout>
              <Home />
            </Layout>
          } 
        />
        <Route 
          path="/municipio" 
          element={
            <Layout>
              <Municipio />
            </Layout>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <Layout>
              <Projects />
            </Layout>
          } 
        />
        <Route 
          path="/mapping" 
          element={
            <Layout>
              <GeoMapping />
            </Layout>
          } 
        />
        <Route 
          path="/chapters" 
          element={
            <Layout>
              <Chapters />
            </Layout>
          } 
        />
        <Route 
          path="/search" 
          element={
            <Layout>
              <SearchResults />
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
} 