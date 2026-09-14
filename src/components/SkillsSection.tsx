import React from 'react';
import { ProfileData } from '../types';
import { Mic, Camera, Users, BookOpen } from 'lucide-react';

interface SkillsSectionProps {
  skills: ProfileData['skills'];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const categories = [
    {
      title: 'Public Speaking & Moderasi',
      icon: Mic,
      items: skills.frontend,
      accentBg: 'bg-[#93C5FD]',
      badgeColor: 'bg-[#DBEAFE]',
    },
    {
      title: 'Fotografi & Visual Storytelling',
      icon: Camera,
      items: skills.backend,
      accentBg: 'bg-[#86EFAC]',
      badgeColor: 'bg-[#DCFCE7]',
    },
    {
      title: 'Kepemimpinan & Organisasi',
      icon: Users,
      items: skills.databaseAndCloud,
      accentBg: 'bg-[#FDE047]',
      badgeColor: 'bg-[#FEF9C3]',
    },
    {
      title: 'Menulis & Literasi',
      icon: BookOpen,
      items: skills.toolsAndMethods,
      accentBg: 'bg-[#F472B6]',
      badgeColor: 'bg-[#FCE7F3]',
    },
  ];

  return (
    <section id="skills-section" className="w-full max-w-3xl mx-auto px-6 sm:px-8 py-8">
      <div className="mb-6">
        <h2 id="skills-heading" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
          Keahlian & Kompetensi
        </h2>
        <p className="text-sm sm:text-base text-black dark:text-white mt-1">
          Kompetensi terasah melalui pengalaman public speaking, dunia fotografi, kepengurusan organisasi santri, dan literasi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.title}
              className="bg-white dark:bg-[#202024] border-2 border-black rounded-xl p-4 sm:p-5 shadow-[3.5px_3.5px_0px_0px_#000000] transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`p-1.5 ${cat.accentBg} text-black border-1.5 border-black rounded-lg shadow-[1.5px_1.5px_0px_0px_#000000]`}>
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                </span>
                <h3 className="font-display font-bold text-base text-black dark:text-white tracking-tight">
                  {cat.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono-code px-2.5 py-1 text-xs font-semibold text-black border border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000] bg-neutral-100 dark:bg-neutral-100 hover:bg-[#FF6B00] hover:text-black transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
