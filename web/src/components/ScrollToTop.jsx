import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { forceScrollToTop, enableScrolling, fixScrollContainer } from '../utils/scroll';

/**
 * ScrollToTop component
 * 
 * Enhanced version that handles PWA-specific scrolling issues.
 * This component ensures proper scrolling behavior on all devices,
 * with special handling for mobile PWAs where scrolling issues are common.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Initialize scroll container fixes once
  useEffect(() => {
    // Fix viewport and scroll container for mobile
    fixScrollContainer();
    
    // Update viewport height on resize
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    // First enable scrolling in case it was disabled
    enableScrolling();
    
    // Force scroll to top with our enhanced function
    forceScrollToTop();
    
    // For mapping page, we need more aggressive scrolling
    const isMappingPage = pathname === '/mapping';
    
    if (isMappingPage) {
      // Multiple attempts with decreasing intervals
      const intervals = [10, 50, 100, 300, 600];
      intervals.forEach(delay => {
        setTimeout(() => {
          forceScrollToTop();
          enableScrolling();
        }, delay);
      });
    } else {
      // For other pages, fewer attempts are needed
      setTimeout(forceScrollToTop, 100);
      setTimeout(forceScrollToTop, 300);
    }
    
    // Store current page for session history handling
    sessionStorage.setItem('currentPage', pathname);
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop; 