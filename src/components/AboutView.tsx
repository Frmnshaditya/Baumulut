import React, { useState, useRef } from 'react';
import { ProfileData, Experience, CVFileInfo } from '../types';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { ContactSection } from './ContactSection';
import { User, Compass, FileDown, Check, Upload, GraduationCap, Camera, BookOpen, PenTool, Bike, Calendar } from 'lucide-react';
import { downloadCV, processUploadedCVFile } from '../utils/pdfService';

interface AboutViewProps {
  profile: ProfileData;
  experiences: Experience[];
  onUpdateCV?: (cvInfo: CVFileInfo) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ profile, experiences, onUpdateCV }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadResume = () => {
    downloadCV(profile, experiences);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const cvInfo = await processUploadedCVFile(file);
      if (onUpdateCV) {
        onUpdateCV(cvInfo);
      }
      setUploadMessage(`File "${file.name}" berhasil dimasukkan!`);
      setTimeout(() => setUploadMessage(null), 3500);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal memproses file PDF');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      {/* Intro Header */}
      <section id="about-intro-section" className="w-full max-w-3xl mx-auto pt-10 pb-6 px-6 sm:px-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1 bg-[#FF6B00] border border-black rounded-md">
            <User className="w-4 h-4 text-black stroke-[2.5]" />
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
            Tentang Asqi Faizul Ikmaludin
          </h1>
        </div>

        <p className="font-display text-lg font-medium text-black dark:text-white mb-6">
          {profile.title} • {profile.location}
        </p>

        {/* Story Card */}
        <div className="bg-white dark:bg-[#202024] border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_0px_#000000] space-y-4 text-black dark:text-white text-base sm:text-lg leading-relaxed font-normal">
          {profile.aboutText.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <div className="pt-4 border-t-2 border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
              <Compass className="w-4 h-4 text-[#FF6B00]" />
              <span>Terbuka untuk kolaborasi event, seminar, sesi foto & kepemudaan</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                id="download-resume-btn"
                onClick={handleDownloadResume}
                className="font-display px-4 py-2 bg-[#FF6B00] text-black font-extrabold text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-2 cursor-pointer transition-transform"
                title={profile.cvFile ? `Unduh file ${profile.cvFile.name}` : 'Unduh CV dalam format PDF'}
              >
                {downloaded ? <Check className="w-4 h-4 stroke-[3]" /> : <FileDown className="w-4 h-4 stroke-[2.5]" />}
                <span>{downloaded ? 'CV Terunduh (.pdf)!' : 'Download CV (PDF)'}</span>
              </button>

              <button
                id="about-upload-resume-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="font-display px-3 py-2 bg-white dark:bg-[#1A1A1E] text-black dark:text-white font-bold text-xs sm:text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-1.5 cursor-pointer transition-transform"
                title="Unggah file PDF CV Anda sendiri"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Memproses...' : profile.cvFile ? 'Ganti File CV' : 'Unggah CV (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* CV Active File Info / Upload Feedback */}
          {(profile.cvFile || uploadMessage) && (
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {uploadMessage ? (
                <span className="text-green-600 dark:text-green-400 font-bold">{uploadMessage}</span>
              ) : profile.cvFile ? (
                <span>
                  File aktif: <strong className="text-black dark:text-white">{profile.cvFile.name}</strong> (tersimpan lokal dan siap diunduh)
                </span>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* PERJALANAN PENDIDIKAN (Page 3 of PDF) */}
      <section id="education-section" className="w-full max-w-3xl mx-auto px-6 sm:px-8 py-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1 bg-[#BAE6FD] border border-black rounded-md">
            <GraduationCap className="w-4 h-4 text-black stroke-[2.5]" />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            Perjalanan Pendidikan
          </h2>
        </div>
        <p className="text-sm sm:text-base text-black dark:text-white mb-6">
          Jejak pendidikan formal mulai dari tingkat dasar hingga perguruan tinggi.
        </p>

        <div className="space-y-4">
          {profile.education?.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="bg-white dark:bg-[#202024] border-2 border-black rounded-xl p-4 sm:p-5 shadow-[3.5px_3.5px_0px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-transform hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code text-xs font-bold px-2 py-0.5 bg-[#FF6B00] text-black border border-black rounded">
                    0{idx + 1}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-black dark:text-white">
                    {edu.institution}
                  </h3>
                </div>
                {edu.description && (
                  <p className="text-xs sm:text-sm text-black dark:text-white/80 font-normal pl-8">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2 pl-8 sm:pl-0">
                <span
                  className={`font-mono-code text-xs font-bold px-2.5 py-1 border border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000000] ${
                    edu.status === 'Dalam Proses'
                      ? 'bg-[#FEF08A] text-black'
                      : 'bg-[#BBF7D0] text-black'
                  }`}
                >
                  {edu.status}
                </span>
                {edu.period && (
                  <span className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {edu.period}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOBI & EKSPLORASI (Page 6 of PDF) */}
      <section id="hobbies-section" className="w-full max-w-3xl mx-auto px-6 sm:px-8 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white mb-2 flex items-center gap-2">
          <Compass className="w-6 h-6 text-[#FF6B00] stroke-[2.5]" />
          <span>Hobi & Filosofi Eksplorasi (My Hobby)</span>
        </h2>
        <p className="text-sm sm:text-base text-black dark:text-white mb-6">
          Eksplorasi dan ekspresi: Menemukan perspektif baru di jalanan, merekamnya dalam lensa, memperluas wawasan dengan membaca, dan merefleksikannya lewat tulisan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#FEF08A] dark:bg-[#78540c] border-2 border-black rounded-xl p-5 shadow-[3.5px_3.5px_0px_0px_#000000] text-black dark:text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-white dark:bg-black/30 border border-black rounded-lg">
                <Bike className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
              </span>
              <h3 className="font-display font-extrabold text-lg">1. Touring</h3>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
              Mencari pengalaman dan perspektif baru di jalanan, menjelajah ruang terbuka, dan merasakan langsung interaksi budaya lokal.
            </p>
          </div>

          <div className="bg-[#BAE6FD] dark:bg-[#075985] border-2 border-black rounded-xl p-5 shadow-[3.5px_3.5px_0px_0px_#000000] text-black dark:text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-white dark:bg-black/30 border border-black rounded-lg">
                <Camera className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
              </span>
              <h3 className="font-display font-extrabold text-lg">2. Fotografi</h3>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
              Mengabadikan setiap detail dan nuansa perjalanan ke dalam narasi visual yang kuat, bercerita, dan penuh makna estetis.
            </p>
          </div>

          <div className="bg-[#BBF7D0] dark:bg-[#14532d] border-2 border-black rounded-xl p-5 shadow-[3.5px_3.5px_0px_0px_#000000] text-black dark:text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-white dark:bg-black/30 border border-black rounded-lg">
                <BookOpen className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
              </span>
              <h3 className="font-display font-extrabold text-lg">3. Membaca</h3>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
              Secara aktif membaca untuk memperluas pengetahuan, wawasan pemikiran, dan kedalaman intelektual dalam memandang fenomena.
            </p>
          </div>

          <div className="bg-[#FED7AA] dark:bg-[#7c2d12] border-2 border-black rounded-xl p-5 shadow-[3.5px_3.5px_0px_0px_#000000] text-black dark:text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-white dark:bg-black/30 border border-black rounded-lg">
                <PenTool className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
              </span>
              <h3 className="font-display font-extrabold text-lg">4. Menulis</h3>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
              Menyalurkan wawasan dan perjalanan hidup sebagai medium penting untuk merefleksikan dan mengomunikasikan cerita hidup saya.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <ExperienceSection experiences={experiences} />

      {/* Technical Arsenal */}
      <SkillsSection skills={profile.skills} />

      {/* Contact */}
      <ContactSection profile={profile} />
    </div>
  );
};
