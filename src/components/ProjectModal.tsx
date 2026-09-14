import React from 'react';
import { X, ExternalLink, Calendar, Tag, CheckCircle2, Globe } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const getHighlightsForCategory = (cat: string) => {
    switch (cat) {
      case 'Public Speaking':
        return [
          'Memandu jalannya sesi seminar interaktif bersama pembicara dan ratusan siswa SMK CBM.',
          'Menjembatani sesi diskusi tanya-jawab secara komunikatif, hidup, dan tepat waktu.',
          'Menerapkan teknik public speaking profesional untuk menjaga antusiasme audiens.'
        ];
      case 'Photography':
        return [
          'Mengabadikan setiap detail dan nuansa perjalanan ke dalam narasi visual yang kuat.',
          'Memadukan kecintaan touring jalanan dengan karya fotografi landscape dan humanis.',
          'Pemanfaatan komposisi visual, timing pencahayaan alami, dan narasi cerita perjalanan.'
        ];
      case 'Organization':
        return [
          'Memimpin divisi kesehatan santri dan koordinasi pertolongan pertama (P3K) di pesantren.',
          'Mengawasi kebersihan dan sanitasi asrama santri untuk lingkungan yang sehat dan nyaman.',
          'Aktif dalam kegiatan sosial kemasyarakatan dan pemberdayaan pemuda di Karang Taruna.'
        ];
      case 'Writing':
        return [
          'Medium penting untuk merefleksikan dan mengomunikasikan cerita dan pengalaman hidup.',
          'Menyatukan perspektif dari hobi touring di jalanan dan wawasan luas dari membaca.',
          'Artikulasi pemikiran yang reflektif dan edukatif bagi pembaca.'
        ];
      default:
        return [
          'Dedikasi dan konsistensi tinggi dalam setiap amanah kegiatan.',
          'Komunikasi efektif dan koordinasi tim yang harmonis.',
          'Orientasi pada dampak positif bagi lingkungan sekitar.'
        ];
    }
  };

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="project-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E22] border-3 border-black rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000000] text-black dark:text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="project-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 bg-[#FF6B00] border-2 border-black rounded-lg text-black hover:bg-orange-600 transition-transform active:scale-95 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
          aria-label="Tutup jendela"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono-code px-2.5 py-1 text-xs font-bold uppercase bg-[#FF6B00] text-black border border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000]">
            {project.category}
          </span>
          <span className="font-mono-code flex items-center gap-1 px-2 py-0.5 text-xs font-bold border border-black rounded-md bg-neutral-100 dark:bg-neutral-800">
            <Calendar className="w-3.5 h-3.5" />
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h2 id="project-modal-title" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
          {project.title}
        </h2>

        {/* Optional Image */}
        {project.image && (
          <div className="mt-4 overflow-hidden rounded-xl border-2 border-black aspect-[16/9] bg-neutral-100 dark:bg-neutral-800">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Highlight Callout */}
        {project.highlight && (
          <div className="font-display mt-4 p-3 bg-[#FEF08A] text-black border-2 border-black rounded-lg text-sm font-bold shadow-[2px_2px_0px_0px_#000000]">
            ✦ {project.highlight}
          </div>
        )}

        {/* Overview & Description */}
        <div className="mt-5 space-y-4 text-black dark:text-white text-base leading-relaxed">
          <div>
            <h4 className="font-mono-code text-xs uppercase tracking-wider font-bold text-black dark:text-white mb-1">
              Deskripsi & Peran
            </h4>
            <p className="font-normal leading-relaxed">{project.longDescription || project.description}</p>
          </div>

          <div>
            <h4 className="font-mono-code text-xs uppercase tracking-wider font-bold text-black dark:text-white mb-2">
              Poin Utama & Nilai Pembelajaran
            </h4>
            <ul className="space-y-1.5 text-sm text-black dark:text-white">
              {getHighlightsForCategory(project.category).map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00] mt-0.5 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech / Skill Tags */}
        <div className="mt-6">
          <h4 className="font-mono-code text-xs uppercase tracking-wider font-bold text-black dark:text-white mb-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Topik & Keahlian Terkait
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono-code px-2.5 py-1 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-black rounded-md shadow-[1px_1px_0px_0px_#000000]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t-2 border-black flex flex-wrap items-center justify-end gap-3">
          {project.liveUrl && (
            <a
              id="project-modal-live-btn"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#FF6B00] text-black border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              <Globe className="w-4 h-4" />
              <span>Kunjungi Linktree</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
