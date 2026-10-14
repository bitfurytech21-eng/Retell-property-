import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '../../lib/utils';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

interface InvestmentMetricsProps {
  propertyYield: number; // e.g. 11.4%
  appreciationYield: number; // e.g. 4.2%
  durationMonths: number;
  tokenPrice?: number;
  onInvestClick?: (amount: number) => void;
}

export const InvestmentMetrics: React.FC<InvestmentMetricsProps> = ({
  propertyYield,
  appreciationYield,
  durationMonths,
  tokenPrice = 100,
  onInvestClick,
}) => {
  const [amount, setAmount] = useState<number>(1000);

  const tokenCount = Math.floor(amount / tokenPrice);
  const effectiveAmount = tokenCount * tokenPrice;

  // Monthly yield
  const annualRentalYieldAmount = (effectiveAmount * (propertyYield / 100));
  const monthlyRentalYield = annualRentalYieldAmount / 12;

  // Capital appreciation over duration
  const totalYears = durationMonths / 12;
  const estimatedCapitalGain = effectiveAmount * (appreciationYield / 100) * totalYears;
  const totalRentalIncomePeriod = annualRentalYieldAmount * totalYears;
  const totalEstimatedReturnPeriod = totalRentalIncomePeriod + estimatedCapitalGain;
  const totalEstimatedPortfolioValue = effectiveAmount + totalEstimatedReturnPeriod;

  const quickAmounts = [1000, 2500, 5000, 10000, 25000];

  return (
    <div className="bg-[#182D2A] text-white p-6 sm:p-8 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#24423C] flex items-center justify-center text-[#B7E36A]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Investment Return Simulator</h3>
            <p className="text-xs text-[#A0A8A5]">Projected dividend cashflow and capital growth (Min: €1,000)</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#A0A8A5] block">Token Unit Price</span>
          <span className="text-sm font-bold text-[#B7E36A]">{formatCurrency(tokenPrice)} / token</span>
        </div>
      </div>

      {/* Input Slider */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-[#A0A8A5] uppercase tracking-wider">
            Simulated Contribution (Min: €1,000)
          </label>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(effectiveAmount)}
            <span className="text-xs font-normal text-[#A0A8A5] ml-2">({tokenCount} Tokens)</span>
          </div>
        </div>

        <input
          type="range"
          min={1000}
          max={50000}
          step={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-[#B7E36A] h-2 bg-[#24423C] rounded-lg cursor-pointer"
        />

        {/* Quick Amount Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {quickAmounts.map((q) => (
            <button
              key={q}
              onClick={() => setAmount(q)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                amount === q
                  ? 'bg-[#B7E36A] text-[#18211F]'
                  : 'bg-[#24423C] text-[#EEF1EC] hover:bg-[#2e544c]'
              }`}
            >
              €{q.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#142421] p-4 rounded-2xl border border-[#24423C]">
          <span className="text-xs text-[#A0A8A5] block mb-1">Est. Monthly Dividend</span>
          <span className="text-xl font-bold text-[#B7E36A]">
            {formatCurrency(monthlyRentalYield)}
            <span className="text-xs font-normal text-[#A0A8A5]"> /mo</span>
          </span>
          <span className="text-[11px] text-[#A0A8A5] block mt-1">Paid directly to wallet</span>
        </div>

        <div className="bg-[#142421] p-4 rounded-2xl border border-[#24423C]">
          <span className="text-xs text-[#A0A8A5] block mb-1">Total {totalYears}-Yr Dividends</span>
          <span className="text-xl font-bold text-white">
            {formatCurrency(totalRentalIncomePeriod)}
          </span>
          <span className="text-[11px] text-[#27845D] block mt-1">
            {formatPercent(propertyYield)} net annual rent
          </span>
        </div>

        <div className="bg-[#142421] p-4 rounded-2xl border border-[#24423C]">
          <span className="text-xs text-[#A0A8A5] block mb-1">Est. Capital Growth</span>
          <span className="text-xl font-bold text-white">
            {formatCurrency(estimatedCapitalGain)}
          </span>
          <span className="text-[11px] text-[#B7E36A] block mt-1">
            +{formatPercent(appreciationYield * totalYears)} upon asset sale
          </span>
        </div>
      </div>

      {/* Summary Highlight */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#24423C]/50 border border-[#24423C] mb-6">
        <div>
          <span className="text-xs text-[#A0A8A5] block">Total Estimated Payout at Maturity ({durationMonths} Mo)</span>
          <span className="text-2xl font-black text-white">
            {formatCurrency(totalEstimatedPortfolioValue)}
          </span>
          <span className="text-xs text-[#B7E36A] font-semibold ml-2">
            (+{formatCurrency(totalEstimatedReturnPeriod)} net gain)
          </span>
        </div>

        {onInvestClick && (
          <button
            onClick={() => onInvestClick(effectiveAmount)}
            className="btn btn-accent w-full sm:w-auto text-xs font-bold"
          >
            Participate with {formatCurrency(effectiveAmount)}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[#828D89]">
        <ShieldCheck className="w-4 h-4 text-[#B7E36A] shrink-0" />
        <span>Legal participatory rights recorded on Polygon blockchain ledger & European SPV deed.</span>
      </div>
    </div>
  );
};
