import React, { useState, useRef } from 'react';
import { Mail, BookOpen, Check, Copy, ExternalLink, FileDown, Upload, Globe, Phone, MapPin, MessageCircle } from 'lucide-react';
import { ProfileData, CVFileInfo, Experience } from '../types';
import { LanyardBadge } from './LanyardBadge';
import { downloadCV, processUploadedCVFile } from '../utils/pdfService';

interface HeroProps {
  profile: ProfileData;
  onUpdateAvatar?: (newUrl: string) => void;
  onUpdateCV?: (cvInfo: CVFileInfo) => void;
  experiences?: Experience[];
}

export const Hero: React.FC<HeroProps> = ({ profile, onUpdateAvatar, onUpdateCV, experiences = [] }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profile.socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCV = () => {
    downloadCV(profile, experiences);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const cvInfo = await processUploadedCVFile(file);
      if (onUpdateCV) {
        onUpdateCV(cvInfo);
      }
      setUploadMsg(`File ${file.name} tersimpan!`);
      setTimeout(() => setUploadMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal memproses file PDF');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <section id="hero-section" className="w-full max-w-3xl mx-auto pt-8 sm:pt-10 pb-8 px-6 sm:px-8">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-10">
        {/* Left Column: Personal Intro & Socials */}
        <div className="flex-1 space-y-4 w-full">
          {/* Name Header */}
          <h1
            id="hero-name"
            className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-[-0.04em] text-black dark:text-white leading-none"
          >
            {profile.name}
          </h1>

          {/* Title */}
          <p
            id="hero-title"
            className="font-display text-lg sm:text-xl font-medium text-black dark:text-white tracking-tight"
          >
            {profile.title}
          </p>

          {/* Focus Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="font-display px-2.5 py-0.5 text-xs font-bold bg-[#FEF08A] text-black border border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000]">
              Public Speaking
            </span>
            <span className="font-display px-2.5 py-0.5 text-xs font-bold bg-[#BAE6FD] text-black border border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000]">
              Adventure & Touring
            </span>
            <span className="font-display px-2.5 py-0.5 text-xs font-bold bg-[#BBF7D0] text-black border border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000]">
              Fotografer
            </span>
            <span className="font-display px-2.5 py-0.5 text-xs font-bold bg-[#FED7AA] text-black border border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000]">
              UIN Saizu
            </span>
          </div>

          {/* Introduction Paragraphs */}
          <div className="pt-2 space-y-3 text-base sm:text-[16px] text-black dark:text-white leading-[1.65] max-w-xl font-normal">
            <p id="hero-greeting" className="text-black dark:text-white font-medium">
              {profile.greeting}
            </p>
            <div id="hero-location-badge" className="flex items-center gap-1.5 text-xs font-bold font-mono text-black dark:text-white/80 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 border border-black rounded-lg w-fit shadow-[1.5px_1.5px_0px_0px_#000000]">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span>{profile.location}</span>
            </div>
          </div>

          {/* Social & Contact Icons Row */}
          <div id="hero-social-row" className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Linktree Button */}
            {profile.socials.linktree && (
              <a
                id="hero-linktree-btn"
                href={profile.socials.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display px-3 py-1.5 text-xs sm:text-sm font-bold bg-[#BBF7D0] text-black border border-black rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-1.5"
                title="Kunjungi Linktree Asqi"
              >
                <Globe className="w-4 h-4 text-black" />
                <span>linktr.ee/IKMLDN</span>
                <ExternalLink className="w-3 h-3 text-black/70" />
              </a>
            )}

            {/* WhatsApp / Phone Button */}
            {profile.socials.whatsapp && (
              <a
                id="hero-whatsapp-btn"
                href={profile.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display px-3 py-1.5 text-xs sm:text-sm font-bold bg-[#BAE6FD] text-black border border-black rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-1.5"
                title="Hubungi via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>083152414790</span>
              </a>
            )}

            {/* Email Icon with tooltip */}
            <div className="relative group">
              <a
                id="hero-social-email"
                href={`mailto:${profile.socials.email}`}
                className="font-display px-3 py-1.5 text-xs sm:text-sm font-bold bg-white dark:bg-neutral-800 text-black dark:text-white border border-black rounded-lg shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-1.5"
                aria-label="Send email"
              >
                <Mail className="w-4 h-4 text-[#FF6B00]" />
                <span>Email</span>
              </a>
              {/* Quick copy tooltip */}
              <button
                id="hero-copy-email-tooltip"
                onClick={handleCopyEmail}
                title="Salin alamat email"
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[11px] px-2 py-0.5 rounded border border-black whitespace-nowrap pointer-events-auto flex items-center gap-1 shadow-sm cursor-pointer z-20"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin!' : 'Salin Email'}
              </button>
            </div>
          </div>

          {/* Download CV (PDF) Action Row & Upload CV File */}
          <div id="hero-cv-action-row" className="pt-2 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Hidden file input for uploading custom CV */}
              <input
                ref={cvFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleCVUpload}
                className="hidden"
              />

              {/* Main Download CV (PDF) Button */}
              <button
                id="hero-download-cv-btn"
                onClick={handleDownloadCV}
                className="font-display px-4 py-2.5 bg-[#FF6B00] text-black font-extrabold text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 cursor-pointer transition-all"
                title={profile.cvFile ? `Unduh file ${profile.cvFile.name}` : 'Unduh CV dalam format PDF'}
              >
                {isDownloaded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>CV Terunduh (.pdf)!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 stroke-[2.5]" />
                    <span>Download CV (PDF)</span>
                  </>
                )}
              </button>

              {/* Upload / Replace CV Button */}
              <button
                id="hero-upload-cv-btn"
                type="button"
                onClick={() => cvFileInputRef.current?.click()}
                disabled={isUploading}
                className="font-display px-3 py-2 bg-white dark:bg-[#1E1E22] text-black dark:text-white font-bold text-xs sm:text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer transition-all"
                title="Unggah file CV PDF milik Anda"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Memproses...' : profile.cvFile ? 'Ganti File CV' : 'Input / Unggah CV'}</span>
              </button>
            </div>

            {/* Active CV indicator */}
            <div className="flex items-center gap-2 text-xs font-mono text-black/70 dark:text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              {uploadMsg ? (
                <span className="text-green-600 dark:text-green-400 font-bold">{uploadMsg}</span>
              ) : profile.cvFile ? (
                <span className="truncate">
                  File terpasang: <strong className="text-black dark:text-white underline">{profile.cvFile.name}</strong>
                </span>
              ) : (
                <span>Format output: <strong className="text-black dark:text-white">PDF (.pdf)</strong> (klik untuk unduh atau unggah file Anda)</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Lanyard ID Card Pass with Personal Photo */}
        <div className="shrink-0 flex justify-center w-full md:w-auto">
          <LanyardBadge profile={profile} onUpdateAvatar={onUpdateAvatar} />
        </div>
      </div>
    </section>
  );
};

