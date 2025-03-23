/**
 * Utility to highlight search term occurrences on a page
 * This handles highlighting search terms when a user navigates from search results
 */

/**
 * Check session storage for a search term and highlight it on the page
 */
export const highlightSearchTerm = () => {
  // Check if we have a search term in sessionStorage
  const searchTerm = sessionStorage.getItem('lastSearch');
  if (!searchTerm || searchTerm.trim() === '') return;
  
  // Get detailed match info if available
  let matchInfo = null;
  try {
    const matchInfoStr = sessionStorage.getItem('searchMatchInfo');
    if (matchInfoStr) {
      matchInfo = JSON.parse(matchInfoStr);
    }
  } catch (error) {
    console.error('Error parsing search match info:', error);
  }
  
  // Wait longer for DOM to be fully loaded
  setTimeout(() => {
    console.log('Searching for term:', searchTerm);
    if (matchInfo) {
      console.log('Match info:', matchInfo);
    }
    
    // First, try to directly find the element by ID from the matchInfo
    if (matchInfo && matchInfo.elementId) {
      const targetElement = document.getElementById(matchInfo.elementId);
      if (targetElement) {
        console.log('Found target element by ID:', matchInfo.elementId);
        processCardElement(targetElement, searchTerm, matchInfo);
        return; // Exit early if we found the exact element
      } else {
        console.log('Element not found with ID:', matchInfo.elementId);
      }
    }
    
    // If direct ID lookup fails, try to find the card with the exact text from matchInfo
    if (matchInfo && (matchInfo.exactText || matchInfo.matches?.length > 0)) {
      // First try to find a card with the exact match text
      const exactMatchText = matchInfo.exactText || matchInfo.matches[0]?.text;
      console.log('Looking for exact match text:', exactMatchText);
      
      if (exactMatchText) {
        // Try to find elements containing this exact text
        const textNodes = [];
        findTextNodesContaining(document.body, exactMatchText, textNodes);
        
        if (textNodes.length > 0) {
          console.log(`Found ${textNodes.length} nodes containing the exact text`);
          
          // Find the closest content card ancestor
          let closestCard = null;
          for (const textNode of textNodes) {
            const card = findCardAncestor(textNode.parentNode);
            if (card) {
              console.log('Found card containing the exact text:', card.id || 'unnamed card');
              processCardElement(card, searchTerm, matchInfo, textNode.parentNode);
              return; // Exit early once we find the first matching card
            }
          }
        }
      }
    }
    
    // If exact text lookup fails, find all potential content cards
    const contentCards = document.querySelectorAll(
      '.content-card, .search-result-item, .mobile-fullwidth, [id^="project-"], [id^="municipio-"], [id^="chapter-"], [id^="publication-"]'
    );
    
    console.log('Found', contentCards.length, 'potential content cards');
    
    if (contentCards.length === 0) {
      console.log('No cards found, trying broader selectors');
      // If no cards are found, try with a more general approach
      processAllPageContent(searchTerm, matchInfo);
      return;
    }
    
    let bestMatchCard = null;
    let bestMatchElement = null;
    let bestMatchScore = 0;
    
    // Process each card to find the one with the best match
    contentCards.forEach(card => {
      // Look for all text elements within this card
      const textElements = card.querySelectorAll('h3, p, .feature-text, .feature-list-item, a');
      
      textElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        const term = searchTerm.toLowerCase();
        
        // If this element contains the search term
        if (text.includes(term)) {
          let score = 1; // Base score for containing the term
          
          // Increase score if this element also contains the title or description from matchInfo
          if (matchInfo) {
            if (matchInfo.title && text.includes(matchInfo.title.toLowerCase())) {
              score += 5;
            }
            if (matchInfo.description && text.includes(matchInfo.description.toLowerCase())) {
              score += 3;
            }
            
            // Increase score for exact matches from matchInfo
            if (matchInfo.exactText && text.includes(matchInfo.exactText.toLowerCase())) {
              score += 10;
            }
            
            // Check each match from the matches array
            if (matchInfo.matches && matchInfo.matches.length > 0) {
              for (const match of matchInfo.matches) {
                if (match.text && text.includes(match.text.toLowerCase())) {
                  score += 8;
                  break;
                }
              }
            }
          }
          
          // Increase score if the term appears multiple times
          const termCount = (text.match(new RegExp(term, 'gi')) || []).length;
          score += termCount * 2;
          
          // If this is a heading (h3), give it more weight
          if (element.tagName.toLowerCase() === 'h3') {
            score += 3;
          }
          
          // If the card ID matches the element ID from matchInfo, give it a huge boost
          if (matchInfo && matchInfo.elementId && card.id === matchInfo.elementId) {
            score += 50;
          }
          
          // Update best match if this score is higher
          if (score > bestMatchScore) {
            bestMatchScore = score;
            bestMatchCard = card;
            bestMatchElement = element;
          }
        }
      });
    });
    
    // If we found a matching card
    if (bestMatchCard) {
      console.log('Found best match card:', bestMatchCard.id || 'unnamed card', 'with score:', bestMatchScore);
      processCardElement(bestMatchCard, searchTerm, matchInfo, bestMatchElement);
    } else {
      console.log('No matching card found for term:', searchTerm);
      // As a fallback, try with all content
      processAllPageContent(searchTerm, matchInfo);
    }
    
    // Clear the search information after highlighting
    clearSearchSession();
  }, 800); // Longer delay to ensure page is fully loaded
};

// Helper function to find text nodes containing specific text
function findTextNodesContaining(element, searchText, results) {
  if (!element) return;
  
  const childNodes = element.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    
    // Check if this is a text node containing our search text
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.toLowerCase().includes(searchText.toLowerCase())) {
        results.push(node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Recursively search child elements
      findTextNodesContaining(node, searchText, results);
    }
  }
}

// Helper function to find the closest card ancestor
function findCardAncestor(element) {
  if (!element) return null;
  
  let current = element;
  while (current && current !== document.body) {
    // Check if this element is a card
    if (
      current.classList.contains('content-card') || 
      current.classList.contains('mobile-fullwidth') ||
      current.classList.contains('search-result-item') ||
      (current.id && (
        current.id.startsWith('project-') || 
        current.id.startsWith('municipio-') || 
        current.id.startsWith('chapter-') || 
        current.id.startsWith('publication-')
      ))
    ) {
      return current;
    }
    current = current.parentElement;
  }
  
  return null;
}

// Helper function to process a card element
function processCardElement(card, searchTerm, matchInfo, bestMatchElement = null) {
  // Apply highlighting to all occurrences within this card
  const textElements = card.querySelectorAll('h3, p, .feature-text, .feature-list-item, a');
  let foundHighlight = false;
  
  textElements.forEach(element => {
    if (element.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
      // Mark this as a match container
      element.classList.add('search-match-container');
      
      // Get the original HTML content
      const originalHTML = element.innerHTML;
      
      // Replace the text with highlighted version (case insensitive)
      const highlightedHTML = originalHTML.replace(
        new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
        '<span class="search-term-highlight">$1</span>'
      );
      
      // Set the new HTML content
      element.innerHTML = highlightedHTML;
      foundHighlight = true;
    }
  });
  
  // Scroll to the card with additional styling to draw attention
  card.classList.add('highlight-card');
  
  // Ensure the card is in view - adjust scroll position to account for fixed header and nav
  const scrollOptions = { 
    behavior: 'smooth', 
    block: 'center'
  };
  
  // First make sure we're at a good scroll position
  card.scrollIntoView(scrollOptions);
  
  // Find and flash the specific matching element within the card
  const elementToFlash = bestMatchElement || 
                         findBestMatchingElement(card, searchTerm) || 
                         (textElements.length > 0 ? textElements[0] : null);
  
  if (elementToFlash) {
    // Add a brief delay to ensure scrolling has completed
    setTimeout(() => {
      elementToFlash.classList.add('search-match-flash');
      
      // Ensure this specific element is visible
      elementToFlash.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      
      setTimeout(() => {
        elementToFlash.classList.remove('search-match-flash');
      }, 2000);
    }, 300);
  }
}

// Find the best matching element in a card based on the search term
function findBestMatchingElement(card, searchTerm) {
  // Look for elements containing the search term
  const elements = [];
  const textNodes = [];
  findTextNodesContaining(card, searchTerm, textNodes);
  
  // Convert text nodes to their parent elements
  for (const node of textNodes) {
    if (node.parentElement) {
      elements.push(node.parentElement);
    }
  }
  
  // If we found any elements, return the first one
  if (elements.length > 0) {
    return elements[0];
  }
  
  return null;
}

// Fallback function to process all content on the page
function processAllPageContent(searchTerm, matchInfo) {
  // Target all content elements on the page
  const contentElements = document.querySelectorAll('.content-info h3, .content-info p, .feature-list-item, .feature-text, .intro-content p, .data-info p');
  
  let firstMatchElement = null;
  
  // Process all elements
  contentElements.forEach(element => {
    if (element.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
      // Mark as a match
      element.classList.add('search-match-container');
      
      // Save first match for scrolling
      if (!firstMatchElement) {
        firstMatchElement = element;
      }
      
      // Highlight text
      const originalHTML = element.innerHTML;
      const highlightedHTML = originalHTML.replace(
        new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
        '<span class="search-term-highlight">$1</span>'
      );
      element.innerHTML = highlightedHTML;
    }
  });
  
  // Scroll to the first match if found
  if (firstMatchElement) {
    firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstMatchElement.classList.add('search-match-flash');
    setTimeout(() => {
      firstMatchElement.classList.remove('search-match-flash');
    }, 2000);
  }
}

// Clear search session storage
function clearSearchSession() {
  // Clear with a delay to allow the UI to update first
  setTimeout(() => {
    sessionStorage.removeItem('lastSearch');
    sessionStorage.removeItem('lastSearchResultId');
    sessionStorage.removeItem('searchMatchInfo');
  }, 2000); // Extend delay to ensure highlighting is visible for longer
} 