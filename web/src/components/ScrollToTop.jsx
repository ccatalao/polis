import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { forceScrollToTop } from '../utils/scroll';

/**
 * ScrollToTop component
 * 
 * This component uses the useLocation hook from react-router-dom to detect
 * when the route changes. When it does, it immediately scrolls the window to the top.
 * This ensures that when users navigate between pages, they always start
 * at the top of the new page.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use the utility function to force scroll to top
    forceScrollToTop();
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop; 