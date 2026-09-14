import React, { useRef, useState } from 'react';
import { Camera, Sparkles, Upload, Wifi } from 'lucide-react';
import { ProfileData } from '../types';

interface LanyardBadgeProps {
  profile: ProfileData;
  onUpdateAvatar?: (newUrl: string) => void;
  isLoggedIn?: boolean;
  onOpenPersonalAdmin?: () => void;
}

export const LanyardBadge: React.FC<LanyardBadgeProps> = ({
  profile,
  onUpdateAvatar,
  isLoggedIn = false,
  onOpenPersonalAdmin,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    setTransformStyle({
      rotateX: -normY * 12,
      rotateY: normX * 14,
      rotateZ: normX * 4,
      scale: 1.02,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateAvatar) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultAvatar =
    profile.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';

  return (
    <div id="lanyard-container" className="flex flex-col items-center select-none pt-2 pb-6">
      {/* Hidden file input for uploading custom photo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload personal photo"
      />

      {/* LANYARD STRAP RIBBON (Top hanging strap) */}
      <div className="flex flex-col items-center">
        {/* Repeating fabric strap */}
        <div className="relative w-11 h-14 bg-[#18181B] dark:bg-[#111113] border-x-2 border-t-2 border-black flex items-center justify-center overflow-hidden shadow-sm">
          {/* Lanyard woven accent lines */}
          <div className="absolute inset-y-0 left-1.5 w-0.5 bg-[#FF6B00]" />
          <div className="absolute inset-y-0 right-1.5 w-0.5 bg-[#FF6B00]" />
          <span className="font-mono-code text-[7px] font-black text-[#FF6B00] tracking-widest rotate-90 whitespace-nowrap uppercase">
            UIN SAIZU
          </span>
        </div>

        {/* Metal Clip & Swivel Hook */}
        <div className="relative z-10 flex flex-col items-center -mt-0.5">
          {/* Strap clamp */}
          <div className="w-9 h-3.5 bg-neutral-300 dark:bg-neutral-600 border-2 border-black rounded-xs shadow-[1px_1px_0px_0px_#000000]" />
          {/* Carabiner swivel ring */}
          <div className="w-5 h-5 border-2 border-black bg-neutral-200 dark:bg-neutral-500 rounded-full flex items-center justify-center -mt-1 shadow-[1px_1px_0px_0px_#000000]">
            <div className="w-2.5 h-2.5 bg-white dark:bg-[#18181B] border border-black rounded-full" />
          </div>
          {/* Swivel snap hook passing through card hole */}
          <div className="w-3.5 h-4 bg-neutral-400 dark:bg-neutral-600 border-2 border-black rounded-xs -mt-1" />
        </div>
      </div>

      {/* INTERACTIVE 3D BADGE / ID CARD */}
      <div
        ref={cardRef}
        id="lanyard-id-card"
        style={{
          perspective: 1000,
          transform: `perspective(1000px) rotateX(${transformStyle.rotateX}deg) rotateY(${transformStyle.rotateY}deg) rotateZ(${transformStyle.rotateZ}deg) scale(${transformStyle.scale})`,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease-out',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative -mt-2 w-[270px] sm:w-[290px] bg-white dark:bg-[#1F1F23] border-3 border-black rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000000] cursor-grab active:cursor-grabbing hover:shadow-[8px_8px_0px_0px_#FF6B00]"
      >
        {/* Die-cut punch hole at the top of the badge */}
        <div className="w-12 h-2.5 mx-auto -mt-2 mb-3 bg-[#E8DDD0] dark:bg-[#121214] border-2 border-black rounded-full shadow-inner" />

        {/* Top Header: Badge Type & Live Status */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-black">
          <div className="flex items-center gap-1.5">
            <span className="font-mono-code px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#FF6B00] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000000]">
              SPEAKER & ADVENTURE
            </span>
            <span className="font-mono-code text-[10px] font-extrabold text-black dark:text-white">
              2026
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 border border-black rounded text-[10px] font-bold text-black dark:text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* PHOTO CONTAINER WITH BACKGROUND PATTERN */}
        <div className="relative mt-3.5 mb-3">
          {/* Neobrutalist graphic patterned background behind photo */}
          <div className="relative p-1.5 bg-[#FFF4E0] dark:bg-[#2A2620] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
            {/* Background geometric grid & dots */}
            <div className="relative rounded-lg overflow-hidden border border-black bg-neutral-200 dark:bg-neutral-800 aspect-[4/3.8] flex items-center justify-center">
              <img
                id="lanyard-photo"
                src={defaultAvatar}
                alt={profile.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Holographic / Smart Card Chip Badge overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-200/95 dark:bg-amber-400/90 text-black border border-black rounded px-1.5 py-0.5 text-[9px] font-mono-code font-bold shadow-[1px_1px_0px_0px_#000000]">
                <Wifi className="w-2.5 h-2.5 stroke-[2.5]" />
                <span>NFC PASS</span>
              </div>

              {/* Verified badge sticker */}
              <div className="absolute bottom-2 right-2 bg-[#FF6B00] text-black border border-black rounded px-1.5 py-0.5 text-[9px] font-display font-black flex items-center gap-1 shadow-[1px_1px_0px_0px_#000000]">
                <Sparkles className="w-2.5 h-2.5 text-black fill-black" />
                <span>VERIFIED</span>
              </div>

              {/* Change/Upload photo button trigger on hover (Only when logged in) */}
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPersonalAdmin) {
                      onOpenPersonalAdmin();
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  title="Ganti / Unggah Foto di Menu Pribadi"
                  className={`absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center gap-1 text-white text-xs font-bold transition-opacity cursor-pointer ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="p-2 bg-[#FF6B00] text-black border border-black rounded-full shadow-[2px_2px_0px_0px_#000000]">
                    <Camera className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="font-display font-bold mt-1 text-[11px] bg-black/80 px-2 py-0.5 rounded border border-white/40">
                    Menu Foto Pribadi
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BADGE CREDENTIAL DETAILS */}
        <div className="space-y-1 text-left">
          <div className="flex items-baseline justify-between gap-1">
            <h3
              id="lanyard-badge-name"
              className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-black dark:text-white leading-tight"
            >
              {profile.name}
            </h3>
            <span className="font-mono-code text-[10px] font-bold text-[#FF6B00] dark:text-[#FF7824]">
              {profile.location}
            </span>
          </div>

          <p
            id="lanyard-badge-role"
            className="font-display text-xs sm:text-sm font-bold text-black dark:text-white/90"
          >
            {profile.title}
          </p>
        </div>

        {/* Realistic Barcode & Badge ID Footer */}
        <div className="mt-3 pt-2.5 border-t-2 border-black flex items-center justify-between gap-2">
          {/* Stylized SVG Barcode */}
          <div className="flex flex-col">
            <div className="h-6 flex items-end gap-[1.5px] py-0.5">
              {[4, 2, 5, 3, 1, 4, 2, 6, 3, 1, 5, 2, 4, 3, 6, 2, 4, 1, 3, 5, 2].map((height, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-black dark:bg-white rounded-xs"
                  style={{ height: `${height * 3.5}px` }}
                />
              ))}
            </div>
            <span className="font-mono-code text-[8px] tracking-widest font-extrabold text-black dark:text-white mt-0.5">
              {profile.badgeId || 'REACT-2026-JD01'}
            </span>
          </div>

          {/* Action or credential badge */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                if (onOpenPersonalAdmin) {
                  onOpenPersonalAdmin();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="font-display px-2 py-1 text-[10px] font-extrabold bg-[#FF6B00] text-black border border-black rounded shadow-[1.5px_1.5px_0px_0px_#000000] flex items-center gap-1 transition-colors cursor-pointer"
              title="Kelola Foto di Menu Pribadi"
            >
              <Upload className="w-3 h-3 stroke-[2.5]" />
              <span>Ganti Foto</span>
            </button>
          ) : (
            <span className="font-mono-code px-2 py-0.5 text-[9px] font-extrabold bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-black rounded shadow-xs">
              UIN SAIZU PASS
            </span>
          )}
        </div>
      </div>

      {/* Subtle Hint */}
      <span className="font-mono-code text-[10px] font-bold text-black/60 dark:text-neutral-400 mt-2 flex items-center gap-1">
        <span>✦ Arahkan kursor untuk efek ayunan lanyard</span>
      </span>
    </div>
  );
};
