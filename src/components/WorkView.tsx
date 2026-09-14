import React, { useState, useMemo } from 'react';
import { Project, ProfileData } from '../types';
import { ProjectCard } from './ProjectCard';
import { ContactSection } from './ContactSection';
import { FolderGit2, Search, Filter } from 'lucide-react';

interface WorkViewProps {
  projects: Project[];
  profile: ProfileData;
  onSelectProject: (p: Project) => void;
}

type CategoryFilter = 'Semua' | 'Public Speaking' | 'Photography' | 'Organization' | 'Writing';

export const WorkView: React.FC<WorkViewProps> = ({ projects, profile, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: CategoryFilter[] = ['Semua', 'Public Speaking', 'Photography', 'Organization', 'Writing'];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCat = selectedCategory === 'Semua' || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="w-full">
      <section id="work-header-section" className="w-full max-w-3xl mx-auto pt-10 pb-6 px-6 sm:px-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1 bg-[#FF6B00] border border-black rounded-md">
            <FolderGit2 className="w-4 h-4 text-black stroke-[2.5]" />
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
            Karya & Dokumentasi
          </h1>
        </div>
        <p className="text-sm sm:text-base text-black dark:text-white">
          Koleksi dokumentasi kegiatan public speaking, karya fotografi petualangan jalanan, kepengurusan organisasi santri, dan literasi.
        </p>

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono-code px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black cursor-pointer transition-transform ${
                  selectedCategory === cat
                    ? 'bg-[#FF6B00] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                    : 'bg-white dark:bg-[#202024] text-black dark:text-white hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000000]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/60 dark:text-neutral-400" />
            <input
              type="text"
              placeholder="Cari kegiatan, topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-[#202024] text-black dark:text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="work-grid-section" className="w-full max-w-3xl mx-auto px-6 sm:px-8 pb-8">
        {filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-[#202024] border-2 border-black rounded-2xl p-10 text-center shadow-[4px_4px_0px_0px_#000000]">
            <Filter className="w-8 h-8 text-[#FF6B00] mx-auto mb-2" />
            <h3 className="font-display font-bold text-lg text-black dark:text-white">Tidak ada karya ditemukan</h3>
            <p className="text-sm text-black dark:text-neutral-400 mt-1">
              Coba sesuaikan kategori filter atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="font-display mt-4 px-4 py-1.5 bg-[#FF6B00] text-black font-bold text-xs border border-black rounded-lg shadow-[2px_2px_0px_0px_#000000]"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <ContactSection profile={profile} />
    </div>
  );
};
