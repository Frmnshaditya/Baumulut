import React from 'react';
import { Mic, Users, GraduationCap, Compass } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const stats = [
    {
      id: 'stat-moderator',
      label: 'Moderator Acara (SMK CBM)',
      value: '2025',
      icon: Mic,
      bg: 'bg-[#FEF08A] dark:bg-[#ca8a04]',
    },
    {
      id: 'stat-organisasi',
      label: 'Pengalaman Organisasi',
      value: '3+',
      icon: Users,
      bg: 'bg-[#BAE6FD] dark:bg-[#0284c7]',
    },
    {
      id: 'stat-pendidikan',
      label: 'Jenjang Pendidikan',
      value: '4',
      icon: GraduationCap,
      bg: 'bg-[#BBF7D0] dark:bg-[#16a34a]',
    },
    {
      id: 'stat-adventure',
      label: 'Adventure & Fotografi',
      value: '100%',
      icon: Compass,
      bg: 'bg-[#FED7AA] dark:bg-[#ea580c]',
    },
  ];

  return (
    <section id="quick-stats-section" className="w-full max-w-3xl mx-auto px-6 sm:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              id={stat.id}
              className={`${stat.bg} border-2 border-black rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000000] text-black transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono-code text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {stat.value}
                </span>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 opacity-90 stroke-[2.5]" />
              </div>
              <p className="font-display text-xs sm:text-sm font-bold tracking-tight leading-snug">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
