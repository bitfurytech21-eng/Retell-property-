import React from 'react';
import { TrendingUp, ShieldCheck, Users, Building2 } from 'lucide-react';

export const PlatformStats: React.FC = () => {
  const stats = [
    {
      icon: Building2,
      value: '€1.4B+',
      label: 'Portfolio Under Management',
      subtitle: 'Across 200+ prestige estates, châteaux & villas',
    },
    {
      icon: TrendingUp,
      value: '12.8%',
      label: 'Average Annual IRR',
      subtitle: 'Audited net rental & capital appreciation',
    },
    {
      icon: Users,
      value: '12,400+',
      label: 'Active Global Investors',
      subtitle: 'Spread across 85+ countries worldwide',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'On-Time Distributions',
      subtitle: 'Over 48 consecutive months of paid dividends',
    },
  ];

  return (
    <section className="bg-[#05211B] text-white border-b border-emerald-900/50 py-12">
      <div className="container max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#031914] border border-emerald-500/20 hover:border-emerald-400/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-[#00FF9D] mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-[#00FF9D] tracking-tight block mb-1">
                  {s.value}
                </span>
                <span className="text-sm font-bold text-white block mb-0.5">
                  {s.label}
                </span>
                <span className="text-xs text-emerald-200/70">
                  {s.subtitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

