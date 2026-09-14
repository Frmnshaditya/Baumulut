import React from 'react';
import { Moon, Sun, Lock, ShieldCheck, Cloud } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'about' | 'work';
  setActiveTab: (tab: 'home' | 'about' | 'work') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isLoggedIn: boolean;
  isFirebaseConnected?: boolean;
  onOpenLogin: () => void;
  onOpenPersonalAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  isLoggedIn,
  isFirebaseConnected = true,
  onOpenLogin,
  onOpenPersonalAdmin,
}) => {
  return (
    <header className="sticky top-4 sm:top-6 z-40 flex justify-center px-4 w-full" id="main-header">
      <nav
        id="navbar-pill"
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-[#FF6B00] border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] transition-transform duration-150 select-none"
      >
        {/* Home Tab */}
        <button
          id="nav-tab-home"
          onClick={() => setActiveTab('home')}
          className={`font-display px-3 sm:px-4 py-1.5 text-xs sm:text-sm md:text-base font-extrabold text-black tracking-tight transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'border-2 border-black rounded-lg bg-[#FF6B00] shadow-[1.5px_1.5px_0px_0px_#000000] scale-105'
              : 'border-2 border-transparent hover:border-black/30 rounded-lg'
          }`}
        >
          Home
        </button>

        {/* About Tab */}
        <button
          id="nav-tab-about"
          onClick={() => setActiveTab('about')}
          className={`font-display px-3 sm:px-4 py-1.5 text-xs sm:text-sm md:text-base font-extrabold text-black tracking-tight transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'border-2 border-black rounded-lg bg-[#FF6B00] shadow-[1.5px_1.5px_0px_0px_#000000] scale-105'
              : 'border-2 border-transparent hover:border-black/30 rounded-lg'
          }`}
        >
          About
        </button>

        {/* Work Tab */}
        <button
          id="nav-tab-work"
          onClick={() => setActiveTab('work')}
          className={`font-display px-3 sm:px-4 py-1.5 text-xs sm:text-sm md:text-base font-extrabold text-black tracking-tight transition-all cursor-pointer ${
            activeTab === 'work'
              ? 'border-2 border-black rounded-lg bg-[#FF6B00] shadow-[1.5px_1.5px_0px_0px_#000000] scale-105'
              : 'border-2 border-transparent hover:border-black/30 rounded-lg'
          }`}
        >
          Work
        </button>

        {/* Dark Mode Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={() => setIsDarkMode((prev) => !prev)}
          title={isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
          aria-label="Toggle theme"
          className="p-1.5 sm:p-2 text-black hover:bg-black/10 rounded-lg transition-transform active:scale-90 cursor-pointer border-2 border-transparent hover:border-black/30 ml-1"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          )}
        </button>

        {/* Cloud Sync Status Indicator */}
        <div
          title={isFirebaseConnected ? 'Cloud Realtime Firestore Terhubung' : 'Mode Offline'}
          className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-black/10 border border-black/20 rounded-md text-[10px] font-mono-code font-bold text-black"
        >
          <Cloud className="w-3.5 h-3.5 text-black" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
          <span>Realtime</span>
        </div>

        {/* Private Login / Personal Admin Portal Button */}
        {isLoggedIn ? (
          <button
            id="personal-admin-toggle-btn"
            onClick={onOpenPersonalAdmin}
            title="Menu Pengelola Pribadi (Input Foto, CV & Data)"
            aria-label="Menu Pengelola Pribadi"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black text-white hover:bg-neutral-800 rounded-lg border-2 border-black transition-transform active:scale-95 shadow-[1.5px_1.5px_0px_0px_#000000] cursor-pointer ml-1"
          >
            <ShieldCheck className="w-4 h-4 text-green-400 stroke-[2.5]" />
            <span className="font-display text-xs font-extrabold hidden sm:inline">
              Pengelola
            </span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </button>
        ) : (
          <button
            id="login-toggle-btn"
            onClick={onOpenLogin}
            title="Masuk Akun Pengelola (PIN)"
            aria-label="Menu Login Pribadi"
            className="p-1.5 sm:p-2 text-black hover:bg-black/10 rounded-lg transition-transform active:scale-95 cursor-pointer border-2 border-transparent hover:border-black/30 ml-1 flex items-center gap-1"
          >
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span className="text-xs font-extrabold font-display hidden lg:inline">Masuk</span>
          </button>
        )}
      </nav>
    </header>
  );
};
