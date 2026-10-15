import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Calculator, TrendingUp, Sparkles, Building2, Coins, ExternalLink, ChevronRight, Star } from 'lucide-react';

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
    <div className="relative bg-[#031914] text-white overflow-hidden border-b border-emerald-900/40">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-[#00FF9D]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section Container */}
      <section className="relative z-10 pt-8 pb-16 lg:pt-14 lg:pb-20">
        <div className="container max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Reental Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Announcement Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium shadow-inner backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="font-semibold text-[#00FF9D] tracking-wide uppercase text-[11px]">Reental Tokenized Assets</span>
                <span className="text-emerald-500">•</span>
                <span className="text-gray-200">Over €28.5M Financed Worldwide</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Invest in Real Estate in a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] via-emerald-300 to-teal-200">
                  Simple, Fast & Liquid
                </span>{' '}
                Way
              </h1>

              {/* Subheadline Description */}
              <p className="text-base sm:text-lg text-emerald-100/70 max-w-2xl leading-relaxed font-normal">
                Access prime institutional European & US real estate tokens. 
                Receive automated monthly rental dividends directly in your wallet with 100% asset ring-fencing and secondary peer-to-peer liquidity.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onExplore}
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00E676] to-[#00C853] hover:from-[#00FF9D] hover:to-[#00E676] text-[#031914] font-extrabold text-base shadow-lg shadow-[#00E676]/25 hover:shadow-[#00E676]/40 transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setHeroTab('calculator')}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-white font-bold text-base backdrop-blur-sm transition-all duration-200 cursor-pointer"
                >
                  <Calculator className="w-5 h-5 text-[#00FF9D]" />
                  <span>Simulate ROI</span>
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-emerald-900/60 text-xs font-semibold text-emerald-200/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                  <span>100% SPV Ring-Fenced</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                  <span>Monthly Rental Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                  <span>Secondary Liquidity</span>
                </div>
              </div>
            </div>

            {/* Right Column: Reental Interactive Showcase Widget */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-[#06241D] border border-emerald-500/30 shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl">
                
                {/* Widget Header Tabs */}
                <div className="flex items-center border-b border-emerald-900/60 bg-[#041D17]/80 p-2 gap-2">
                  <button
                    onClick={() => setHeroTab('asset')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      heroTab === 'asset'
                        ? 'bg-[#00E676] text-[#031914] shadow-md shadow-[#00E676]/20'
                        : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Featured Asset</span>
                  </button>

                  <button
                    onClick={() => setHeroTab('calculator')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      heroTab === 'calculator'
                        ? 'bg-[#00E676] text-[#031914] shadow-md shadow-[#00E676]/20'
                        : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>ROI Calculator</span>
                  </button>
                </div>

                {/* TAB 1: FEATURED PROPERTY ASSET */}
                {heroTab === 'asset' && (
                  <div className="p-5 space-y-4 animate-in fade-in duration-200">
                    <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden group">
                      <img
                        src="https://files.kretzrealestate.com/5534a64054a86115d0d81384cb413d7c.jpg"
                        alt="ROQUEBRUNE-CAP-MARTIN - Ramingao - Golf Bleu"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#06241D] via-transparent to-black/30" />
                      
                      {/* Live Badge */}
                      <div className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-400/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold text-[#00FF9D]">
                        <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                        <span>LIVE OFFERING • 78% FUNDED</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">Prestige Villa • Roquebrune-Cap-Martin, French Riviera</span>
                        <h3 className="text-base font-extrabold text-white truncate">ROQUEBRUNE - Ramingao Golf Bleu</h3>
                      </div>
                    </div>

                    {/* Asset Key Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#031A14] border border-emerald-900/50 text-center">
                      <div>
                        <span className="text-[10px] text-emerald-400/80 uppercase font-semibold block">Net Yield</span>
                        <span className="text-base font-black text-[#00FF9D]">7.5%</span>
                      </div>
                      <div className="border-x border-emerald-900/50">
                        <span className="text-[10px] text-emerald-400/80 uppercase font-semibold block">Token Price</span>
                        <span className="text-base font-black text-white">€100</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400/80 uppercase font-semibold block">Total Return</span>
                        <span className="text-base font-black text-emerald-300">11.0%</span>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-emerald-300">Funded: €4,602,000</span>
                        <span className="text-emerald-400">Target: €5,900,000</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-emerald-950 overflow-hidden p-0.5 border border-emerald-900">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#00FF9D] w-[78%]" />
                      </div>
                    </div>

                    <button
                      onClick={onExplore}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#00E676] hover:bg-[#00FF9D] text-[#031914] font-extrabold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Invest in this Property</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* TAB 2: ROI SIMULATOR CALCULATOR */}
                {heroTab === 'calculator' && (
                  <div className="p-5 space-y-5 animate-in fade-in duration-200 text-left">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                          Investment Capital
                        </label>
                        <span className="text-2xl font-black text-[#00FF9D]">
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
                        className="w-full accent-[#00E676] bg-emerald-950 rounded-lg h-2 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-emerald-400/60 font-semibold mt-1">
                        <span>Min €100</span>
                        <span>€10,000</span>
                        <span>Max €25,000</span>
                      </div>
                    </div>

                    {/* Calculation Results */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#031A14] border border-emerald-900/60 space-y-1">
                        <span className="text-[11px] text-emerald-300 font-semibold block">Est. Monthly Dividends</span>
                        <span className="text-xl font-black text-[#00FF9D]">€{estimatedMonthly} <span className="text-xs font-normal text-emerald-400">/mo</span></span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#031A14] border border-emerald-900/60 space-y-1">
                        <span className="text-[11px] text-emerald-300 font-semibold block">Projected 3-Yr Value</span>
                        <span className="text-xl font-black text-white">€{projected3Year.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200/90 flex items-center justify-between">
                      <span>Tokens Received ({tokensCount} units):</span>
                      <span className="font-bold text-white">€100 / token</span>
                    </div>

                    <button
                      onClick={onExplore}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00C853] hover:from-[#00FF9D] hover:to-[#00E676] text-[#031914] font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00E676]/20"
                    >
                      <span>Start Investing €{simAmount.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REENTAL MEDIA & PRESS LOGOS TICKER BAR */}
      <div className="border-t border-emerald-900/60 bg-[#02110D]/90 py-5">
        <div className="container max-w-[1240px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400/80">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-white font-extrabold">4.9 / 5</span>
              <span>Trusted by 12,400+ Global Investors</span>
            </div>

            {/* Media Publication Logos */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300 text-xs font-black tracking-widest text-emerald-200/80 uppercase">
              <span className="hover:text-white transition-colors">FORBES</span>
              <span className="hover:text-white transition-colors">TECHCRUNCH</span>
              <span className="hover:text-white transition-colors">EL PAÍS</span>
              <span className="hover:text-white transition-colors">BLOOMBERG</span>
              <span className="hover:text-white transition-colors">EXPANSIÓN</span>
              <span className="hover:text-white transition-colors">BUSINESS INSIDER</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

