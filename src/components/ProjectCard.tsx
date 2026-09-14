import React from 'react';
import { ExternalLink, Star, ArrowUpRight, Globe } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (p: Project) => void;
}

const tagColorMap: Record<string, string> = {
  Moderator: 'bg-[#93C5FD] text-black',
  'Public Speaking': 'bg-[#BFDBFE] text-black',
  'Digital Marketing': 'bg-[#99F6E4] text-black',
  'SMK CBM': 'bg-[#FED7AA] text-black',
  Fotografi: 'bg-[#86EFAC] text-black',
  Touring: 'bg-[#FEF08A] text-black',
  'Visual Storytelling': 'bg-[#DDD6FE] text-black',
  Adventure: 'bg-[#FBCFE8] text-black',
  OSPP: 'bg-[#C7D2FE] text-black',
  'Ketua Kesehatan': 'bg-[#BAE6FD] text-black',
  'Pesantren Al-Qur\'aniyyah': 'bg-[#A5F3FC] text-black',
  'Takhosus Al-Qur\'an': 'bg-[#BBF7D0] text-black',
  'Karang Taruna': 'bg-[#FED7AA] text-black',
  Menulis: 'bg-[#FDE047] text-black',
  Membaca: 'bg-[#E2E8F0] text-black',
  Literasi: 'bg-[#93C5FD] text-black',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  return (
    <article
      id={`project-card-${project.id}`}
      className="group relative bg-white dark:bg-[#202024] border-2 border-black rounded-xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between"
    >
      <div>
        {/* Header: Category & Year */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono-code inline-block px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black border-1.5 border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000]">
            {project.category}
          </span>
          <div className="font-mono-code flex items-center gap-2 text-xs font-bold text-black dark:text-white">
            {project.stars && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {project.stars}
              </span>
            )}
            <span>{project.year}</span>
          </div>
        </div>

        {/* Optional preview image if present */}
        {project.image && (
          <div className="mb-4 overflow-hidden rounded-lg border-2 border-black aspect-[16/9] bg-neutral-100 dark:bg-neutral-800">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Title */}
        <h3
          id={`project-title-${project.id}`}
          onClick={() => onSelectProject(project)}
          className="font-display text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white group-hover:text-[#FF6B00] transition-colors cursor-pointer flex items-center justify-between"
        >
          <span>{project.title}</span>
          <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm sm:text-base text-black dark:text-white leading-relaxed font-normal">
          {project.description}
        </p>

        {/* Highlight badge if present */}
        {project.highlight && (
          <div className="mt-3 inline-block px-2.5 py-1 text-xs font-bold bg-[#FEF08A] text-black border border-black rounded-md shadow-[1px_1px_0px_0px_#000000]">
            ✦ {project.highlight}
          </div>
        )}

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => {
            const color = tagColorMap[tag] || 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white';
            return (
              <span
                key={tag}
                className={`font-mono-code text-xs font-semibold px-2 py-0.5 rounded-md border border-black ${color}`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t-2 border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
        <button
          id={`project-details-btn-${project.id}`}
          onClick={() => onSelectProject(project)}
          className="font-display text-xs sm:text-sm font-bold text-black dark:text-white hover:text-[#FF6B00] dark:hover:text-[#FF6B00] underline underline-offset-4 cursor-pointer"
        >
          Lihat Ringkasan & Detail
        </button>

        <div className="flex items-center gap-2">
          {project.liveUrl && (
            <a
              id={`project-live-link-${project.id}`}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-[#FF6B00] text-black border border-black rounded-md shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Linktree</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
