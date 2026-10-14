import React from 'react';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface FinalCTAProps {
  onRegister: () => void;
  onExplore: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onRegister, onExplore }) => {
  return (
    <section className="section section--dark relative overflow-hidden py-20">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24423C] text-[#B7E36A] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Regulated European Participatory Investing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Start Earning Monthly Real Estate Cashflow Today
          </h2>

          <p className="text-base sm:text-lg text-[#A0A8A5] max-w-xl mx-auto">
            Join over 1,400+ investors building passive income with tokenized European properties. Setup takes 2 minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onRegister}
              className="btn btn-accent px-8 font-bold text-sm shadow-xl"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={onExplore}
              className="btn btn-secondary px-7 font-semibold text-sm bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              View Active Properties
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#A0A8A5] pt-6 border-t border-[#24423C]">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#B7E36A]" /> No mortgage required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#B7E36A]" /> €100 minimum entry
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#B7E36A]" /> Monthly automated bank payouts
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
