import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Calculator, TrendingUp, Sparkles, Building2, Coins, ExternalLink, ChevronRight, Star } from 'lucide-react';
import { HouseBackgroundAnimation } from './HouseBackgroundAnimation';

interface HeroProps {
  onExplore: () => void;
  onHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onHowItWorks }) => {
  const [heroTab, setHeroTab] = useState<'asset' | 'calculator'>('asset');
  const [simAmount, setSimAmount] = useState<number>(2500);

  // Calculations for ROI Simulator
  const annualYield = 0.126; // 12.6% avg yield
  const estimatedMonthly = Math.round((simAmount * annualYield) / 12);
  const projected3Year = Math.round(simAmount * (1 + annualYield * 3 + 0.08)); // yield + estimated capital appreciation
  const tokensCount = Math.floor(simAmount / 100);

  return (
    <div className="relative bg-[#071714] text-white overflow-hidden border-b border-emerald-900/40">
      {/* Restrained Architectural Blueprint Line Geometry */}
      <HouseBackgroundAnimation />

      {/* Hero Section Container */}
      <section className="relative z-10 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="container max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: BitfuryTech Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Dignified Institutional Kicker */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>BitfuryTech Institutional Real Estate</span>
                <span className="text-emerald-700">·</span>
                <span className="text-slate-300 normal-case font-normal">Ring-Fenced European SPV Structure</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white">
                Fractional Real Estate Investment with{' '}
                <span className="text-emerald-400">
                  Institutional Governance
                </span>
              </h1>

              {/* Subheadline Description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Access curated European residential and commercial property offerings. 
                Receive automated monthly rental distributions directly to your account, protected by independent SPV custody and transparent legal documentation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onExplore}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
                >
                  <span>View Property Offerings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setHeroTab('calculator')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-sm transition-colors cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Simulate Projections</span>
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-emerald-900/50 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Ring-Fenced SPVs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated Monthly Yields</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secondary Liquidity Desk</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Showcase Widget */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-[#0B1E19] border border-emerald-800/40 shadow-xl overflow-hidden">
                
                {/* Widget Segmented Tabs */}
                <div className="flex items-center border-b border-emerald-900/60 bg-[#061512] p-1.5 gap-1.5">
                  <button
                    onClick={() => setHeroTab('asset')}
                    className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      heroTab === 'asset'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Featured Asset</span>
                  </button>

                  <button
                    onClick={() => setHeroTab('calculator')}
                    className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      heroTab === 'calculator'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Yield Calculator</span>
                  </button>
                </div>

                {/* TAB 1: FEATURED PROPERTY ASSET */}
                {heroTab === 'asset' && (
                  <div className="p-5 space-y-4">
                    <div className="relative h-48 sm:h-52 rounded-lg overflow-hidden group bg-slate-900">
                      <img
                        src="https://files.kretzrealestate.com/5534a64054a86115d0d81384cb413d7c.jpg"
                        alt="ROQUEBRUNE-CAP-MARTIN - Ramingao - Golf Bleu"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Status indicator */}
                      <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 px-2.5 py-0.5 rounded text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Active Offering · 78% Funded</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">Roquebrune-Cap-Martin · French Riviera</span>
                        <h3 className="text-base font-bold text-white truncate">ROQUEBRUNE - Ramingao Golf Bleu</h3>
                      </div>
                    </div>

                    {/* Asset Key Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[#061512] border border-emerald-900/60 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">Net Yield</span>
                        <span className="text-base font-bold text-emerald-400">7.5%</span>
                      </div>
                      <div className="border-x border-emerald-900/60">
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">Token Price</span>
                        <span className="text-base font-bold text-white">€100</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium block">Target Return</span>
                        <span className="text-base font-bold text-emerald-300">11.0%</span>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-300">Funded: €4,602,000</span>
                        <span className="text-slate-400">Target: €5,900,000</span>
                      </div>
                      <div className="w-full h-2 rounded bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded" style={{ width: '78%' }} />
                      </div>
                    </div>

                    <button
                      onClick={onExplore}
                      className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Review Offering Memorandum</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* TAB 2: ROI SIMULATOR CALCULATOR */}
                {heroTab === 'calculator' && (
                  <div className="p-5 space-y-4 text-left">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Investment Capital
                        </label>
                        <span className="text-xl font-bold text-emerald-400 font-mono">
                          €{simAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Range Input Slider */}
                      <input
                        type="range"
                        min={100}
                        max={25000}
                        step={100}
                        value={simAmount}
                        onChange={(e) => setSimAmount(Number(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                        <span>Min €100</span>
                        <span>€10,000</span>
                        <span>Max €25,000</span>
                      </div>
                    </div>

                    {/* Calculation Results */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#061512] border border-emerald-900/60 space-y-1">
                        <span className="text-[11px] text-slate-400 font-medium block">Est. Monthly Distributions</span>
                        <span className="text-lg font-bold text-emerald-400 font-mono">€{estimatedMonthly} <span className="text-xs font-normal text-slate-400">/mo</span></span>
                      </div>

                      <div className="p-3 rounded-lg bg-[#061512] border border-emerald-900/60 space-y-1">
                        <span className="text-[11px] text-slate-400 font-medium block">Projected 3-Yr Total</span>
                        <span className="text-lg font-bold text-white font-mono">€{projected3Year.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                      <span>Fractional Units ({tokensCount} tokens):</span>
                      <span className="font-semibold text-white font-mono">€100 / unit</span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-tight">
                      *Estimations are modeled on a target 12.6% annualized return (rental yield + projected capital appreciation). Not guaranteed.
                    </p>

                    <button
                      onClick={onExplore}
                      className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Explore Properties at €{simAmount.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VERIFIED INSTITUTIONAL STANDARDS BAR */}
      <div className="border-t border-emerald-900/60 bg-[#040F0D] py-4">
        <div className="container max-w-[1240px] mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Institutional Due Diligence Standards
            </span>
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-medium">
              <span>RICS Valuation Standards</span>
              <span>·</span>
              <span>Ring-Fenced Asset SPVs</span>
              <span>·</span>
              <span>Audited Notarial Titling</span>
              <span>·</span>
              <span>Automated Monthly Settlement</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

