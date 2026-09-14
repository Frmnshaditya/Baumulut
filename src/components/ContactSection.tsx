import React, { useState } from 'react';
import { Mail, Send, Check, Copy, MessageSquare, Sparkles, Phone, Globe, MapPin, MessageCircle } from 'lucide-react';
import { ProfileData } from '../types';

interface ContactSectionProps {
  profile: ProfileData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profile.socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Harap isi semua kolom formulir sebelum mengirim pesan.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact-section" className="w-full max-w-3xl mx-auto px-6 sm:px-8 py-10">
      <div className="bg-white dark:bg-[#202024] border-3 border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000]">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 bg-[#FF6B00] border border-black rounded-lg shadow-[1.5px_1.5px_0px_0px_#000000]">
            <MessageSquare className="w-4 h-4 text-black stroke-[2.5]" />
          </span>
          <h2 id="contact-heading" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            Hubungi Saya (Kontak)
          </h2>
        </div>

        <p className="text-sm sm:text-base text-black dark:text-white mb-6 font-normal">
          Terbuka untuk diskusi kegiatan seminar, agenda moderasi acara, kolaborasi dokumentasi fotografi, maupun perbincangan inspiratif lainnya.
        </p>

        {/* Contact Info Cards (Direct from Page 7 of PDF) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Email */}
          <div className="p-3.5 bg-[#FFF4E0] dark:bg-[#2A2620] border-2 border-black rounded-xl flex items-center justify-between gap-2 shadow-[2px_2px_0px_0px_#000000]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Mail className="w-4 h-4 text-[#FF6B00] shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block font-mono">Email</span>
                <span className="font-mono-code text-xs sm:text-sm font-bold text-black dark:text-white select-all">
                  {profile.socials.email}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1.5 bg-white dark:bg-[#18181B] border border-black rounded-md shadow-xs hover:bg-[#FF6B00] transition-colors cursor-pointer shrink-0"
              title="Salin email"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Telepon / WhatsApp */}
          <a
            href={profile.socials.whatsapp || `tel:${profile.socials.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-[#BAE6FD] dark:bg-[#0369a1] border-2 border-black rounded-xl flex items-center justify-between gap-2 shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] text-black dark:text-white"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-black dark:text-white shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold opacity-75 block font-mono">Telepon / WA</span>
                <span className="font-mono-code text-xs sm:text-sm font-bold">
                  {profile.socials.phone || '083152414790'}
                </span>
              </div>
            </div>
            <MessageCircle className="w-4 h-4 text-black dark:text-white shrink-0" />
          </a>

          {/* Linktree */}
          <a
            href={profile.socials.linktree || 'https://linktr.ee/IKMLDN'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-[#BBF7D0] dark:bg-[#15803d] border-2 border-black rounded-xl flex items-center justify-between gap-2 shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] text-black dark:text-white"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-black dark:text-white shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold opacity-75 block font-mono">Linktree</span>
                <span className="font-mono-code text-xs sm:text-sm font-bold">
                  linktr.ee/IKMLDN
                </span>
              </div>
            </div>
            <span className="font-mono-code text-xs font-black">↗</span>
          </a>

          {/* Alamat */}
          <div className="p-3.5 bg-[#FED7AA] dark:bg-[#9a3412] border-2 border-black rounded-xl flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000000] text-black dark:text-white">
            <MapPin className="w-4 h-4 text-black dark:text-white shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold opacity-75 block font-mono">Domisili</span>
              <span className="font-display text-xs font-bold leading-tight line-clamp-2">
                Cluster Bungas, Kel. Peninggilan Utara, Kec. Ciledug, Prov. Banten.
              </span>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <form id="contact-message-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name-input" className="font-display block text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-1">
                Nama Lengkap
              </label>
              <input
                id="contact-name-input"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama Anda"
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label htmlFor="contact-email-input" className="font-display block text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-1">
                Email Anda
              </label>
              <input
                id="contact-email-input"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message-input" className="font-display block text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-1">
              Pesan
            </label>
            <textarea
              id="contact-message-input"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Assalamu'alaikum Asqi, kami ingin mengundang sebagai moderator seminar..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-[#18181B] text-black dark:text-white border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00] resize-y"
            />
          </div>

          {errorMsg && (
            <p className="font-display text-xs font-bold text-red-600 dark:text-red-400">{errorMsg}</p>
          )}

          {submitted ? (
            <div className="font-display p-3 bg-[#BBF7D0] border-2 border-black rounded-xl text-black font-bold text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
              <Sparkles className="w-5 h-5 text-green-700" />
              <span>Terima kasih! Pesan Anda telah terkirim. Asqi akan segera merespons Anda.</span>
            </div>
          ) : (
            <button
              id="contact-submit-btn"
              type="submit"
              className="font-display w-full sm:w-auto px-6 py-3 bg-[#FF6B00] text-black font-extrabold text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>Kirim Pesan</span>
            </button>
          )}
        </form>
      </div>
    </section>
  );
};
