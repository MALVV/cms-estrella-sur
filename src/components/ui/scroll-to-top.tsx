"use client";

import React from 'react';

export const ScrollToTop: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-yellow-400 dark:bg-yellow-500 text-primary p-3 rounded-full shadow-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 dark:focus:ring-offset-background-dark transition-colors z-50"
      aria-label="Scroll to top"
    >
      <span className="material-symbols-outlined">keyboard_arrow_up</span>
    </button>
  );
};
