import React from 'react';
import { F1LogoIcon } from './icons';
import type { View } from '../App';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  view: View;
  activeView: View;
  onClick: (view: View) => void;
}> = ({ label, view, activeView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
      activeView === view
        ? 'bg-red-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {label}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  return (
    <header className="bg-gray-800/30 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <F1LogoIcon className="h-8 w-auto text-red-500" />
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
              Interactive Race Visualizer
            </h1>
          </div>
          <nav className="flex items-center space-x-2 bg-gray-900/50 p-1 rounded-lg">
            <NavButton label="Driver Stats" view="stats" activeView={activeView} onClick={setActiveView} />
            <NavButton label="Lap Simulation" view="simulation" activeView={activeView} onClick={setActiveView} />
            <NavButton label="Race Strategy" view="strategy" activeView={activeView} onClick={setActiveView} />
          </nav>
        </div>
      </div>
    </header>
  );
};