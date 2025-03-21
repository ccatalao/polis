import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Get the root element
const rootElement = document.getElementById('root');

// Create a root
const root = createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Signal that the app is mounted
window.requestAnimationFrame(() => {
  // Wait for one frame after render to ensure DOM is updated
  window.requestAnimationFrame(() => {
    // Signal that the app is ready to display
    if (rootElement.children.length > 0) {
      console.log('React app mounted successfully');
      
      // Hide loading screen
      const loadingContainer = document.querySelector('.loading-container');
      if (loadingContainer) {
        loadingContainer.classList.add('fade-out');
        setTimeout(() => {
          if (loadingContainer.parentNode) {
            loadingContainer.parentNode.removeChild(loadingContainer);
          }
        }, 300);
      }
      
      // Set app ready flag
      if (window.APP_READY !== undefined) {
        window.APP_READY = true;
      }
    }
  });
}); 