import React from 'react';
import { Hero } from './Hero';
import { QuickStats } from './QuickStats';
import { SkillsSection } from './SkillsSection';
import { ProjectCard } from './ProjectCard';
import { ContactSection } from './ContactSection';
import { ProfileData, Project, CVFileInfo, Experience } from '../types';
import { ArrowRight, Flame } from 'lucide-react';

interface HomeViewProps {
  profile: ProfileData;
  projects: Project[];
  experiences?: Experience[];
  onSelectProject: (p: Project) => void;
  onNavigateToWork: () => void;
  onUpdateAvatar?: (newUrl: string) => void;
  onUpdateCV?: (cvInfo: CVFileInfo) => void;
  isLoggedIn?: boolean;
  onOpenPersonalAdmin?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  projects,
  experiences,
  onSelectProject,
  onNavigateToWork,
  onUpdateAvatar,
  onUpdateCV,
  isLoggedIn = false,
  onOpenPersonalAdmin,
}) => {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="w-full">
      {/* 1. Hero Section matching user screenshot with Lanyard ID Card */}
      <Hero
        profile={profile}
        onUpdateAvatar={onUpdateAvatar}
        onUpdateCV={onUpdateCV}
        experiences={experiences}
        isLoggedIn={isLoggedIn}
        onOpenPersonalAdmin={onOpenPersonalAdmin}
      />

      {/* 2. Key Highlights / Quick Stats */}
      <QuickStats />

      {/* 3. Featured Work */}
      <section id="featured-work-section" className="w-full max-w-3xl mx-auto px-6 sm:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#FF6B00] border border-black rounded-md">
                <Flame className="w-4 h-4 text-black stroke-[2.5]" />
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
                Karya & Dokumentasi Unggulan
              </h2>
            </div>
            <p className="text-sm sm:text-base text-black dark:text-white mt-1">
              Dokumentasi terpilih: Moderator seminar digital marketing, fotografi petualangan touring, dan kepemimpinan organisasi santri.
            </p>
          </div>

          <button
            id="view-all-projects-btn"
            onClick={onNavigateToWork}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold bg-[#FF6B00] text-black border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] shrink-0 cursor-pointer"
          >
            <span>Semua Karya</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={onNavigateToWork}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-[#FF6B00] text-black border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] cursor-pointer"
          >
            <span>Jelajahi Semua Karya</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 4. Technical Arsenal */}
      <SkillsSection skills={profile.skills} />

      {/* 5. Contact Section */}
      <ContactSection profile={profile} />
    </div>
  );
};
