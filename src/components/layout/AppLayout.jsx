import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DarkModeToggle } from '../DarkModeToggle';

export const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface dark:bg-gray-950 font-sans flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <DarkModeToggle />
    </div>
  );
};
