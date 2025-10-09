import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2 text-sm font-condensed">
          <p className="font-bold text-sm sm:text-lg">Cambiando infancias. Cambiando vidas.</p>
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">call</span>
              <span className="text-xs sm:text-sm">Llámanos: (612) 123 - 4456</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">mail</span>
              <span className="text-xs sm:text-sm">contact@example.com</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
