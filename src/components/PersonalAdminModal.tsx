import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  FileText,
  User,
  Shield,
  Upload,
  Trash2,
  FileDown,
  Check,
  RotateCcw,
  LogOut,
  Sparkles,
  Link as LinkIcon,
  Phone,
  MapPin,
  Save,
  AlertCircle,
  KeyRound,
  Image as ImageIcon,
  Database,
  Download,
  Plus,
  RefreshCw,
  Eye,
  Info,
  Cloud,
  CheckCircle2,
  MessageSquare,
  MailOpen
} from 'lucide-react';
import { ProfileData, CVFileInfo, Project, ContactMessage } from '../types';
import { initialProfile, initialProjects, initialExperiences } from '../data/portfolioData';
import { processUploadedCVFile, downloadCV, removeCustomCVLocally } from '../utils/pdfService';
import { updateStoredPIN, getStoredPIN, setAuthenticatedSession, fetchFreshPIN } from '../utils/authService';
import { compressAndResizeImage } from '../utils/imageUtils';
import { subscribeToMessages } from '../lib/firebase';

interface PersonalAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  projects: Project[];
  onSaveProfile: (newProfile: ProfileData) => void;
  onSaveProjects: (newProjects: Project[]) => void;
  onLogout: () => void;
  isFirebaseConnected?: boolean;
}

type AdminTab = 'foto_profil' | 'foto_karya' | 'cv' | 'profil' | 'pesan' | 'keamanan' | 'penyimpanan';

export const PersonalAdminModal: React.FC<PersonalAdminModalProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  onSaveProfile,
  onSaveProjects,
  onLogout,
  isFirebaseConnected = true,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('foto_profil');
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [projectsData, setProjectsData] = useState<Project[]>(projects);
  const [photoPreview, setPhotoPreview] = useState<string>(profile.avatarUrl);
  const [photoSourceUrl, setPhotoSourceUrl] = useState<string>('');

  // CV Upload state
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvMsg, setCvMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security (PIN) state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinMsg, setPinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Project photo upload state
  const [activeUploadProjectId, setActiveUploadProjectId] = useState<string | null>(null);
  const [projectUrlInputs, setProjectUrlInputs] = useState<Record<string, string>>({});
  const [processingPhoto, setProcessingPhoto] = useState(false);

  // Contact Messages state from Firestore
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);

  // Backup & Storage state
  const [storageMsg, setStorageMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // General save and notice state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const projectPhotoInputRef = useRef<HTMLInputElement>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const restoreFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingMessages(true);
    const unsubscribe = subscribeToMessages((msgs) => {
      setMessagesList(msgs);
      setLoadingMessages(false);
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper for notification
  const showNotice = (type: 'success' | 'error', text: string) => {
    setNoticeMsg({ type, text });
    setTimeout(() => setNoticeMsg(null), 4000);
  };

  // 1. Profile Photo Handlers
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProcessingPhoto(true);
      const optimizedDataUrl = await compressAndResizeImage(file, 1000, 1000, 0.85);
      setPhotoPreview(optimizedDataUrl);
      setFormData((prev) => ({ ...prev, avatarUrl: optimizedDataUrl }));
      showNotice('success', 'Foto profil berhasil dimuat!');
    } catch (err: unknown) {
      showNotice('error', err instanceof Error ? err.message : 'Gagal memproses foto');
    } finally {
      setProcessingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleApplyPhotoUrl = () => {
    if (!photoSourceUrl.trim()) return;
    setPhotoPreview(photoSourceUrl.trim());
    setFormData((prev) => ({ ...prev, avatarUrl: photoSourceUrl.trim() }));
    setPhotoSourceUrl('');
    showNotice('success', 'Tautan foto profil berhasil diterapkan!');
  };

  const handleResetProfilePhoto = () => {
    setPhotoPreview(initialProfile.avatarUrl);
    setFormData((prev) => ({ ...prev, avatarUrl: initialProfile.avatarUrl }));
    showNotice('success', 'Foto profil dikembalikan ke foto bawaan');
  };

  // 2. Project Photo Handlers
  const triggerProjectPhotoUpload = (projectId: string) => {
    setActiveUploadProjectId(projectId);
    projectPhotoInputRef.current?.click();
  };

  const handleProjectPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadProjectId) return;

    try {
      setProcessingPhoto(true);
      const optimizedDataUrl = await compressAndResizeImage(file, 1200, 800, 0.82);
      setProjectsData((prev) =>
        prev.map((proj) =>
          proj.id === activeUploadProjectId ? { ...proj, image: optimizedDataUrl } : proj
        )
      );
      showNotice('success', 'Foto dokumentasi berhasil diperbarui!');
    } catch (err: unknown) {
      showNotice('error', err instanceof Error ? err.message : 'Gagal memproses foto dokumentasi');
    } finally {
      setProcessingPhoto(false);
      setActiveUploadProjectId(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleApplyProjectPhotoUrl = (projectId: string) => {
    const url = projectUrlInputs[projectId];
    if (!url || !url.trim()) return;
    setProjectsData((prev) =>
      prev.map((proj) => (proj.id === projectId ? { ...proj, image: url.trim() } : proj))
    );
    setProjectUrlInputs((prev) => ({ ...prev, [projectId]: '' }));
    showNotice('success', 'Tautan foto dokumentasi berhasil diterapkan!');
  };

  const handleRemoveProjectPhoto = (projectId: string) => {
    setProjectsData((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const copy = { ...proj };
          delete copy.image;
          return copy;
        }
        return proj;
      })
    );
    showNotice('success', 'Foto dokumentasi dikosongkan.');
  };

  const handleAddNewDocumentation = () => {
    const newId = `proj-${Date.now()}`;
    const newProj: Project = {
      id: newId,
      title: 'Dokumentasi Baru',
      description: 'Deskripsi singkat mengenai dokumentasi, kegiatan, atau karya foto ini.',
      category: 'Photography',
      tags: ['Dokumentasi', 'Karya Baru'],
      githubUrl: 'https://linktr.ee/IKMLDN',
      liveUrl: 'https://linktr.ee/IKMLDN',
      featured: true,
      year: new Date().getFullYear().toString(),
      highlight: 'Dokumentasi Tambahan Asqi',
    };
    setProjectsData((prev) => [newProj, ...prev]);
    showNotice('success', 'Dokumentasi baru berhasil ditambahkan ke daftar.');
  };

  const confirmDeleteProject = (projectId: string) => {
    setProjectsData((prev) => prev.filter((p) => p.id !== projectId));
    setProjectToDeleteId(null);
    showNotice('success', 'Dokumentasi berhasil dihapus.');
  };

  // 3. CV Upload Handlers
  const handleCVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCV(true);
      setCvMsg(null);
      const cvInfo: CVFileInfo = await processUploadedCVFile(file);
      setFormData((prev) => ({ ...prev, cvFile: cvInfo }));
      setCvMsg({
        type: 'success',
        text: `File "${cvInfo.name}" (${cvInfo.size}) berhasil dipasang!`,
      });
    } catch (err: unknown) {
      setCvMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Gagal memproses file CV',
      });
    } finally {
      setUploadingCV(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveCV = () => {
    removeCustomCVLocally();
    setFormData((prev) => {
      const updated = { ...prev };
      delete updated.cvFile;
      return updated;
    });
    setCvMsg({
      type: 'success',
      text: 'File CV khusus dihapus. Sistem akan menggunakan ringkasan PDF otomatis.',
    });
  };

  // 4. Save All
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveProfile(formData);
    onSaveProjects(projectsData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  // 5. PIN Handlers
  const handleUpdatePIN = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg(null);
    let existingPIN = getStoredPIN();

    if (currentPinInput.trim() !== existingPIN) {
      // Re-fetch directly from Cloud Firestore in case changed on another device
      existingPIN = await fetchFreshPIN();
    }

    if (currentPinInput.trim() !== existingPIN) {
      setPinMsg({ type: 'error', text: 'PIN lama tidak sesuai!' });
      return;
    }
    if (newPinInput.trim().length < 4) {
      setPinMsg({ type: 'error', text: 'PIN baru minimal harus 4 karakter.' });
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinMsg({ type: 'error', text: 'Konfirmasi PIN baru tidak cocok.' });
      return;
    }

    const success = await updateStoredPIN(newPinInput.trim());
    if (success) {
      setPinMsg({
        type: 'success',
        text: 'PIN berhasil diubah & tersimpan di Cloud Firestore! Berlaku otomatis di semua perangkat (HP, laptop, tablet).',
      });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } else {
      setPinMsg({ type: 'error', text: 'Gagal memperbarui PIN di cloud.' });
    }
  };

  // 6. Data Storage Export & Restore
  const handleExportBackup = () => {
    const backupObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: formData,
      projects: projectsData,
    };
    const jsonStr = JSON.stringify(backupObject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-portofolio-asqi-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStorageMsg({
      type: 'success',
      text: 'File cadangan (.json) berhasil diunduh ke perangkat Anda!',
    });
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.profile) {
          setFormData(parsed.profile);
          setPhotoPreview(parsed.profile.avatarUrl || initialProfile.avatarUrl);
          onSaveProfile(parsed.profile);
        }
        if (Array.isArray(parsed.projects)) {
          setProjectsData(parsed.projects);
          onSaveProjects(parsed.projects);
        }
        setStorageMsg({
          type: 'success',
          text: 'Data cadangan berhasil dipulihkan dan diterapkan!',
        });
      } catch (err: unknown) {
        setStorageMsg({
          type: 'error',
          text: 'Gagal membaca berkas cadangan. Pastikan file berformat JSON valid.',
        });
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleExecuteResetAll = () => {
    setFormData(initialProfile);
    setPhotoPreview(initialProfile.avatarUrl);
    setProjectsData(initialProjects);
    onSaveProfile(initialProfile);
    onSaveProjects(initialProjects);
    removeCustomCVLocally();
    setIsConfirmingReset(false);
    setStorageMsg({
      type: 'success',
      text: 'Seluruh data berhasil dikembalikan ke setelan awal bawaan.',
    });
    showNotice('success', 'Seluruh data telah di-reset ke setelan awal.');
  };

  const handleLogoutClick = () => {
    setAuthenticatedSession(false);
    onLogout();
    onClose();
  };

  return (
    <div
      id="personal-admin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="personal-admin-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white dark:bg-[#1E1E22] border-3 border-black rounded-2xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_#000000] text-black dark:text-white max-h-[92vh] flex flex-col"
      >
        {/* Hidden inputs for project photo change & restore backup */}
        <input
          ref={projectPhotoInputRef}
          type="file"
          accept="image/*"
          onChange={handleProjectPhotoChange}
          className="hidden"
        />
        <input
          ref={restoreFileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleRestoreBackup}
          className="hidden"
        />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black/15 dark:border-white/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#FF6B00] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000]">
              <Sparkles className="w-5 h-5 text-black stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-tight">
                  Dashboard Pengelola Pribadi
                </h2>
                <span className="font-mono-code px-2 py-0.5 text-[10px] font-extrabold bg-green-300 text-black border border-black rounded shadow-xs">
                  Aktif (Asqi)
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Ganti seluruh foto web, kelola CV (PDF), perbarui biodata, dan kelola penyimpanan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="admin-logout-btn"
              type="button"
              onClick={handleLogoutClick}
              title="Keluar dari sesi pribadi"
              className="p-1.5 sm:px-2.5 sm:py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-black rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
            <button
              id="personal-admin-close-btn"
              onClick={onClose}
              className="p-1.5 bg-[#FF6B00] border-2 border-black rounded-lg text-black hover:bg-orange-600 transition-transform active:scale-95 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
              aria-label="Tutup menu pribadi"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Global Notice Banner */}
        {noticeMsg && (
          <div
            className={`mt-2.5 px-3 py-2 border-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shrink-0 ${
              noticeMsg.type === 'success'
                ? 'bg-green-100 text-green-900 border-green-700'
                : 'bg-red-100 text-red-900 border-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {noticeMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{noticeMsg.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setNoticeMsg(null)}
              className="p-1 hover:opacity-75 cursor-pointer text-xs font-bold"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 pt-2.5 pb-3 border-b border-black/10 dark:border-white/10 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('foto_profil')}
            className={`font-display px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 border-black flex items-center gap-1.5 cursor-pointer transition-transform ${
              activeTab === 'foto_profil'
                ? 'bg-[#FF6B00] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white dark:bg-[#202024] text-black dark:text-white hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000000]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>1. Foto Profil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('foto_karya')}
            className={`font-display px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 border-black flex items-center gap-1.5 cursor-pointer transition-transform ${
              activeTab === 'foto_karya'
                ? 'bg-[#FF6B00] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white dark:bg-[#202024] text-black dark:text-white hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000000]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>2. Foto Karya & Web ({projectsData.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cv')}
            className={`font-display px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 border-black flex items-center gap-1.5 cursor-pointer transition-transform ${
              activeTab === 'cv'
                ? 'bg-[#FF6B00] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white dark:bg-[#202024] text-black dark:text-white hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000000]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>3. File CV (PDF)</span>
            {formData.cvFile && (
              <span className="w-2 h-2 rounded-full bg-green-500 ring-1 ring-black" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`font-display px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 border-black flex items-center gap-1.5 cursor-pointer transition-transform ${
              activeTab === 'profil'
                ? 'bg-[#FF6B00] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white dark:bg-[#202024] text-black dark:text-white hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000000]'
            }`}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>4. Biodata & Kontak</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pesan')}
            className={`font-display px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 border-black flex items-center gap-1.5 cursor-pointer transition-transform ${
              activeTab === 'pesan'
                ? 'bg-[#FF6B00] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white dark:bg-[#202024] text-black dark:text-white hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000000]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>5. Pesan Masuk</span>
            {messagesList.length > 0 && (
              <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-mono font-bold">
                {messagesList.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keamanan')}
            className={`font-display px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 border-black flex items-center gap-1.5 cursor-pointer transition-transform ${
              activeTab === 'keamanan'
                ? 'bg-[#FF6B00] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white dark:bg-[#202024] text-black dark:text-white hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000000]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>6. Ganti PIN</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('penyimpanan')}
            className={`font-display px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 border-black flex items-center gap-1.5 cursor-pointer transition-transform ${
              activeTab === 'penyimpanan'
                ? 'bg-[#FF6B00] text-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5'
                : 'bg-white dark:bg-[#202024] text-black dark:text-white hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000000]'
            }`}
          >
            <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>7. Info Cloud</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto py-3 pr-1 space-y-4 text-sm font-medium">
          {/* TAB 1: FOTO PROFIL */}
          {activeTab === 'foto_profil' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-[#FFF4E0] dark:bg-[#2A2620] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
                <h3 className="font-display font-extrabold text-base text-black dark:text-white mb-1 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#FF6B00]" />
                  Foto Profil Utama & Lanyard ID Pass
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Foto ini tampil di kartu Lanyard ID Pass UIN Saizu pada bagian Hero (beranda utama).
                </p>
              </div>

              {/* Photo Preview & Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-neutral-50 dark:bg-[#18181B] border-2 border-black rounded-xl">
                <div className="relative group shrink-0">
                  <div className="w-28 h-36 rounded-xl border-3 border-black overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-[4px_4px_0px_0px_#000000]">
                    <img
                      src={photoPreview}
                      alt="Pratinjau Foto Profil"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-mono-code absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-bold bg-[#FF6B00] text-black border border-black rounded-md whitespace-nowrap shadow-xs">
                    Pratinjau
                  </span>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <input
                      ref={profilePhotoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => profilePhotoInputRef.current?.click()}
                      disabled={processingPhoto}
                      className="font-display w-full sm:w-auto px-4 py-2 bg-[#FF6B00] text-black font-extrabold text-xs sm:text-sm border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 stroke-[2.5]" />
                      <span>{processingPhoto ? 'Mengoptimalkan...' : 'Pilih Foto dari Galeri / Laptop'}</span>
                    </button>
                    <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                      Otomatis dioptimalkan agar jernih & ringan disimpan di browser Anda.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-black/15 dark:border-white/15">
                    <label className="font-display block text-xs font-bold text-black dark:text-white mb-1">
                      Atau Tempel Tautan (URL) Foto:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={photoSourceUrl}
                        onChange={(e) => setPhotoSourceUrl(e.target.value)}
                        placeholder="https://contoh.com/foto-asqi.jpg"
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-[#202024] text-black dark:text-white border-2 border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPhotoUrl}
                        className="font-display px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white border border-black rounded-lg text-xs font-bold hover:bg-neutral-300 cursor-pointer"
                      >
                        Pasang
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleResetProfilePhoto}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Kembalikan ke Foto Default Asqi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FOTO SEMUA KARYA & DOKUMENTASI WEB */}
          {activeTab === 'foto_karya' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-[#BAE6FD] dark:bg-[#0369a1] text-black dark:text-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-extrabold text-base mb-0.5 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    Kelola Seluruh Foto Karya, Acara & Dokumentasi
                  </h3>
                  <p className="text-xs opacity-90">
                    Ganti foto pada setiap kartu kegiatan (Seminar SMK CBM, Touring, OSPP Santri, dsb) atau tambahkan dokumentasi baru.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewDocumentation}
                  className="font-display px-3 py-1.5 bg-[#FF6B00] text-black font-extrabold text-xs border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Tambah Dokumentasi</span>
                </button>
              </div>

              {/* List of all project/documentation photos */}
              <div className="space-y-3">
                {projectsData.map((project, idx) => (
                  <div
                    key={project.id}
                    className="p-3.5 bg-neutral-50 dark:bg-[#18181B] border-2 border-black rounded-xl flex flex-col sm:flex-row items-start gap-4 shadow-[2px_2px_0px_0px_#000000]"
                  >
                    {/* Thumbnail Preview */}
                    <div className="relative shrink-0 w-full sm:w-36 aspect-[16/10] bg-neutral-200 dark:bg-neutral-800 border-2 border-black rounded-lg overflow-hidden flex items-center justify-center">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
                          <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                          <span className="text-[10px] font-mono font-bold">Belum Ada Foto</span>
                        </div>
                      )}
                      <span className="font-mono-code absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-extrabold bg-black text-white rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Metadata & Controls */}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjectsData((prev) =>
                                prev.map((p) => (p.id === project.id ? { ...p, title: val } : p))
                              );
                            }}
                            className="font-display font-extrabold text-xs sm:text-sm text-black dark:text-white bg-white dark:bg-[#202024] border border-black rounded px-2 py-1 w-full max-w-md focus:ring-1 focus:ring-[#FF6B00]"
                          />
                          <span className="font-mono-code text-[10px] text-neutral-500 block mt-0.5">
                            Kategori: {project.category} • Tahun: {project.year}
                          </span>
                        </div>

                        {projectToDeleteId === project.id ? (
                          <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950 p-1 border border-red-500 rounded">
                            <span className="text-[10px] font-bold text-red-600">Hapus?</span>
                            <button
                              type="button"
                              onClick={() => confirmDeleteProject(project.id)}
                              className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-red-700"
                            >
                              Ya
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjectToDeleteId(null)}
                              className="px-1.5 py-0.5 bg-neutral-200 text-black rounded text-[10px] font-bold cursor-pointer hover:bg-neutral-300"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setProjectToDeleteId(project.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-950 rounded border border-transparent hover:border-red-500 transition-colors cursor-pointer"
                            title="Hapus dokumentasi ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Photo Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => triggerProjectPhotoUpload(project.id)}
                          disabled={processingPhoto}
                          className="font-display px-2.5 py-1 bg-[#FF6B00] text-black font-bold text-xs border border-black rounded-lg shadow-xs hover:bg-orange-500 flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{project.image ? 'Ganti Foto' : 'Unggah Foto'}</span>
                        </button>

                        {project.image && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProjectPhoto(project.id)}
                            className="font-display px-2 py-1 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-black rounded-lg text-xs font-bold hover:bg-red-100 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus Foto</span>
                          </button>
                        )}
                      </div>

                      {/* URL input for this project */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="url"
                          placeholder="Atau tautkan URL gambar (https://...)"
                          value={projectUrlInputs[project.id] || ''}
                          onChange={(e) =>
                            setProjectUrlInputs((prev) => ({
                              ...prev,
                              [project.id]: e.target.value,
                            }))
                          }
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-[#202024] text-black dark:text-white border border-black rounded focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyProjectPhotoUrl(project.id)}
                          className="font-display px-2.5 py-1 bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white border border-black rounded text-xs font-bold hover:bg-neutral-300 cursor-pointer"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FILE CV (PDF) */}
          {activeTab === 'cv' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-[#BAE6FD] dark:bg-[#0369a1] text-black dark:text-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
                <h3 className="font-display font-extrabold text-base mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Pengaturan Dokumen CV (PDF)
                </h3>
                <p className="text-xs opacity-90">
                  File PDF yang Anda input di sini akan <strong>langsung diunduh</strong> ketika pengunjung mengklik tombol <em>"Download CV (PDF)"</em> di beranda portofolio.
                </p>
              </div>

              {/* Status File CV Saat Ini */}
              <div className="p-4 bg-neutral-50 dark:bg-[#18181B] border-2 border-black rounded-xl space-y-3">
                <span className="font-mono-code text-xs uppercase font-bold text-neutral-500 block">
                  Status File CV Terpasang
                </span>

                {formData.cvFile ? (
                  <div className="p-3 bg-white dark:bg-[#202024] border-2 border-black rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#000000]">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2.5 bg-red-100 border border-black rounded-lg shrink-0">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="truncate">
                        <p className="font-display text-sm font-bold text-black dark:text-white truncate">
                          {formData.cvFile.name}
                        </p>
                        <p className="font-mono-code text-xs text-neutral-500">
                          {formData.cvFile.size} • Diperbarui: {formData.cvFile.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => downloadCV(formData, initialExperiences)}
                        className="font-display px-2.5 py-1.5 bg-[#BBF7D0] text-black border border-black rounded-lg text-xs font-bold hover:bg-green-300 flex items-center gap-1 shadow-xs cursor-pointer"
                        title="Unduh untuk memeriksa tampilan file"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Cek Unduh</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveCV}
                        className="font-display px-2.5 py-1.5 bg-red-100 text-red-700 border border-black rounded-lg text-xs font-bold hover:bg-red-200 flex items-center gap-1 shadow-xs cursor-pointer"
                        title="Hapus file kustom"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white dark:bg-[#202024] border border-dashed-2 border-black rounded-xl text-xs text-neutral-600 dark:text-neutral-400">
                    <p className="font-bold text-black dark:text-white">
                      Belum ada file PDF khusus yang diunggah.
                    </p>
                    <p className="mt-0.5">
                      Saat ini tombol unduh menggunakan generator dokumen ringkasan otomatis dengan format standar PDF A4 resmi.
                    </p>
                  </div>
                )}

                {/* Input File CV Baru */}
                <div className="pt-2">
                  <input
                    ref={cvFileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCVFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => cvFileInputRef.current?.click()}
                    disabled={uploadingCV}
                    className="font-display px-4 py-2 bg-[#FF6B00] text-black font-extrabold text-xs sm:text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-2 cursor-pointer transition-transform"
                  >
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      {uploadingCV ? 'Memproses File...' : formData.cvFile ? 'Ganti File CV (.pdf) Baru' : 'Unggah File CV Resmi (.pdf)'}
                    </span>
                  </button>
                </div>

                {cvMsg && (
                  <div
                    className={`p-2.5 border-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      cvMsg.type === 'success'
                        ? 'bg-green-100 text-green-800 border-green-700'
                        : 'bg-red-100 text-red-800 border-red-700'
                    }`}
                  >
                    {cvMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{cvMsg.text}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DATA PROFIL & KONTAK */}
          {activeTab === 'profil' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-display block text-xs font-extrabold uppercase mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="font-display block text-xs font-extrabold uppercase mb-1">
                    Gelar / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-display block text-xs font-extrabold uppercase mb-1">
                  Kalimat Sambutan (Hero Header)
                </label>
                <input
                  type="text"
                  value={formData.greeting}
                  onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-display block text-xs font-extrabold uppercase mb-1">
                  Biografi / Deskripsi Diri
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutText[0] || ''}
                  onChange={(e) => {
                    const newArr = [...formData.aboutText];
                    newArr[0] = e.target.value;
                    setFormData({ ...formData, aboutText: newArr });
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-display block text-xs font-extrabold uppercase mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    value={formData.socials.phone || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        socials: {
                          ...formData.socials,
                          phone: val,
                          whatsapp: `https://wa.me/62${val.replace(/^0+/, '')}`,
                        },
                      });
                    }}
                    placeholder="083152414790"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="font-display block text-xs font-extrabold uppercase mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#FF6B00]" />
                    Tautan Linktree
                  </label>
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
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-display block text-xs font-extrabold uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                  Domisili / Alamat
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PESAN MASUK (KOTAK MASUK KONTAK FIRESTORE) */}
          {activeTab === 'pesan' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-[#E0E7FF] dark:bg-[#1e1e38] text-black dark:text-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-display font-extrabold text-base flex items-center gap-1.5">
                    <MessageSquare className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
                    Kotak Masuk Pesan Pengunjung (Real-time Cloud)
                  </h3>
                  <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-mono-code font-bold">
                    {messagesList.length} Pesan
                  </span>
                </div>
                <p className="text-xs font-normal leading-relaxed text-neutral-700 dark:text-neutral-300">
                  Setiap orang yang mengisi formulir &ldquo;Hubungi Saya&rdquo; di website akan otomatis tercatat di sini secara real-time. Anda juga bisa langsung membalas ke email pengirim dengan mengklik tombol balas.
                </p>
              </div>

              {loadingMessages ? (
                <div className="p-8 text-center text-xs font-mono text-neutral-500">
                  Memuat pesan masuk dari cloud database...
                </div>
              ) : messagesList.length === 0 ? (
                <div className="p-8 bg-neutral-50 dark:bg-[#18181B] border-2 border-black rounded-xl text-center">
                  <MailOpen className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
                  <p className="font-display text-sm font-bold text-black dark:text-white">
                    Belum Ada Pesan Masuk
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Pesan yang dikirimkan klien atau pengunjung lewat formulir website akan tampil di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messagesList.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 bg-white dark:bg-[#18181B] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-2">
                        <div>
                          <span className="font-display font-extrabold text-sm text-black dark:text-white block">
                            {msg.name}
                          </span>
                          <a
                            href={`mailto:${msg.email}?subject=Balasan%20Portofolio%20Asqi%20Faizul`}
                            className="text-xs text-[#FF6B00] font-mono-code hover:underline"
                          >
                            {msg.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-code text-neutral-500 bg-neutral-100 dark:bg-[#2A2A2E] px-2 py-0.5 rounded border border-black/20">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Baru saja'}
                          </span>
                          <a
                            href={`mailto:${msg.email}?subject=Re:%20Pesan%20dari%20Portofolio%20Asqi&body=Halo%20${encodeURIComponent(
                              msg.name
                            )},%0A%0ATerima%20kasih%20telah%20menghubungi%20saya.%0A%0ASalam,%0AAsqi%20Faizul%20Ikmaludin`}
                            className="px-2.5 py-1 bg-[#FF6B00] text-black font-display text-xs font-extrabold border border-black rounded-lg shadow-xs hover:bg-orange-500 transition-colors"
                          >
                            Balas Email
                          </a>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans bg-neutral-50 dark:bg-[#202024] p-3 rounded-lg border border-black/10">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: GANTI PIN KEAMANAN */}
          {activeTab === 'keamanan' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-[#FEF08A] text-black border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
                <h3 className="font-display font-extrabold text-base mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-black" />
                  Ganti Kata Sandi / PIN Pribadi
                </h3>
                <p className="text-xs font-normal">
                  Ubah kata sandi login pribadi untuk memastikan hanya Anda yang dapat membuka dashboard penginputan foto, CV, dan data portofolio ini.
                </p>
              </div>

              <form onSubmit={handleUpdatePIN} className="space-y-3 p-4 bg-neutral-50 dark:bg-[#18181B] border-2 border-black rounded-xl">
                <div>
                  <label className="font-display block text-xs font-extrabold uppercase mb-1">
                    PIN Lama Saat Ini
                  </label>
                  <input
                    type="password"
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    placeholder="Masukkan PIN saat ini (bawaan: asqi2026)"
                    className="w-full px-3 py-2 bg-white dark:bg-[#202024] text-black dark:text-white border-2 border-black rounded-lg text-xs sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-display block text-xs font-extrabold uppercase mb-1">
                      PIN Baru (Min. 4 Karakter)
                    </label>
                    <input
                      type="password"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="PIN baru Anda..."
                      className="w-full px-3 py-2 bg-white dark:bg-[#202024] text-black dark:text-white border-2 border-black rounded-lg text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-display block text-xs font-extrabold uppercase mb-1">
                      Konfirmasi PIN Baru
                    </label>
                    <input
                      type="password"
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="Ulangi PIN baru..."
                      className="w-full px-3 py-2 bg-white dark:bg-[#202024] text-black dark:text-white border-2 border-black rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {pinMsg && (
                  <div
                    className={`p-2.5 border-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      pinMsg.type === 'success'
                        ? 'bg-green-100 text-green-800 border-green-700'
                        : 'bg-red-100 text-red-800 border-red-700'
                    }`}
                  >
                    {pinMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{pinMsg.text}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="font-display px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs sm:text-sm border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
                  >
                    Simpan PIN Baru
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: LOKASI PENYIMPANAN & CADANGAN DATA */}
          {activeTab === 'penyimpanan' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-[#BBF7D0] dark:bg-[#143823] text-black dark:text-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-display font-extrabold text-base flex items-center gap-1.5">
                    <Cloud className="w-5 h-5 text-green-700 dark:text-green-400" />
                    Database Real-time: Firebase Cloud Firestore Aktif
                  </h3>
                  <span className="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-mono-code font-bold">
                    Tersinkronisasi
                  </span>
                </div>
                <p className="text-xs font-normal leading-relaxed">
                  Database portofolio kini tersinkronisasi secara <strong>Real-time</strong> melalui Google Firebase Cloud Firestore. Setiap kali Anda mengubah biodata, mengunggah foto profil, atau memperbarui foto dokumentasi via PIN pengelola, perubahan langsung ter-update ke cloud secara otomatis dan tampil instan di semua perangkat pengunjung.
                </p>
                <div className="mt-2.5 p-2 bg-white/80 dark:bg-black/40 border border-black rounded-lg flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>
                    Akses Administrator Aktif via <strong>PIN Keamanan Pengelola</strong> (Tanpa perlu login akun Google eksternal).
                  </span>
                </div>
              </div>

              {/* Explanatory Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-50 dark:bg-[#18181B] border-2 border-black rounded-xl">
                  <span className="font-display font-bold text-black dark:text-white flex items-center gap-1.5 mb-1">
                    <Check className="w-4 h-4 text-green-600" />
                    Sinkronisasi Multi-Device
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Pengunjung atau klien dari HP, laptop, maupun tablet manapun akan melihat perubahan terbaru detik itu juga tanpa perlu reload halaman.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-[#18181B] border-2 border-black rounded-xl">
                  <span className="font-display font-bold text-black dark:text-white flex items-center gap-1.5 mb-1">
                    <Database className="w-4 h-4 text-[#FF6B00]" />
                    100% Cloud Firestore (Bukan LocalStorage)
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Foto profil, foto proyek, berkas CV, dan biodata disimpan langsung di Google Cloud Firestore. Tidak lagi bergantung pada memori lokal (localStorage) browser, sehingga data permanen dan dapat dilihat semua pengunjung.
                  </p>
                </div>
              </div>

              {/* Backup & Restore Action Section */}
              <div className="p-4 bg-neutral-50 dark:bg-[#18181B] border-2 border-black rounded-xl space-y-3">
                <h4 className="font-display text-xs font-extrabold uppercase text-black dark:text-white">
                  Fitur Cadangan & Pemulihan (Backup & Restore)
                </h4>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="font-display px-3.5 py-2 bg-[#BBF7D0] text-black font-extrabold text-xs border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Cadangan Lengkap (.json)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => restoreFileInputRef.current?.click()}
                    className="font-display px-3.5 py-2 bg-white dark:bg-[#202024] text-black dark:text-white font-extrabold text-xs border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pulihkan dari Berkas (.json)</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-black/15 dark:border-white/15">
                  {isConfirmingReset ? (
                    <div className="p-3 bg-red-50 dark:bg-red-950 border-2 border-red-500 rounded-xl space-y-2">
                      <p className="text-xs font-bold text-red-700 dark:text-red-300">
                        Apakah Anda yakin ingin mengembalikan seluruh data, foto, dan proyek ke pengaturan awal Asqi Faizul Ikmaludin?
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleExecuteResetAll}
                          className="font-display px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-extrabold hover:bg-red-700 cursor-pointer shadow-xs"
                        >
                          Ya, Reset Sekarang
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsConfirmingReset(false)}
                          className="font-display px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white rounded-lg text-xs font-bold hover:bg-neutral-300 cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingReset(true)}
                      className="font-display px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-black rounded-lg text-xs font-bold hover:bg-red-200 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Kembalikan Seluruh Data ke Default Bawaan</span>
                    </button>
                  )}
                </div>

                {storageMsg && (
                  <div
                    className={`p-2.5 border-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      storageMsg.type === 'success'
                        ? 'bg-green-100 text-green-800 border-green-700'
                        : 'bg-red-100 text-red-800 border-red-700'
                    }`}
                  >
                    {storageMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{storageMsg.text}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Save Action Bar */}
        <div className="pt-3 border-t-2 border-black/15 dark:border-white/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="font-display text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="w-4 h-4 stroke-[3]" />
                Seluruh foto & data berhasil disimpan ke portofolio!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="font-display px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white font-bold text-xs sm:text-sm border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:bg-neutral-300 cursor-pointer"
            >
              Tutup
            </button>
            <button
              id="admin-save-all-btn"
              type="button"
              onClick={() => handleSaveAll()}
              className="font-display px-5 py-2 bg-[#FF6B00] text-black font-extrabold text-xs sm:text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
