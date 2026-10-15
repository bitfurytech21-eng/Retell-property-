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
  const [minInvestmentFilter, setMinInvestmentFilter] = useState<number>(750);
  const [sortBy, setSortBy] = useState<string>('min_asc');

  // Display opportunities that meet the €750 minimum threshold and are approved
  const baseQualifiedProperties = properties.filter(
    (p) => (p.minimumInvestment || 0) >= 750 && p.status !== 'hidden' && p.status !== 'pending_approval'
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

    // 3. Duration Filter (supports short term from 3 months)
    if (selectedDuration !== 'all') {
      if (selectedDuration === '12' && p.durationMonths > 12) return false;
      if (selectedDuration === '24' && (p.durationMonths <= 12 || p.durationMonths > 24)) return false;
      if (selectedDuration === '36' && (p.durationMonths <= 24 || p.durationMonths > 36)) return false;
      if (selectedDuration === '48' && p.durationMonths <= 36) return false;
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

  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Reset pagination when filters change
  const handleFilterChange = (setter: any, val: any) => {
    setter(val);
    setVisibleCount(24);
  };

  // Deduplicate by ID to guarantee unique React keys
  const uniqueFiltered = Array.from(new Map(filtered.map((p) => [p.id, p])).values());
  const displayedProperties = uniqueFiltered.slice(0, visibleCount);

  const handleResetFilters = () => {
    setSelectedLocation('all');
    setSelectedType('all');
    setSelectedDuration('all');
    setSelectedStatus('all');
    setMinInvestmentFilter(750);
    setSortBy('min_asc');
    setVisibleCount(24);
  };

  return (
    <div className="bg-[#F6F7F4] min-h-screen py-10">
      <div className="container">
        {/* Marketplace Hero Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E3E8E3] text-xs font-semibold text-[#182D2A] mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#27845D]" />
            <span>Kretz Real Estate France · Prestige Luxury Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#18211F] mb-3 tracking-tight">
            Prestigious French Real Estate Opportunities
          </h1>
          <p className="text-sm sm:text-base text-[#69736F] leading-relaxed">
            Curated selection of world-class private mansions in Paris, French Riviera waterfront villas, 
            Alpine chalets, and historic châteaux. Every offering includes authentic photography, certified appraisals, 
            and automated monthly rental yields.
          </p>

          {/* Compliance Notice Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-white border border-[#E3E8E3] flex items-center gap-2.5 text-xs text-[#69736F] shadow-sm">
            <Info className="w-4 h-4 text-[#27845D] shrink-0" />
            <span>
              <strong>Investor Threshold Rule:</strong> Minimum investment from €750 up to €10,000 with flexible terms from 3 to 48 months. All properties verified through Kretz Exclusive Mandates.
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Filter Bar */}
        <PropertyFilters
          selectedLocation={selectedLocation}
          onSelectLocation={(loc) => handleFilterChange(setSelectedLocation, loc)}
          selectedType={selectedType}
          onSelectType={(t) => handleFilterChange(setSelectedType, t)}
          selectedDuration={selectedDuration}
          onSelectDuration={(d) => handleFilterChange(setSelectedDuration, d)}
          selectedStatus={selectedStatus}
          onSelectStatus={(s) => handleFilterChange(setSelectedStatus, s)}
          minInvestmentFilter={minInvestmentFilter}
          onSelectMinInvestment={(m) => handleFilterChange(setMinInvestmentFilter, m)}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          totalCount={uniqueFiltered.length}
          onResetFilters={handleResetFilters}
        />

        {/* Property Count Bar */}
        <div className="flex items-center justify-between text-xs text-[#69736F] font-semibold mb-4 px-1">
          <span>
            Showing <strong className="text-[#18211F]">{displayedProperties.length}</strong> of{' '}
            <strong className="text-[#18211F]">{uniqueFiltered.length}</strong> available properties
          </span>
          {uniqueFiltered.length > displayedProperties.length && (
            <span className="text-[#27845D]">
              + {uniqueFiltered.length - displayedProperties.length} more available
            </span>
          )}
        </div>

        {/* Property Grid */}
        {uniqueFiltered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E3E8E3] text-center shadow-sm max-w-xl mx-auto my-12">
            <h3 className="text-xl font-bold text-[#18211F] mb-2">No Properties Match Your Active Filters</h3>
            <p className="text-xs text-[#69736F] mb-6 leading-relaxed">
              No offerings currently match the chosen region, duration, or property category.
              Try widening your criteria or reset filters to view all prestigious opportunities.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn btn-primary btn-sm text-xs font-bold px-6 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="property-grid">
              {displayedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                  onInvest={onInvestProperty}
                />
              ))}
            </div>

            {/* Load More Button */}
            {uniqueFiltered.length > displayedProperties.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-8 py-3.5 rounded-2xl bg-white border border-[#E3E8E3] text-[#18211F] hover:bg-[#EEF1EC] hover:border-[#182D2A] text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Load More Properties ({uniqueFiltered.length - displayedProperties.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
