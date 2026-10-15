import React from 'react';
import { Property } from '../../types/property';
import { formatCurrency, formatPercent } from '../../lib/utils';
import { MapPin, Calendar, Users, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onInvest?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, onInvest }) => {
  const fundingPercent = Math.min(100, Math.round((property.fundedAmount / property.targetAmount) * 100));

  const getStatusBadge = () => {
    switch (property.status) {
      case 'funding':
        return <span className="status-badge funding font-semibold">● Funding Active</span>;
      case 'funded':
        return <span className="status-badge funded font-semibold">✓ 100% Funded</span>;
      case 'upcoming':
        return <span className="status-badge upcoming font-semibold">⏳ Launching Soon</span>;
      default:
        return <span className="status-badge">{property.status}</span>;
    }
  };

  return (
    <div className="property-card flex flex-col group border border-[#E3E8E3] rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Property Image & Status Badges */}
      <div className="property-image relative aspect-[4/3] overflow-hidden bg-[#EEF1EC]">
        <img
          src={property.images[0] || property.bannerImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Floating status tag */}
        <div className="absolute top-3 left-3 z-10">
          {getStatusBadge()}
        </div>

        {/* Type and Sample Indicator */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {property.images && property.images.length > 1 && (
            <span className="bg-black/65 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>📷</span>
              <span>{property.images.length} Photos</span>
            </span>
          )}
          <span className="bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {property.type}
          </span>
        </div>

        {/* Bottom image overlay with country & city */}
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/40 flex items-center justify-between text-xs font-semibold text-[#18211F]">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#27845D] shrink-0" />
            <span className="truncate">{property.city}, {property.country}</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-[#69736F] bg-[#EEF1EC] px-2 py-0.5 rounded-md">
            {property.tokenTicker}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="property-content flex flex-col flex-1 p-5 sm:p-6">
        <div className="text-xs text-[#69736F] mb-1 truncate">
          {property.location}
        </div>

        <h3 className="text-lg font-bold text-[#18211F] mb-1 leading-snug line-clamp-1 group-hover:text-[#27845D] transition-colors">
          {property.title}
        </h3>

        {/* Architectural Specs Summary */}
        {(property.surfaceAreaM2 || property.bedrooms || property.energyRating) && (
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#69736F] mb-3">
            {property.surfaceAreaM2 && (
              <span className="font-semibold text-[#18211F]">{property.surfaceAreaM2} m²</span>
            )}
            {property.bedrooms && (
              <>
                <span>•</span>
                <span>{property.bedrooms} Beds</span>
              </>
            )}
            {property.energyRating && (
              <>
                <span>•</span>
                <span className="bg-emerald-50 text-[#27845D] px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                  {property.energyRating}
                </span>
              </>
            )}
          </div>
        )}

        {/* Funding Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-[#18211F]">
              {formatCurrency(property.fundedAmount)} <span className="text-[#69736F] font-normal">funded</span>
            </span>
            <span className="font-bold text-[#182D2A]">{fundingPercent}%</span>
          </div>
          <div className="progress-track bg-[#E3E8E3] h-2 rounded-full overflow-hidden">
            <div
              className="progress-fill bg-[#182D2A] h-full rounded-full transition-all duration-500"
              style={{ width: `${fundingPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#69736F] mt-1.5">
            <span>Target: {formatCurrency(property.targetAmount)}</span>
            <span>{property.availableTokens} tokens left</span>
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="property-metrics py-3.5 border-y border-[#E3E8E3] grid grid-cols-2 gap-3 mb-4 bg-[#F6F7F4]/50 rounded-2xl p-3">
          <div>
            <span className="metric-label text-[11px] text-[#69736F] flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 text-[#27845D]" />
              Projected Net Yield*
            </span>
            <span className="metric-value text-base font-extrabold text-[#27845D] block">
              {formatPercent(property.estimatedAnnualYield)}
            </span>
            <span className="text-[10px] text-[#69736F] block mt-0.5">
              +{formatPercent(property.capitalAppreciationYield)} cap. gain
            </span>
          </div>

          <div>
            <span className="metric-label text-[11px] text-[#69736F] flex items-center gap-1 font-medium">
              <Users className="w-3 h-3 text-[#182D2A]" />
              Min. Investment
            </span>
            <span className="metric-value text-base font-black text-[#18211F] block">
              {formatCurrency(property.minimumInvestment)}
            </span>
            <span className="text-[10px] text-[#27845D] font-semibold block mt-0.5">
              €1,000+ Tier
            </span>
          </div>

          <div>
            <span className="metric-label text-[11px] text-[#69736F] flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-[#69736F]" />
              Duration
            </span>
            <span className="text-xs font-bold text-[#18211F] block">
              {property.durationMonths} Months
            </span>
          </div>

          <div>
            <span className="metric-label text-[11px] text-[#69736F] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3 text-[#27845D]" />
              Total 3-Yr Return*
            </span>
            <span className="text-xs font-bold text-[#18211F] block">
              {formatPercent(property.totalEstimatedReturn)}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-[#828D89] italic mb-4 leading-tight">
          *Returns verified via independent Savills/CBRE valuation and pro-forma models. Estimates, not guarantees.
        </p>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onSelect(property)}
            className="btn btn-secondary btn-sm w-full font-semibold text-xs border-[#E3E8E3] hover:border-[#182D2A] text-[#18211F]"
          >
            See Details
          </button>
          {onInvest && (
            <button
              onClick={() => onInvest(property)}
              className="btn btn-primary btn-sm w-full font-bold text-xs bg-[#182D2A] text-white hover:bg-[#24423C]"
            >
              Invest Now
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
