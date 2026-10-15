import React from 'react';
import { FOOTER_LINKS } from '../../data/navigation';
import { Building2, ShieldCheck, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#142421] text-[#EEF1EC] pt-16 pb-12 border-t border-[#24423C]">
      <div className="container">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#24423C]">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#10B981] border border-slate-700/60">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Bitfury<span className="text-[#10B981]">Tech</span>
              </span>
            </div>
            <p className="text-sm text-[#A0A8A5] leading-relaxed">
              Institutional-grade tokenized real estate and digital infrastructure. Ring-fenced SPV custody, independent RICS valuations, and automated monthly distributions.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>EU Compliant SPV Asset Ring-Fencing</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-[#A0A8A5]">
              {FOOTER_LINKS.platform.map((item) => (
                <li key={`plat-${item.label}-${item.path}`}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-bold mb-4">Legal & Regulatory</h4>
            <ul className="space-y-2.5 text-sm text-[#A0A8A5]">
              {FOOTER_LINKS.legal.map((item) => (
                <li key={`leg-${item.label}-${item.path}`}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-bold mb-4">Contact & Presence</h4>
            <div className="space-y-3 text-sm text-[#A0A8A5]">
              {FOOTER_LINKS.support.map((item) => (
                <div key={`sup-${item.label}-${item.path}`}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-white transition-colors text-left text-xs"
                  >
                    {item.label}
                  </button>
                </div>
              ))}
              <div className="flex items-start gap-2.5 pt-2">
                <MapPin className="w-4 h-4 text-[#B7E36A] shrink-0 mt-1" />
                <span>Paseo de la Castellana 95, 28046 Madrid, Spain</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B7E36A] shrink-0" />
                <span>support@reental-log.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Risk Warning */}
        <div className="py-8 border-b border-[#24423C] text-xs text-[#828D89] leading-relaxed">
          <p className="font-semibold text-[#A0A8A5] mb-2 uppercase tracking-wider text-[11px]">
            Statutory Investor Risk Notice & Regulatory Disclosure:
          </p>
          <p>
            Participation in fractional real estate assets carries substantial risks, including the potential risk of total or partial capital loss, real estate market illiquidity, and tenancy vacancy risks. Past performance and projected returns displayed on this platform are estimates based on independent third-party appraisals and conservative financial modeling, not guarantees of future performance. BitfuryTech operates through registered Special Purpose Vehicles (SPVs) under applicable European commercial legislation. Nothing on this platform should be construed as financial or tax advice. Investors should carefully review the legal offering documentation and risk disclosures before committing funds.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#828D89] gap-4">
          <p>© {new Date().getFullYear()} BitfuryTech Capital S.L. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/privacy')} className="hover:text-white">Privacy Policy</button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-white">Terms of Use</button>
            <button onClick={() => onNavigate('/contact')} className="hover:text-white">Direct Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
