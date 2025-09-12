'use client';

import { useEffect } from 'react';

export default function CategoryImageOverlay() {
  useEffect(() => {
    const overlay = document.getElementById('categoryImageOverlay');
    
    if (!overlay) {
      console.error('Overlay element not found');
      return;
    }

    const handleMouseEnter = (event: Event) => {
      const target = event.target as HTMLElement;
      const imageUrl = target.getAttribute('data-category-image');
      
      console.log('Mouse enter, image URL:', imageUrl);
      
      if (imageUrl && imageUrl.trim() !== '') {
        overlay.style.backgroundImage = `url("${imageUrl}")`;
        overlay.classList.add('visible');
        console.log('Image set and overlay shown');
      }
    };

    const handleMouseLeave = () => {
      console.log('Mouse leave');
      overlay.classList.remove('visible');
    };

    // Use MutationObserver to watch for when category cards are added
    const observer = new MutationObserver(() => {
      const categoryCards = document.querySelectorAll('[data-category-image]');
      console.log('Category cards found:', categoryCards.length);
      
      if (categoryCards.length > 0) {
        categoryCards.forEach((card, index) => {
          console.log(`Adding listeners to card ${index}`);
          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);
        });
        
        // Stop observing once we find the cards
        observer.disconnect();
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also try immediately in case cards are already there
    const categoryCards = document.querySelectorAll('[data-category-image]');
    if (categoryCards.length > 0) {
      console.log('Category cards found immediately:', categoryCards.length);
      categoryCards.forEach((card, index) => {
        console.log(`Adding listeners to card ${index}`);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
