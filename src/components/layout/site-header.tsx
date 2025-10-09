import React from 'react';
import { Header } from './header';
import { Navbar } from './navbar';

export const SiteHeader: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark">
      <Header />
      <Navbar />
    </div>
  );
};
