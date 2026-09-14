import React from 'react';
import { Experience } from '../types';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section id="experience-section" className="w-full max-w-3xl mx-auto px-6 sm:px-8 py-8">
      <div className="mb-6">
        <h2 id="experience-heading" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
          Pengalaman & Rekam Jejak
        </h2>
        <p className="text-sm sm:text-base text-black dark:text-white mt-1">
          Kompetensi profesional sebagai moderator seminar serta kepemimpinan di organisasi santri pesantren dan kemasyarakatan.
        </p>
      </div>

      <div className="space-y-5">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            id={`experience-item-${exp.id}`}
            className="bg-white dark:bg-[#202024] border-2 border-black rounded-xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000000] transition-transform hover:-translate-y-1"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="font-display text-xl font-bold text-black dark:text-white tracking-tight">
                  {exp.role}
                </h3>
                <div className="font-display flex items-center gap-2 text-sm font-bold text-[#FF6B00] dark:text-[#FF7824]">
                  <Briefcase className="w-4 h-4" />
                  <span>{exp.company}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:gap-1 text-xs font-bold text-black dark:text-white">
                <span className="font-mono-code flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white px-2 py-0.5 border border-black rounded shadow-[1px_1px_0px_0px_#000000]">
                  <Calendar className="w-3 h-3" />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1 text-black dark:text-white font-medium">
                  <MapPin className="w-3 h-3" />
                  {exp.location}
                </span>
              </div>
            </div>

            <p className="mt-2 text-sm sm:text-base text-black dark:text-white leading-relaxed font-normal">
              {exp.description}
            </p>

            <ul className="mt-3 space-y-1.5 text-sm text-black dark:text-white">
              {exp.achievements.map((ach, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-[#FF6B00] rounded-full mt-2 shrink-0" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-1.5">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-mono-code px-2 py-0.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-black/50 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
