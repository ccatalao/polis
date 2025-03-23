/**
 * Utility function to forcefully scroll to the top of the page.
 * Uses multiple methods to ensure maximum browser compatibility.
 */
export const scrollToTop = () => {
  // Direct method
  if (typeof window !== 'undefined') {
    // Primary method
    window.scrollTo(0, 0);
    
    // Alternate method
    if (typeof window.scroll === 'function') {
      window.scroll(0, 0);
    }
    
    // Browser-specific methods
    if (typeof document !== 'undefined') {
      // For Safari
      if (typeof document.body.scrollTop !== 'undefined') {
        document.body.scrollTop = 0;
      }
      
      // For Chrome, Firefox, IE and Opera
      if (typeof document.documentElement.scrollTop !== 'undefined') {
        document.documentElement.scrollTop = 0;
      }
    }
  }
};

/**
 * Utility function to ensure scroll position is at the top.
 * Call this when you need to be absolutely sure the page is scrolled to top.
 */
export const forceScrollToTop = () => {
  // Immediate scroll
  scrollToTop();
  
  // Additional scroll attempts with minimal delay
  setTimeout(() => {
    scrollToTop();
  }, 0);
  
  setTimeout(() => {
    scrollToTop();
  }, 100);
}; 