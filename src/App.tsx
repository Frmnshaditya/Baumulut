import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { WorkView } from './components/WorkView';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { CustomizeModal } from './components/CustomizeModal';
import { initialProfile, initialProjects, initialExperiences } from './data/portfolioData';
import { ProfileData, Project, CVFileInfo } from './types';
import { loadCustomCVLocally, saveCustomCVLocally } from './utils/pdfService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'work'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolio_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  // Profile data state
  const [profile, setProfile] = useState<ProfileData>(() => {
    const storedCV = loadCustomCVLocally();
    try {
      const saved = localStorage.getItem('portfolio_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If stored profile is the old John Doe template, switch directly to Asqi Faizul Ikmaludin
        if (parsed && parsed.name && parsed.name !== 'John Doe') {
          if (!parsed.cvFile && storedCV) {
            parsed.cvFile = storedCV;
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    const initial = { ...initialProfile };
    if (storedCV) {
      initial.cvFile = storedCV;
    }
    return initial;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio_theme', 'light');
    }
  }, [isDarkMode]);

  const handleSaveProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
    if (newProfile.cvFile) {
      saveCustomCVLocally(newProfile.cvFile);
    }
    localStorage.setItem('portfolio_profile', JSON.stringify(newProfile));
  };

  const handleUpdateCV = (cvInfo: CVFileInfo) => {
    const updated = { ...profile, cvFile: cvInfo };
    handleSaveProfile(updated);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FF6B00] selection:text-black text-black dark:text-white">
      {/* Top Floating Neobrutalist Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full pb-8">
        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            projects={initialProjects}
            experiences={initialExperiences}
            onSelectProject={(p) => setSelectedProject(p)}
            onNavigateToWork={() => {
              setActiveTab('work');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUpdateAvatar={(newUrl) => handleSaveProfile({ ...profile, avatarUrl: newUrl })}
            onUpdateCV={handleUpdateCV}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            profile={profile}
            experiences={initialExperiences}
            onUpdateCV={handleUpdateCV}
          />
        )}

        {activeTab === 'work' && (
          <WorkView
            projects={initialProjects}
            profile={profile}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer profile={profile} />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Customize Drawer / Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
