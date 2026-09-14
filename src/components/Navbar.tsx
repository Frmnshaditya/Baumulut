import React from 'react';
import { Moon, Sun, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'about' | 'work';
  setActiveTab: (tab: 'home' | 'about' | 'work') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenCustomize: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenCustomize,
}) => {
  return (
    <header className="sticky top-6 z-40 flex justify-center px-4 w-full" id="main-header">
      <nav
        id="navbar-pill"
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-[#FF6B00] border-2 border-black rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_0px_#000000] transition-transform duration-150 select-none"
      >
        {/* Home Tab */}
        <button
          id="nav-tab-home"
          onClick={() => setActiveTab('home')}
          className={`font-display px-3.5 sm:px-4 py-1.5 text-sm sm:text-base font-bold text-black tracking-tight transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'border-2 border-black rounded-lg bg-[#FF6B00] shadow-[1.5px_1.5px_0px_0px_#000000]'
              : 'border-2 border-transparent hover:border-black/30 rounded-lg'
          }`}
        >
          Home
        </button>

        {/* About Tab */}
        <button
          id="nav-tab-about"
          onClick={() => setActiveTab('about')}
          className={`font-display px-3.5 sm:px-4 py-1.5 text-sm sm:text-base font-bold text-black tracking-tight transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'border-2 border-black rounded-lg bg-[#FF6B00] shadow-[1.5px_1.5px_0px_0px_#000000]'
              : 'border-2 border-transparent hover:border-black/30 rounded-lg'
          }`}
        >
          About
        </button>

        {/* Work Tab */}
        <button
          id="nav-tab-work"
          onClick={() => setActiveTab('work')}
          className={`font-display px-3.5 sm:px-4 py-1.5 text-sm sm:text-base font-bold text-black tracking-tight transition-all cursor-pointer ${
            activeTab === 'work'
              ? 'border-2 border-black rounded-lg bg-[#FF6B00] shadow-[1.5px_1.5px_0px_0px_#000000]'
              : 'border-2 border-transparent hover:border-black/30 rounded-lg'
          }`}
        >
          Work
        </button>

        {/* Dark Mode Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={() => setIsDarkMode((prev) => !prev)}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
          className="p-1.5 sm:p-2 text-black hover:bg-black/10 rounded-lg transition-colors cursor-pointer border-2 border-transparent hover:border-black/30 ml-1"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Moon className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>

        {/* Quick Edit / Personalize Button */}
        <button
          id="customize-toggle-btn"
          onClick={onOpenCustomize}
          title="Customize profile info"
          aria-label="Customize profile"
          className="p-1.5 sm:p-2 text-black hover:bg-black/10 rounded-lg transition-colors cursor-pointer border-2 border-transparent hover:border-black/30"
        >
          <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </nav>
    </header>
  );
};
