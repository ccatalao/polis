import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './styles.css';

// Import pages (we'll create these next)
import Home from './pages/Home';
import Municipio from './pages/Municipio';
import Projects from './pages/Projects';
import Funding from './pages/Funding';
import Chapters from './pages/Chapters';

// Navigation tabs component
const NavigationTabs = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };
  
  return (
    <nav className="bottom-nav">
      <Link to="/" className={isActive('/')}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="nav-label">Home</span>
      </Link>
      <Link to="/municipio" className={isActive('/municipio')}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10" width="16" height="11"></rect>
          <path d="M4 10 L12 3 L20 10"></path>
          <line x1="9" y1="21" x2="9" y2="14"></line>
          <line x1="15" y1="21" x2="15" y2="14"></line>
          <line x1="9" y1="14" x2="15" y2="14"></line>
        </svg>
        <span className="nav-label">Município</span>
      </Link>
      <Link to="/projects" className={isActive('/projects')}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <span className="nav-label">Projetos</span>
      </Link>
      <Link to="/funding" className={isActive('/funding')}>
        <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 8h-6a2 2 0 0 0-2 2v1M8 14h5a2 2 0 0 0 2-2v-1"></path>
          <line x1="7" y1="10" x2="16" y2="10"></line>
          <line x1="7" y1="14" x2="16" y2="14"></line>
        </svg>
        <span className="nav-label">Financiamento</span>
      </Link>
      <Link to="/chapters" className={isActive('/chapters')}>
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
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <Link to="/" className="logo-link">
            <div className="logo">Polis</div>
          </Link>
        </div>
      </header>
      
      <main className="app-content">
        {children}
      </main>
      
      <NavigationTabs />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter basename="/polis">
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
          path="/funding" 
          element={
            <Layout>
              <Funding />
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