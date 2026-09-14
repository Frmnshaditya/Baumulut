import React from 'react';
import { ArrowUp, Heart, Globe, Mail, MessageCircle } from 'lucide-react';
import { ProfileData } from '../types';

interface FooterProps {
  profile: ProfileData;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="w-full max-w-3xl mx-auto px-6 sm:px-8 pt-6 pb-12">
      <div className="border-t-2 border-black/20 dark:border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-black dark:text-white">
        <div className="flex items-center gap-1.5 text-center sm:text-left">
          <span>© {new Date().getFullYear()} {profile.name}. Portofolio & Perjalanan Hidup.</span>
          <Heart className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00] inline" />
        </div>

        <div className="flex items-center gap-4 text-black dark:text-white">
          {profile.socials.linktree && (
            <a
              href={profile.socials.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6B00] transition-colors flex items-center gap-1"
              aria-label="Linktree"
              title="Linktree Asqi"
            >
              <Globe className="w-4 h-4" />
              <span>Linktree</span>
            </a>
          )}
          {profile.socials.whatsapp && (
            <a
              href={profile.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6B00] transition-colors flex items-center gap-1"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WA</span>
            </a>
          )}
          <a
            href={`mailto:${profile.socials.email}`}
            className="hover:text-[#FF6B00] transition-colors flex items-center gap-1"
            aria-label="Email"
            title="Email"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </a>

          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            title="Kembali ke atas"
            className="p-1.5 bg-[#FF6B00] text-black border border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000] hover:translate-y-[-1px] cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
