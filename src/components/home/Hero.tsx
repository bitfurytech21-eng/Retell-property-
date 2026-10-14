import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onHowItWorks }) => {
  return (
    <section className="hero">
      <div className="container hero-inner">
        {/* Left Column: Headline and Call to Actions */}
        <div className="hero-content">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3E8E3] text-[#182D2A] text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#27845D]" />
            <span>Institutional-Grade European Fractional Real Estate</span>
          </div>

          <h1 className="hero-title text-[#18211F] font-black tracking-tight leading-[1.08] mb-6">
            Invest in High-Yield Real Estate from <span className="text-[#27845D]">€100</span>
          </h1>

          <p className="hero-description text-[#69736F] text-lg leading-relaxed mb-8">
            Build a diversified property portfolio without mortgages or property management headaches. 
            Acquire tokenized real estate assets, earn monthly rental dividends directly in your wallet, 
            and participate in capital appreciation.
          </p>

          <div className="hero-actions flex flex-wrap gap-3.5 mb-10">
            <button
              onClick={onExplore}
              className="btn btn-primary shadow-lg shadow-[#182D2A]/15 text-sm font-bold px-7"
            >
              Explore Properties
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={onHowItWorks}
              className="btn btn-secondary text-sm font-semibold px-6"
            >
              How It Works
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E3E8E3]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#18211F]">
              <CheckCircle2 className="w-4 h-4 text-[#27845D] shrink-0" />
              <span>Monthly Dividends</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#18211F]">
              <ShieldCheck className="w-4 h-4 text-[#27845D] shrink-0" />
              <span>SPV Ring-Fenced</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#18211F]">
              <CheckCircle2 className="w-4 h-4 text-[#27845D] shrink-0" />
              <span>Secondary Liquidity</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Media Showcase */}
        <div className="hero-media relative rounded-3xl overflow-hidden shadow-2xl border border-white">
          <img
            src="/src/assets/images/hero_real_estate_1791998371047.jpg"
            alt="Luxury Architectural Residential Villa"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Live Overlay Card */}
          <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#69736F] uppercase tracking-wider block">
                Average Platform Net Yield
              </span>
              <span className="text-xl font-black text-[#27845D]">12.4% Annual Return</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-[#69736F] uppercase tracking-wider block">
                Next Payout
              </span>
              <span className="text-sm font-bold text-[#18211F]">1st of Month</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
