import React from 'react';

export const PlatformStats: React.FC = () => {
  const stats = [
    { value: '€4.8M+', label: 'Total Volume Funded', subtitle: 'Over 24 successful property projects' },
    { value: '12.4%', label: 'Average Annual Yield', subtitle: 'Audited net rental & capital return' },
    { value: '1,420+', label: 'Active Retail Investors', subtitle: 'Across 38 European and global nations' },
    { value: '100%', label: 'On-Time Distributions', subtitle: 'Never missed a scheduled monthly dividend' },
  ];

  return (
    <section className="bg-white border-y border-[#E3E8E3] py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#E3E8E3]">
          {stats.map((s, idx) => (
            <div key={idx} className={`pt-4 md:pt-0 ${idx > 0 ? 'md:pl-6' : ''}`}>
              <span className="text-3xl lg:text-4xl font-black text-[#182D2A] tracking-tight block mb-1">
                {s.value}
              </span>
              <span className="text-sm font-bold text-[#18211F] block mb-0.5">
                {s.label}
              </span>
              <span className="text-xs text-[#69736F]">
                {s.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
