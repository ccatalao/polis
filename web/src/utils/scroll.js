/**
 * Enhanced scroll utilities with special mobile handling
 * This file provides functions to handle scrolling across different platforms reliably
 */

// Detect if we're on a mobile device
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (window.innerWidth <= 768);
};

// Detect if we're in PWA mode
const isPWAMode = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
};

/**
 * Force scroll to top with multiple techniques for maximum compatibility
 * This uses multiple approaches to ensure scrolling works across all platforms
 */
export const forceScrollToTop = () => {
  // Immediate scroll with different methods
  window.scrollTo(0, 0);
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  
  if (document.body) {
    document.body.scrollTop = 0;
  }
  
  // If in a mobile PWA context, use more aggressive techniques
  if (isMobileDevice() && isPWAMode()) {
    // Try with requestAnimationFrame for better timing on mobile
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      
      // iOS sometimes needs position:fixed temporarily
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const scrollRoot = document.querySelector('#root');
        if (scrollRoot) {
          // Temporarily prevent scrolling
          const originalStyle = scrollRoot.style.cssText;
          scrollRoot.style.position = 'fixed';
          scrollRoot.style.width = '100%';
          scrollRoot.style.height = '100%';
          scrollRoot.style.top = '0';
          scrollRoot.style.overflow = 'hidden';
          
          // Re-enable scrolling after a short delay
          setTimeout(() => {
            scrollRoot.style.cssText = originalStyle;
            window.scrollTo(0, 0);
          }, 50);
        }
      }
    });
  }
};

/**
 * Enable scrolling on a page
 * This fixes issues where scrolling gets disabled on mobile
 */
export const enableScrolling = () => {
  const body = document.body;
  const html = document.documentElement;
  
  // Remove any inline styles that might be blocking scrolling
  body.style.removeProperty('position');
  body.style.removeProperty('overflow');
  body.style.removeProperty('height');
  body.style.removeProperty('touch-action');
  
  html.style.removeProperty('position');
  html.style.removeProperty('overflow');
  html.style.removeProperty('height');
  html.style.removeProperty('touch-action');
  
  // Ensure touch-action is set to allow scrolling
  body.style.touchAction = 'auto';
  html.style.touchAction = 'auto';
  
  // Reset any scroll locks that might be set by iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.scrollTo(0, 1);
    window.scrollTo(0, 0);
  }
};

/**
 * Fix scroll container for mobile PWAs
 * This addresses common PWA scrolling issues especially on iOS
 */
export const fixScrollContainer = () => {
  if (isMobileDevice()) {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Ensure content is scrollable
    const root = document.getElementById('root');
    if (root) {
      root.style.minHeight = `calc(100 * var(--vh))`;
      root.style.overflowY = 'auto';
      root.style.webkitOverflowScrolling = 'touch'; // For iOS momentum scrolling
    }
    
    // Fix iOS PWA bouncing/scrolling issues
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && isPWAMode()) {
      document.addEventListener('touchmove', (e) => {
        // Allow default scrolling in scrollable elements
        const target = e.target;
        const scrollableParent = findScrollableParent(target);
        if (!scrollableParent || scrollableParent.scrollHeight <= scrollableParent.clientHeight) {
          // Only prevent default if we're at the edge of scrolling to prevent bouncing
          const atTop = scrollableParent ? scrollableParent.scrollTop <= 0 : true;
          const atBottom = scrollableParent ? 
            scrollableParent.scrollHeight - scrollableParent.scrollTop <= scrollableParent.clientHeight + 1 : true;
          
          if ((atTop && e.touches[0].screenY > 0) || (atBottom && e.touches[0].screenY < 0)) {
            e.preventDefault();
          }
        }
      }, { passive: false });
    }
  }
};

// Helper to find scrollable parent element
const findScrollableParent = (element) => {
  if (!element) return null;
  
  // Check if element is scrollable
  const style = window.getComputedStyle(element);
  const overflowY = style.getPropertyValue('overflow-y');
  const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
  
  if (isScrollable && element.scrollHeight > element.clientHeight) {
    return element;
  }
  
  // Check parent
  return element.parentElement ? findScrollableParent(element.parentElement) : null;
}; 