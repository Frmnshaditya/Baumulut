import React, { useState, useRef } from 'react';
import { X, RotateCcw, Check, Sparkles, FileText, Upload, Trash2, FileDown } from 'lucide-react';
import { ProfileData } from '../types';
import { initialProfile } from '../data/portfolioData';
import { processUploadedCVFile, downloadCV, removeCustomCVLocally } from '../utils/pdfService';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSaveProfile: (newProfile: ProfileData) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCVFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCV(true);
      setCvError(null);
      const cvInfo = await processUploadedCVFile(file);
      setFormData((prev) => ({ ...prev, cvFile: cvInfo }));
    } catch (err: unknown) {
      setCvError(err instanceof Error ? err.message : 'Gagal memproses file');
    } finally {
      setUploadingCV(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveCustomCV = () => {
    removeCustomCVLocally();
    setFormData((prev) => {
      const copy = { ...prev };
      delete copy.cvFile;
      return copy;
    });
  };

  const handleTestDownload = () => {
    downloadCV(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setFormData(initialProfile);
  };

  return (
    <div
      id="customize-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="customize-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-[#1E1E22] border-3 border-black rounded-2xl p-6 sm:p-7 shadow-[8px_8px_0px_0px_#000000] text-black dark:text-white max-h-[90vh] overflow-y-auto"
      >
        <button
          id="customize-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 bg-[#FF6B00] border-2 border-black rounded-lg text-black hover:bg-orange-600 transition-transform active:scale-95 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 bg-[#FF6B00] border border-black rounded-md">
            <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
          </span>
          <h2 id="customize-modal-title" className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white">
            Personalize Portfolio
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-black dark:text-white mb-5">
          Customize your name, job title, and bio directly in this neobrutalism layout.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium">
          <div>
            <label className="font-display block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl font-normal"
              required
            />
          </div>

          <div>
            <label className="font-display block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl font-normal"
              required
            />
          </div>

          <div>
            <label className="font-display block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">Greeting Text</label>
            <input
              type="text"
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl font-normal"
              required
            />
          </div>

          <div>
            <label className="font-display block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">Bio Note / Second Line</label>
            <textarea
              rows={2}
              value={formData.bioNote}
              onChange={(e) => setFormData({ ...formData, bioNote: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl resize-none font-normal"
            />
          </div>

          <div>
            <label className="font-display block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">Photo / Avatar Image URL (Lanyard Badge)</label>
            <input
              type="url"
              value={formData.avatarUrl || ''}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl font-normal text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-display block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">Email</label>
              <input
                type="email"
                value={formData.socials.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl font-normal"
              />
            </div>

            <div>
              <label className="font-display block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={formData.socials.phone || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: {
                      ...formData.socials,
                      phone: e.target.value,
                      whatsapp: `https://wa.me/62${e.target.value.replace(/^0+/, '')}`,
                    },
                  })
                }
                placeholder="083152414790"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl font-normal"
              />
            </div>
          </div>

          <div>
            <label className="font-display block text-xs font-extrabold uppercase mb-1 text-black dark:text-white">Linktree URL</label>
            <input
              type="url"
              value={formData.socials.linktree || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socials: { ...formData.socials, linktree: e.target.value },
                })
              }
              placeholder="https://linktr.ee/IKMLDN"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl font-normal"
            />
          </div>

          {/* Dedicated CV / Resume (PDF) Upload Section */}
          <div className="p-4 bg-neutral-100 dark:bg-[#161618] border-2 border-black rounded-xl space-y-3 shadow-[2px_2px_0px_0px_#000000]">
            <div className="flex items-center justify-between">
              <label className="font-display block text-xs font-extrabold uppercase text-black dark:text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>File CV / Resume (PDF)</span>
              </label>
              {formData.cvFile ? (
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-[#BBF7D0] text-black border border-black rounded">
                  Custom PDF Terpasang
                </span>
              ) : (
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white border border-black rounded">
                  Auto Generated PDF
                </span>
              )}
            </div>

            <p className="text-xs text-black/70 dark:text-neutral-300">
              Unggah file CV (.pdf) Anda sendiri. Setiap kali tombol <strong>"Download CV"</strong> diklik, file PDF yang Anda masukkan inilah yang akan diunduh.
            </p>

            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleCVFileSelected}
              className="hidden"
            />

            {formData.cvFile ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-white dark:bg-[#202024] border-2 border-black rounded-lg">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="p-1.5 bg-[#FF6B00] border border-black rounded text-black shrink-0">
                    <FileText className="w-4 h-4 stroke-[2.5]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-black dark:text-white">
                      {formData.cvFile.name}
                    </p>
                    {formData.cvFile.size && (
                      <p className="text-[10px] text-neutral-500 font-mono">
                        {(formData.cvFile.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleTestDownload}
                    className="font-display px-2.5 py-1 text-xs font-bold bg-[#FEF08A] text-black border border-black rounded hover:bg-yellow-300 flex items-center gap-1 cursor-pointer"
                    title="Uji unduh file PDF Anda"
                  >
                    <FileDown className="w-3 h-3" />
                    <span>Test Unduh</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    className="font-display px-2.5 py-1 text-xs font-bold bg-white dark:bg-neutral-800 text-black dark:text-white border border-black rounded hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Ganti</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveCustomCV}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 border border-transparent hover:border-black rounded cursor-pointer"
                    title="Hapus file kustom & kembali ke PDF bawaan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => cvInputRef.current?.click()}
                disabled={uploadingCV}
                className="w-full py-3 px-4 bg-white dark:bg-[#202024] border-2 border-dashed border-black dark:border-neutral-500 rounded-lg hover:border-[#FF6B00] dark:hover:border-[#FF6B00] flex flex-col items-center justify-center gap-1 text-black dark:text-white cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 text-[#FF6B00]" />
                <span className="font-display text-xs font-bold">
                  {uploadingCV ? 'Memproses PDF...' : 'Klik untuk Unggah / Masukkan File CV (PDF)'}
                </span>
                <span className="text-[10px] text-neutral-500">Mendukung format file .pdf (hingga 15MB)</span>
              </button>
            )}

            {cvError && (
              <p className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50 p-2 rounded border border-red-500">
                {cvError}
              </p>
            )}
          </div>

          <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="font-display px-3 py-2 text-xs font-bold text-black dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Default
            </button>

            <button
              type="submit"
              className="font-display px-5 py-2.5 bg-[#FF6B00] text-black font-extrabold text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : null}
              <span>{savedSuccess ? 'Saved!' : 'Apply Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
