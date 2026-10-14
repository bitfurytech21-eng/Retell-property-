import React from 'react';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface FinalCTAProps {
  onRegister: () => void;
  onExplore: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onRegister, onExplore }) => {
  return (
    <section className="relative overflow-hidden py-20 bg-[#031914] text-white border-t border-emerald-900/50">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00FF9D]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-[1240px] mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[#00FF9D] text-xs font-bold shadow-lg">
            <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />
            <span>Regulated European Participatory Investing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Start Earning Monthly Real Estate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-teal-300">Cashflow Today</span>
          </h2>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl mx-auto font-medium">
            Join over 12,400+ investors building passive income with tokenized European properties. Setup takes under 2 minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={onRegister}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00E676] to-[#00C853] hover:from-[#00FF9D] hover:to-[#00E676] text-[#031914] font-extrabold text-sm shadow-xl shadow-[#00E676]/25 hover:shadow-[#00E676]/40 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExplore}
              className="px-7 py-4 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-white font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              View Active Opportunities
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-emerald-200/90 pt-6 border-t border-emerald-900/60">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00FF9D]" /> Minimum Startup €1,000
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00FF9D]" /> Institutional-Grade SPV Security
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00FF9D]" /> Automated Monthly Dividends
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

