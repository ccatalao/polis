/**
 * Utility function to scroll to the top of the page
 * Using multiple methods for maximum compatibility
 */
export const scrollToTop = () => {
  // Modern browsers
  if (window.scrollTo) {
    window.scrollTo(0, 0);
  }
  
  // For older browsers
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  
  // For Safari
  if (document.body) {
    document.body.scrollTop = 0;
  }
};

/**
 * Aggressively force scrolling to the top using multiple attempts
 * This ensures the page is scrolled to top.
 */
export const forceScrollToTop = () => {
  // Immediate scroll with smooth behavior
  if (window.scrollTo) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  
  // Immediate scroll without smooth behavior as backup
  scrollToTop();
  
  // Additional scroll attempts with delays to ensure it works
  // The first attempt may be blocked by browser optimizations
  setTimeout(() => {
    scrollToTop();
  }, 10);
  
  setTimeout(() => {
    scrollToTop();
  }, 50);
  
  setTimeout(() => {
    scrollToTop();
  }, 100);
  
  // Final attempt with longer delay
  setTimeout(() => {
    if (window.pageYOffset > 0) {
      window.scrollTo(0, 0);
    }
  }, 200);
}; 