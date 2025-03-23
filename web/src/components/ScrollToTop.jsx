import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { forceScrollToTop } from '../utils/scroll';

/**
 * ScrollToTop component
 * 
 * This component uses the useLocation hook from react-router-dom to detect
 * when the route changes. When it does, it aggressively scrolls the window to the top
 * using multiple methods to ensure it works across all browsers and situations.
 * This ensures that when users navigate between pages, they always start
 * at the top of the new page, with all filters and menus visible.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top without smooth behavior for instant results
    window.scrollTo(0, 0);
    
    // Reset any scroll position values directly
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
    
    // Check if this is the mapping page (where filters need to be visible)
    const isMappingPage = pathname === '/mapping';
    
    // Use the utility function as an additional measure
    forceScrollToTop();
    
    // Multiple attempts with short intervals for problematic cases
    const attempts = isMappingPage ? 10 : 5; // More attempts for mapping page
    const interval = isMappingPage ? 30 : 50; // Shorter interval for mapping page
    
    for (let i = 1; i <= attempts; i++) {
      setTimeout(() => {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }, i * interval);
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop; 