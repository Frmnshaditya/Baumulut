import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { verifyPIN, setAuthenticatedSession, getStoredPIN } from '../utils/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const currentPin = getStoredPIN();
  const isDefaultPin = currentPin === 'asqi2026';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('Harap masukkan PIN / kata sandi pribadi Anda.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      if (verifyPIN(pin)) {
        setAuthenticatedSession(true);
        setPin('');
        setLoading(false);
        onLoginSuccess();
      } else {
        setLoading(false);
        setErrorMsg('PIN / kata sandi salah. Silakan coba lagi.');
      }
    }, 200);
  };

  const handleUseDefault = () => {
    setPin('asqi2026');
    setErrorMsg('');
  };

  return (
    <div
      id="login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="login-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-[#1E1E22] border-3 border-black rounded-2xl p-6 sm:p-7 shadow-[8px_8px_0px_0px_#000000] text-black dark:text-white"
      >
        {/* Close Button */}
        <button
          id="login-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 bg-[#FF6B00] border-2 border-black rounded-lg text-black hover:bg-orange-600 transition-transform active:scale-95 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
          aria-label="Tutup jendela login"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="p-2 bg-[#FF6B00] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000000]">
            <Lock className="w-5 h-5 text-black stroke-[2.5]" />
          </span>
          <div>
            <h2
              id="login-modal-title"
              className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white"
            >
              Login Pengelola Portofolio
            </h2>
            <span className="font-mono-code text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
              Akses Pribadi Tanpa Akun Pihak Ketiga
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-black dark:text-white mt-3 mb-5 font-normal leading-relaxed">
          Masukkan kode PIN pengelola portofolio untuk mengubah biodata, foto profil, dokumentasi karya, atau berkas CV secara langsung.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-pin-input"
              className="font-display block text-xs font-extrabold uppercase tracking-wider mb-1.5 text-black dark:text-white"
            >
              PIN / Kata Sandi Pengelola
            </label>

            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/60 dark:text-neutral-400" />
              <input
                id="login-pin-input"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Masukkan PIN pengelola..."
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                title={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-100 dark:bg-red-950/50 border-2 border-red-600 rounded-xl flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Default PIN Hint */}
          {isDefaultPin && (
            <div className="p-3 bg-[#FFF4E0] dark:bg-[#2A2620] border-2 border-black rounded-xl text-xs space-y-1 shadow-[2px_2px_0px_0px_#000000]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black dark:text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
                  PIN Bawaan Asli:
                </span>
                <button
                  type="button"
                  onClick={handleUseDefault}
                  className="font-mono-code font-bold underline text-[#FF6B00] hover:text-orange-600 cursor-pointer"
                >
                  Gunakan PIN Ini
                </button>
              </div>
              <div className="font-mono-code font-bold text-black dark:text-white bg-white dark:bg-black px-2 py-1 rounded border border-black inline-block">
                asqi2026
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#FF6B00] text-black font-extrabold text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-transform"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>{loading ? 'Memverifikasi...' : 'Buka Dashboard Pengelola'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
