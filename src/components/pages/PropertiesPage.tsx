import React, { useState } from 'react';
import { Property } from '../../types/property';
import { PropertyCard } from '../properties/PropertyCard';
import { PropertyFilters } from '../properties/PropertyFilters';
import { ShieldCheck, Info } from 'lucide-react';

interface PropertiesPageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onInvestProperty: (property: Property) => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  onSelectProperty,
  onInvestProperty,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minInvestmentFilter, setMinInvestmentFilter] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('min_asc');

  // Strict Rule 1 & 8: Only display opportunities that meet the €1,000 minimum threshold
  const baseQualifiedProperties = properties.filter(
    (p) => (p.minimumInvestment || 0) >= 1000
  );

  // Multi-dimensional filtering
  const filtered = baseQualifiedProperties.filter((p) => {
    // 1. Location Filter
    if (selectedLocation !== 'all') {
      const matchLoc =
        p.country.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        p.city.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        p.location.toLowerCase().includes(selectedLocation.toLowerCase());
      if (!matchLoc) return false;
    }

    // 2. Type Filter
    if (selectedType !== 'all' && p.type !== selectedType) {
      return false;
    }

    // 3. Duration Filter
    if (selectedDuration !== 'all') {
      if (selectedDuration === '36' && p.durationMonths > 36) return false;
      if (selectedDuration === '48' && (p.durationMonths <= 36 || p.durationMonths > 48)) return false;
      if (selectedDuration === '60' && p.durationMonths <= 48) return false;
    }

    // 4. Status Filter
    if (selectedStatus !== 'all' && p.status !== selectedStatus) {
      return false;
    }

    // 5. Minimum Investment Filter (>= threshold)
    if (p.minimumInvestment < minInvestmentFilter) {
      return false;
    }

    return true;
  });

  // Sorting logic (Requirement 4: lowest minimum, highest minimum, newest listings)
  filtered.sort((a, b) => {
    if (sortBy === 'min_asc') {
      return a.minimumInvestment - b.minimumInvestment;
    }
    if (sortBy === 'min_desc') {
      return b.minimumInvestment - a.minimumInvestment;
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'yield_desc') {
      return b.estimatedAnnualYield - a.estimatedAnnualYield;
    }
    if (sortBy === 'progress_desc') {
      return (b.fundedAmount / b.targetAmount) - (a.fundedAmount / a.targetAmount);
    }
    return 0;
  });

  // Deduplicate by ID to guarantee unique React keys
  const uniqueFiltered = Array.from(new Map(filtered.map((p) => [p.id, p])).values());

  const handleResetFilters = () => {
    setSelectedLocation('all');
    setSelectedType('all');
    setSelectedDuration('all');
    setSelectedStatus('all');
    setMinInvestmentFilter(1000);
    setSortBy('min_asc');
  };

  return (
    <div className="bg-[#F6F7F4] min-h-screen py-10">
      <div className="container">
        {/* Marketplace Hero Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3E8E3] text-xs font-semibold text-[#182D2A] mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#27845D]" />
            <span>Institutional Real Estate Marketplace · Reental Reference Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#18211F] mb-3 tracking-tight">
            Property Investment Opportunities
          </h1>
          <p className="text-sm sm:text-base text-[#69736F] leading-relaxed">
            Curated tokenized residential, commercial, coliving, and holiday properties with a minimum investment 
            of €1,000 and above. Every offering features independent RICS appraisal, audited net pro-formas, 
            and automated monthly dividend distribution rights.
          </p>

          {/* Compliance Notice Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-white border border-[#E3E8E3] flex items-center gap-2.5 text-xs text-[#69736F] shadow-sm">
            <Info className="w-4 h-4 text-[#27845D] shrink-0" />
            <span>
              <strong>Investor Threshold Rule:</strong> Only certified opportunities with a minimum entry of €1,000+ are displayed. 
              Projected returns represent audited pro-forma estimates, not guaranteed yields.
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Filter Bar */}
        <PropertyFilters
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          selectedDuration={selectedDuration}
          onSelectDuration={setSelectedDuration}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          minInvestmentFilter={minInvestmentFilter}
          onSelectMinInvestment={setMinInvestmentFilter}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          totalCount={uniqueFiltered.length}
          onResetFilters={handleResetFilters}
        />

        {/* Property Grid */}
        {uniqueFiltered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E3E8E3] text-center shadow-sm max-w-xl mx-auto my-12">
            <h3 className="text-xl font-bold text-[#18211F] mb-2">No Properties Match Your Active Filters</h3>
            <p className="text-xs text-[#69736F] mb-6 leading-relaxed">
              No offerings currently match the chosen location, duration, type, or minimum investment parameters.
              Try widening your criteria or reset filters to view all €1,000+ opportunities.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn btn-primary btn-sm text-xs font-bold px-6"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="property-grid">
            {uniqueFiltered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                onInvest={onInvestProperty}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
