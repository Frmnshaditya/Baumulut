import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { WorkView } from './components/WorkView';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { LoginModal } from './components/LoginModal';
import { PersonalAdminModal } from './components/PersonalAdminModal';
import { initialProfile, initialProjects, initialExperiences } from './data/portfolioData';
import { ProfileData, Project, CVFileInfo } from './types';
import { checkIsAuthenticated, setAuthenticatedSession } from './utils/authService';
import {
  subscribeToProfile,
  subscribeToProjects,
  subscribeToCV,
  saveProfileToFirestore,
  saveProjectsToFirestore,
  saveCVToFirestore,
  deleteCVFromFirestore,
  testFirestoreConnection,
} from './lib/firebase';
import { ShieldCheck, LogOut, Cloud } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'work'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Firestore connection state
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Auth & Admin modals state (PIN-based authentication)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => checkIsAuthenticated());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isPersonalAdminOpen, setIsPersonalAdminOpen] = useState<boolean>(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved) return saved === 'dark';
    } catch {
      // ignore
    }
    return false;
  });

  // Profile data state - 100% Cloud Firestore authoritative
  const [profile, setProfile] = useState<ProfileData>(initialProfile);

  // Projects data state - 100% Cloud Firestore authoritative
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // 1. Check connection & clear legacy local storage data
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    // Clean up legacy localStorage items so data is exclusively from Cloud Firestore
    try {
      localStorage.removeItem('portfolio_profile');
      localStorage.removeItem('portfolio_projects');
      localStorage.removeItem('neobrutalism_portfolio_custom_cv');
    } catch {
      // ignore
    }
  }, []);

  // 2. Real-time Cloud Firestore Listeners (Profile, Projects, and CV)
  useEffect(() => {
    const unsubscribeProfile = subscribeToProfile((cloudProfile) => {
      setProfile((prev) => ({
        ...cloudProfile,
        cvFile: prev.cvFile, // CV is managed via dedicated realtime subscribeToCV
      }));
    });

    const unsubscribeProjects = subscribeToProjects((cloudProjects) => {
      if (cloudProjects && cloudProjects.length > 0) {
        setProjects(cloudProjects);
      }
    });

    const unsubscribeCV = subscribeToCV((cloudCV) => {
      setProfile((prev) => ({
        ...prev,
        cvFile: cloudCV || undefined,
      }));
    });

    return () => {
      unsubscribeProfile();
      unsubscribeProjects();
      unsubscribeCV();
    };
  }, []);

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('portfolio_theme', 'dark');
      } catch {
        // ignore
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('portfolio_theme', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDarkMode]);

  const handleSaveProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);

    // Save directly to Google Cloud Firestore
    saveProfileToFirestore(newProfile).catch((err) => {
      console.warn('Could not sync profile to Firebase Firestore:', err);
    });

    if (newProfile.cvFile) {
      saveCVToFirestore(newProfile.cvFile).catch((err) => {
        console.warn('Could not sync CV to Firebase Firestore:', err);
      });
    } else {
      deleteCVFromFirestore().catch((err) => {
        console.warn('Could not delete CV from Firebase Firestore:', err);
      });
    }
  };

  const handleSaveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);

    // Save directly to Google Cloud Firestore
    saveProjectsToFirestore(newProjects).catch((err) => {
      console.warn('Could not sync projects to Firebase Firestore:', err);
    });
  };

  const handleUpdateCV = (cvInfo: CVFileInfo) => {
    const updated = { ...profile, cvFile: cvInfo };
    setProfile(updated);
    saveCVToFirestore(cvInfo).catch((err) => {
      console.warn('Could not sync CV to Firebase Firestore:', err);
    });
  };

  // Auth handlers
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setIsPersonalAdminOpen(true);
  };

  const handleLogout = () => {
    setAuthenticatedSession(false);
    setIsLoggedIn(false);
    setIsPersonalAdminOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FF6B00] selection:text-black text-black dark:text-white relative bg-[#FFFDF9] dark:bg-[#121214] transition-colors duration-200">
      {/* Top Floating Neobrutalist Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isLoggedIn={isLoggedIn}
        isFirebaseConnected={isFirebaseConnected}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenPersonalAdmin={() => setIsPersonalAdminOpen(true)}
      />

      {/* Floating Logged-in Admin Banner Indicator */}
      {isLoggedIn && (
        <div
          id="admin-status-toast"
          className="fixed bottom-4 right-4 z-40 bg-black text-white border-2 sm:border-3 border-[#FF6B00] rounded-xl p-2.5 sm:px-3 sm:py-2 shadow-[4px_4px_0px_0px_#FF6B00] flex items-center gap-2.5 animate-in slide-in-from-bottom-3"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
            <div className="flex flex-col">
              <span className="font-display text-xs font-bold hidden sm:inline leading-tight">
                Mode Pengelola Aktif
              </span>
              <span className="text-[10px] font-mono-code text-neutral-300 hidden sm:inline flex items-center gap-1">
                <Cloud className="w-3 h-3 text-green-400 inline" />
                Firebase Realtime
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPersonalAdminOpen(true)}
            className="font-display px-2.5 py-1 bg-[#FF6B00] text-black text-xs font-black rounded-md hover:bg-orange-500 cursor-pointer shadow-xs active:scale-95 transition-transform"
          >
            Kelola Portofolio
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Keluar dari sesi pribadi"
            className="p-1 text-neutral-400 hover:text-white cursor-pointer hover:bg-white/10 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full pb-8">
        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            projects={projects}
            experiences={initialExperiences}
            onSelectProject={(p) => setSelectedProject(p)}
            onNavigateToWork={() => {
              setActiveTab('work');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUpdateAvatar={(newUrl) => handleSaveProfile({ ...profile, avatarUrl: newUrl })}
            onUpdateCV={handleUpdateCV}
            isLoggedIn={isLoggedIn}
            onOpenPersonalAdmin={() => setIsPersonalAdminOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            profile={profile}
            experiences={initialExperiences}
            onUpdateCV={handleUpdateCV}
            isLoggedIn={isLoggedIn}
            onOpenPersonalAdmin={() => setIsPersonalAdminOpen(true)}
          />
        )}

        {activeTab === 'work' && (
          <WorkView
            projects={projects}
            profile={profile}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenPersonalAdmin={() => setIsPersonalAdminOpen(true)}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Private Login Modal with PIN Authentication */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Personal Admin Modal for Realtime Cloud Photo, CV & Profile Management */}
      <PersonalAdminModal
        isOpen={isPersonalAdminOpen}
        onClose={() => setIsPersonalAdminOpen(false)}
        profile={profile}
        projects={projects}
        onSaveProfile={handleSaveProfile}
        onSaveProjects={handleSaveProjects}
        onLogout={handleLogout}
        isFirebaseConnected={isFirebaseConnected}
      />
    </div>
  );
}
