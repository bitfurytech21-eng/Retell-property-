import React from 'react';
import { ShieldCheck, Award, Linkedin, Twitter, Globe, ArrowRight, Building2, Users } from 'lucide-react';

interface TeamPageProps {
  onExplore: () => void;
  onContact: () => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onExplore, onContact }) => {
  const teamMembers = [
    {
      name: 'Eric Sánchez Gálvez',
      role: 'CEO & Co-Founder',
      bio: 'Former professional basketball player and IT engineer. Co-founder of Chekin and Reental. Passionate about democratizing real estate investment globally through blockchain.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      location: 'Madrid, Spain',
    },
    {
      name: 'Fernando Ors',
      role: 'Chairman & Co-Founder',
      bio: 'Seasoned executive and President of the Americas region. Leads institutional scaling and international regulatory compliance for tokenized assets.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
      location: 'Miami, USA',
    },
    {
      name: 'Carla Castelló',
      role: 'Chief Operating Officer (COO)',
      bio: 'Oversees day-to-day operational excellence, investor relations, and cross-border property acquisitions across European urban markets.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
      location: 'Valencia, Spain',
    },
    {
      name: 'Javier Ortiz',
      role: 'CTO & Co-Founder',
      bio: 'Blockchain architecture and smart contract security expert. Architected Reental’s automated monthly dividend distribution engine on Polygon POS.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
      location: 'Barcelona, Spain',
    },
    {
      name: 'Miguel Caballero',
      role: 'Global Advisor & Co-Founder',
      bio: 'Pioneer in Web3 technologies and digital tokenization models. Advises on global tokenomics, liquidity frameworks, and strategic ecosystem growth.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
      location: 'Madrid, Spain',
    },
    {
      name: 'Jose Aguilar',
      role: 'Real Estate & Legal Manager',
      bio: 'Manages RICS property appraisals, SPV corporate structuring, and legal compliance across Spanish and international jurisdictions.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
      location: 'Seville, Spain',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F4] text-[#18211F]">
      {/* Hero Header */}
      <section className="bg-[#031914] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FF9D]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="container max-w-[1240px] mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[#00FF9D] text-xs font-bold shadow-lg">
            <Users className="w-4 h-4 text-[#00FF9D]" />
            <span>Leadership & Vision</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-teal-300">Reental Team</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto">
            We are a multidisciplinary group of real estate veterans, blockchain engineers, and financial experts united by a mission to make real estate investment borderless, liquid, and accessible to everyone.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 container max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#E3E8E3] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-72 overflow-hidden bg-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold text-[#00FF9D] uppercase tracking-wider block mb-1">
                    {member.role}
                  </span>
                  <h3 className="text-xl font-extrabold">{member.name}</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-[#69736F] leading-relaxed">
                  {member.bio}
                </p>

                <div className="pt-4 border-t border-[#E3E8E3] flex items-center justify-between text-xs text-[#69736F]">
                  <span className="font-semibold">{member.location}</span>
                  <div className="flex items-center gap-2">
                    <a href="#linkedin" className="w-8 h-8 rounded-lg bg-[#EEF1EC] hover:bg-[#182D2A] hover:text-[#B7E36A] flex items-center justify-center transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#twitter" className="w-8 h-8 rounded-lg bg-[#EEF1EC] hover:bg-[#182D2A] hover:text-[#B7E36A] flex items-center justify-center transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advisory & Mission Banner */}
      <section className="py-16 bg-white border-t border-[#E3E8E3]">
        <div className="container max-w-[1240px] mx-auto px-4">
          <div className="bg-[#031914] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-[#00FF9D]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="space-y-4 max-w-xl relative z-10 text-left">
              <span className="text-xs font-bold text-[#00FF9D] uppercase tracking-wider">Join Our Ecosystem</span>
              <h2 className="text-3xl sm:text-4xl font-black">Ready to build your digital real estate portfolio?</h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Start investing in institutional European properties with minimums starting from €1,000 and automated monthly dividends.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 relative z-10">
              <button
                onClick={onExplore}
                className="px-8 py-4 rounded-2xl bg-[#00E676] hover:bg-[#00FF9D] text-[#031914] font-extrabold text-sm transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onContact}
                className="px-7 py-4 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-white font-bold text-sm transition-colors"
              >
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
