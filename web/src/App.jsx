import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './styles.css';

// Import ScrollToTop component
import ScrollToTop from './components/ScrollToTop';
import { forceScrollToTop } from './utils/scroll';

// Import pages (we'll create these next)
import Home from './pages/Home';
import Municipio from './pages/Municipio';
import Projects from './pages/Projects';
import Chapters from './pages/Chapters';
import GeoMapping from './pages/GeoMapping';

// Navigation tabs component
const NavigationTabs = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };
  
  // Function to scroll to top when clicking navigation
  const handleNavClick = () => {
    // Use the utility function to ensure the scroll happens
    forceScrollToTop();
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
  
  // Add useEffect to force scroll to top when location changes
  useEffect(() => {
    // Use the utility function for reliable scroll behavior
    forceScrollToTop();
  }, [location.pathname]);
  
  // Function to get the title based on the current route path
  const getSectionTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Polis';
      case '/municipio':
        return 'Município';
      case '/projects':
        return 'Projetos';
      case '/mapping':
        return 'Mapa';
      case '/chapters':
        return 'Publicações';
      default:
        return 'Polis';
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <h1 className="header-title">{getSectionTitle()}</h1>
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
      </Routes>
    </BrowserRouter>
  );
} 