import { Property } from '../types/property';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-valencia-01',
    slug: 'valencia-ruzafa-smart-living',
    title: 'Valencia Ruzafa Smart Living',
    location: 'Calle Ruzafa 42, Valencia',
    city: 'Valencia',
    country: 'Spain',
    type: 'Residential',
    status: 'funding',
    images: [
      '/src/assets/images/prop_valencia_apt_1791998371242.jpg',
      '/src/assets/images/hero_real_estate_1791998371047.jpg'
    ],
    bannerImage: '/src/assets/images/prop_valencia_apt_1791998371242.jpg',
    targetAmount: 320000,
    fundedAmount: 284000,
    tokenPrice: 100,
    totalTokens: 3200,
    availableTokens: 360,
    estimatedAnnualYield: 11.4,
    capitalAppreciationYield: 4.2,
    totalEstimatedReturn: 15.6,
    durationMonths: 36,
    minimumInvestment: 1000, // Enforced minimum >= €1,000 (10 Tokens)
    distributionFrequency: 'Monthly',
    tokenTicker: 'RENT-VAL01',
    blockchainNetwork: 'Polygon POS',
    tokenContractAddress: '0x8fB4a84e318C4475475143a59d749E7804473Ce9',
    description: 'High-efficiency 6-unit residential asset in the high-demand Ruzafa district of Valencia. Completely renovated to energy-class A standards, optimized for long-term residential and young professional tenants. Located 5 minutes walking distance from Valencia Nord station and Central Park.',
    investmentStructure: 'Participatory Debt Security (Préstamo Participativo) issued by a dedicated Spanish Special Purpose Vehicle (Valencia Urban Asset SL), secured by first-rank legal title deed.',
    highlights: [
      'Prime location in Ruzafa, rated one of Spain’s top 3 rental appreciation zones',
      'Class A Energy efficiency rating with installed solar auxiliary heating',
      'Pre-leased 100% occupancy with institutional corporate covenants',
      'Conservative 70% LTV asset valuation supported by Savills Spain appraisal'
    ],
    risks: [
      'Vacancy risk between tenant turnover periods (mitigated by 3-month security deposits)',
      'Local residential rent indexing legislation adjustments',
      'Liquidity constraint if liquidated ahead of the 36-month maturity'
    ],
    exitStrategy: 'Block sale to European institutional residential fund at month 36, or refinancing and capital distribution upon majority token-holder vote.',
    feeStructure: {
      structuringFee: '3.5% (Included in total target capitalization; zero additional charges)',
      managementFee: '10.0% of gross monthly rental income (covers property maintenance and leasing)',
      withdrawalFee: '0% for SEPA transfers to investor bank account',
      exitFee: '0% upon terminal asset liquidation'
    },
    paymentSchedule: {
      distributionFrequency: 'Monthly',
      payoutDate: '1st business day of each calendar month directly to investor wallet',
      annualReconciliation: 'Annual audited financial report and tax statement issued every February',
      maturityTerms: '100% invested capital principal + proportional net capital appreciation paid at month 36'
    },
    financialBreakdown: {
      propertyPrice: 245000,
      refurbishmentBudget: 42000,
      legalAndClosingCosts: 18000,
      operatingReserve: 15000,
      totalProjectCost: 320000,
      projectedAnnualGrossRent: 43200,
      estimatedOperatingExpenses: 6720,
      projectedAnnualNetRent: 36480,
      estimatedNetYield: 11.4,
      estimatedCapitalGainYield: 4.2,
      totalEstimatedYield: 15.6
    },
    documents: [
      {
        id: 'doc-v1',
        name: 'Independent Appraisal Report (Savills 2026)',
        category: 'Valuation',
        size: '2.4 MB',
        url: '#',
        updatedAt: '2026-02-15'
      },
      {
        id: 'doc-v2',
        name: 'SPV Deed of Incorporation & Bylaws',
        category: 'Legal',
        size: '1.8 MB',
        url: '#',
        updatedAt: '2026-01-20'
      },
      {
        id: 'doc-v3',
        name: 'Technical Building Inspection & Energy Audit',
        category: 'Technical',
        size: '3.1 MB',
        url: '#',
        updatedAt: '2026-02-01'
      },
      {
        id: 'doc-v4',
        name: 'Financial Pro-Forma & Cash Flow Model',
        category: 'Financial',
        size: '1.2 MB',
        url: '#',
        updatedAt: '2026-02-18'
      }
    ],
    investorCount: 142,
    createdAt: '2026-02-10',
    isSampleRecord: true
  },
  {
    id: 'prop-madrid-02',
    slug: 'madrid-chamberi-coliving-hub',
    title: 'Madrid Chamberí Urban Coliving',
    location: 'Calle de Santa Engracia 78, Chamberí, Madrid',
    city: 'Madrid',
    country: 'Spain',
    type: 'Coliving',
    status: 'funded',
    images: [
      '/src/assets/images/prop_madrid_living_1791998371897.jpg',
      '/src/assets/images/hero_real_estate_1791998371047.jpg'
    ],
    bannerImage: '/src/assets/images/prop_madrid_living_1791998371897.jpg',
    targetAmount: 480000,
    fundedAmount: 480000,
    tokenPrice: 100,
    totalTokens: 4800,
    availableTokens: 0,
    estimatedAnnualYield: 12.8,
    capitalAppreciationYield: 4.7,
    totalEstimatedReturn: 17.5,
    durationMonths: 48,
    minimumInvestment: 1500, // Enforced minimum >= €1,000 (15 Tokens)
    distributionFrequency: 'Monthly',
    tokenTicker: 'RENT-MAD02',
    blockchainNetwork: 'Polygon POS',
    tokenContractAddress: '0x1C23D88371A40f6c2436d4A934571A1181283204',
    description: 'Boutique 10-bedroom high-yield coliving hub situated in the prestigious Chamberí district of Madrid. Master lease agreement signed with an established European coliving operator with guaranteed minimum baseline occupancy.',
    investmentStructure: 'Participatory Investment Agreement with Madrid Living Assets SL, featuring master-operator corporate guarantees and audited rent escrow accounts.',
    highlights: [
      'Master lease agreement with 5-year guaranteed rent indexation',
      'Historic prime central Madrid location with low city center vacancy (<2%)',
      'Turnkey property generating immediate monthly distributions from month 1',
      'Fully funded within 48 hours by 215 global retail and angel investors'
    ],
    risks: [
      'Counterparty operational performance risk of the master coliving tenant',
      'Municipal zoning changes for flexible medium-term accommodation',
      'Interest rate movements affecting terminal capitalization rates'
    ],
    exitStrategy: 'Sale to institutional coliving REIT or portfolio recapitalization at year 4.',
    feeStructure: {
      structuringFee: '4.0% (Included in total project funding amount)',
      managementFee: '8.5% of monthly collected operator revenue',
      withdrawalFee: '0% for SEPA transfers',
      exitFee: '0% upon scheduled portfolio sale'
    },
    paymentSchedule: {
      distributionFrequency: 'Monthly',
      payoutDate: '1st of each month directly credited to investor balance',
      annualReconciliation: 'Annual financial closing statement delivered in March',
      maturityTerms: 'Full return of principal + 4.7% estimated annualized capital appreciation upon sale'
    },
    financialBreakdown: {
      propertyPrice: 380000,
      refurbishmentBudget: 55000,
      legalAndClosingCosts: 25000,
      operatingReserve: 20000,
      totalProjectCost: 480000,
      projectedAnnualGrossRent: 71200,
      estimatedOperatingExpenses: 9760,
      projectedAnnualNetRent: 61440,
      estimatedNetYield: 12.8,
      estimatedCapitalGainYield: 4.7,
      totalEstimatedYield: 17.5
    },
    documents: [
      {
        id: 'doc-m1',
        name: 'Master Operator Lease Agreement (5-Yr)',
        category: 'Legal',
        size: '2.9 MB',
        url: '#',
        updatedAt: '2026-01-15'
      },
      {
        id: 'doc-m2',
        name: 'CBRE Official RICS Property Valuation',
        category: 'Valuation',
        size: '3.6 MB',
        url: '#',
        updatedAt: '2026-01-22'
      },
      {
        id: 'doc-m3',
        name: 'Audited Financial Rent Yield Statements',
        category: 'Financial',
        size: '1.5 MB',
        url: '#',
        updatedAt: '2026-02-05'
      }
    ],
    investorCount: 215,
    createdAt: '2026-01-10',
    isSampleRecord: true
  },
  {
    id: 'prop-malaga-03',
    slug: 'malaga-coastline-beachfront-residences',
    title: 'Malaga Coastline Beachfront Residences',
    location: 'Paseo Marítimo Pablo Ruiz Picasso, Malaga',
    city: 'Malaga',
    country: 'Spain',
    type: 'Vacation Rental',
    status: 'funding',
    images: [
      '/src/assets/images/prop_malaga_coastal_1791998372504.jpg',
      '/src/assets/images/hero_real_estate_1791998371047.jpg'
    ],
    bannerImage: '/src/assets/images/prop_malaga_coastal_1791998372504.jpg',
    targetAmount: 650000,
    fundedAmount: 422500,
    tokenPrice: 100,
    totalTokens: 6500,
    availableTokens: 2275,
    estimatedAnnualYield: 13.5,
    capitalAppreciationYield: 4.5,
    totalEstimatedReturn: 18.0,
    durationMonths: 36,
    minimumInvestment: 2500, // Enforced minimum >= €1,000 (25 Tokens)
    distributionFrequency: 'Monthly',
    tokenTicker: 'RENT-AGP03',
    blockchainNetwork: 'Polygon POS',
    tokenContractAddress: '0x9482AcfD5B5c70C53494f48A5424DEB31c4b2203',
    description: 'Premier beachfront holiday apartment complex in eastern Malaga. Capitalizing on Malaga’s booming tech hub influx and year-round Costa del Sol tourism with automated smart access and professional hospitality management.',
    investmentStructure: 'Participatory Debt Contract issued by Costa del Sol Hospitality SPV SL, with seasonal revenue smoothing reserves.',
    highlights: [
      'Direct seafront promenade frontage with unobstructed Mediterranean views',
      'Active tourist license in place with 5-year clean municipal compliance record',
      'Dynamic yield pricing algorithm achieving 82% average annual occupancy',
      'High seasonal dividend peaks with monthly smoothing reserve balance'
    ],
    risks: [
      'Seasonal occupancy variance between high and low seasons',
      'Tourist tax adjustments and coastal management regulation updates',
      'Property maintenance from marine environment exposure'
    ],
    exitStrategy: 'Individual unit sales to private second-home buyers at the end of the 36-month investment cycle.',
    feeStructure: {
      structuringFee: '3.8% (Factored into initial offering capitalization)',
      managementFee: '12.0% of net hospitality revenue (covers 24/7 guest support and turnover)',
      withdrawalFee: '0% for SEPA transfers',
      exitFee: '0% upon property sale'
    },
    paymentSchedule: {
      distributionFrequency: 'Monthly',
      payoutDate: '1st of every month with smoothed seasonal reserves',
      annualReconciliation: 'Annual hospitality RevPAR statement published in January',
      maturityTerms: 'Full capital distribution + terminal unit sale appreciation at month 36'
    },
    financialBreakdown: {
      propertyPrice: 510000,
      refurbishmentBudget: 72000,
      legalAndClosingCosts: 38000,
      operatingReserve: 30000,
      totalProjectCost: 650000,
      projectedAnnualGrossRent: 108000,
      estimatedOperatingExpenses: 20250,
      projectedAnnualNetRent: 87750,
      estimatedNetYield: 13.5,
      estimatedCapitalGainYield: 4.5,
      totalEstimatedYield: 18.0
    },
    documents: [
      {
        id: 'doc-agp1',
        name: 'Tourist Operating License VFT/MA/2026',
        category: 'Legal',
        size: '1.1 MB',
        url: '#',
        updatedAt: '2026-02-10'
      },
      {
        id: 'doc-agp2',
        name: 'Historical RevPAR & Hospitality Audit',
        category: 'Financial',
        size: '2.1 MB',
        url: '#',
        updatedAt: '2026-02-14'
      },
      {
        id: 'doc-agp3',
        name: 'JLL Coastal Residential Asset Appraisal',
        category: 'Valuation',
        size: '4.2 MB',
        url: '#',
        updatedAt: '2026-02-20'
      }
    ],
    investorCount: 188,
    createdAt: '2026-02-01',
    isSampleRecord: true
  },
  {
    id: 'prop-miami-04',
    slug: 'brickell-miami-bay-skyline-suites',
    title: 'Brickell Miami Bay Skyline Suites',
    location: '1100 Brickell Bay Dr, Miami, FL 33131',
    city: 'Miami',
    country: 'United States',
    type: 'Residential',
    status: 'upcoming',
    images: [
      '/src/assets/images/prop_miami_luxury_1791998372925.jpg',
      '/src/assets/images/hero_real_estate_1791998371047.jpg'
    ],
    bannerImage: '/src/assets/images/prop_miami_luxury_1791998372925.jpg',
    targetAmount: 850000,
    fundedAmount: 0,
    tokenPrice: 100,
    totalTokens: 8500,
    availableTokens: 8500,
    estimatedAnnualYield: 10.2,
    capitalAppreciationYield: 5.1,
    totalEstimatedReturn: 15.3,
    durationMonths: 60,
    minimumInvestment: 5000, // Enforced minimum >= €1,000 (50 Tokens)
    distributionFrequency: 'Monthly',
    tokenTicker: 'RENT-MIA04',
    blockchainNetwork: 'Polygon POS',
    tokenContractAddress: '0x321f478E07b8196c827011dEa5F24c29780fA723',
    description: 'Luxury condominium apartment inside the prestigious Ascent Brickell waterfront tower. Benefits from zero Florida state income tax, intense tech and financial sector migration into Miami financial district, and strong dollar-denominated rental yields.',
    investmentStructure: 'Delaware LLC SPV debt note with full cross-border tax treaty shielding (W-8BEN compliant).',
    highlights: [
      'Prime Brickell Financial District location with bayfront views',
      'USD revenue hedging for international European investors',
      'Managed by top-rated Miami luxury property management group',
      'Exclusive pre-launch allocation with early-investor 1% fee discount'
    ],
    risks: [
      'Currency fluctuation (EUR/USD foreign exchange rate risk)',
      'US property tax and condominium HOA assessment increases',
      'Higher hurricane insurance premiums'
    ],
    exitStrategy: 'Refinancing or open-market MLS residential sale at year 5.',
    feeStructure: {
      structuringFee: '4.5% (Includes US legal incorporation and Delaware franchise fees)',
      managementFee: '10.0% of monthly collected rent',
      withdrawalFee: '0% for SEPA transfers (USD conversion at mid-market spot rate)',
      exitFee: '0% upon scheduled sale'
    },
    paymentSchedule: {
      distributionFrequency: 'Monthly',
      payoutDate: '1st business day of each month',
      annualReconciliation: 'US Schedule K-1 / European dividend summary delivered in February',
      maturityTerms: '100% Principal + cumulative Florida capital appreciation paid at month 60'
    },
    financialBreakdown: {
      propertyPrice: 710000,
      refurbishmentBudget: 45000,
      legalAndClosingCosts: 55000,
      operatingReserve: 40000,
      totalProjectCost: 850000,
      projectedAnnualGrossRent: 112000,
      estimatedOperatingExpenses: 25300,
      projectedAnnualNetRent: 86700,
      estimatedNetYield: 10.2,
      estimatedCapitalGainYield: 5.1,
      totalEstimatedYield: 15.3
    },
    documents: [
      {
        id: 'doc-mia1',
        name: 'Delaware SPV Offering Memorandum',
        category: 'Legal',
        size: '4.8 MB',
        url: '#',
        updatedAt: '2026-02-28'
      },
      {
        id: 'doc-mia2',
        name: 'Appraisal Report (Cushman & Wakefield Miami)',
        category: 'Valuation',
        size: '3.9 MB',
        url: '#',
        updatedAt: '2026-03-01'
      }
    ],
    investorCount: 0,
    createdAt: '2026-03-01',
    isSampleRecord: true
  },
  {
    id: 'prop-bcn-05',
    slug: 'barcelona-diagonal-business-hub',
    title: 'Barcelona Diagonal Commercial Hub',
    location: 'Avinguda Diagonal 405, Eixample, Barcelona',
    city: 'Barcelona',
    country: 'Spain',
    type: 'Commercial',
    status: 'funding',
    images: [
      '/src/assets/images/prop_madrid_living_1791998371897.jpg',
      '/src/assets/images/hero_real_estate_1791998371047.jpg'
    ],
    bannerImage: '/src/assets/images/prop_madrid_living_1791998371897.jpg',
    targetAmount: 520000,
    fundedAmount: 312000,
    tokenPrice: 100,
    totalTokens: 5200,
    availableTokens: 2080,
    estimatedAnnualYield: 10.8,
    capitalAppreciationYield: 4.0,
    totalEstimatedReturn: 14.8,
    durationMonths: 48,
    minimumInvestment: 1000, // Enforced minimum >= €1,000 (10 Tokens)
    distributionFrequency: 'Monthly',
    tokenTicker: 'RENT-BCN05',
    blockchainNetwork: 'Polygon POS',
    tokenContractAddress: '0x539a12Bc90141e9742a0b41198651810473Fe912',
    description: 'High-visibility ground-floor commercial premises on Barcelona’s bustling Avinguda Diagonal corridor. Leased under a triple-net (NNN) contract to an established international healthcare diagnostics clinic.',
    investmentStructure: 'Fixed Participatory Note issued by Diagonal Real Estate Ventures SL, backed by long-term commercial lease covenant.',
    highlights: [
      'Prime commercial location on Avinguda Diagonal with high foot traffic',
      '10-year triple-net (NNN) lease with CPI inflation indexation',
      'Tenant pays all property taxes, insurance, and routine maintenance',
      'Independent CBRE commercial valuation with 6.2% capitalization rate'
    ],
    risks: [
      'Single tenant commercial lease concentration risk',
      'Macroeconomic retail/commercial yield shifts',
      'Refinancing liquidity at 48-month investment horizon'
    ],
    exitStrategy: 'Commercial asset sale to private family office or European open-ended real estate fund at year 4.',
    feeStructure: {
      structuringFee: '3.5% (Pre-funded in capital budget)',
      managementFee: '7.5% of monthly lease income',
      withdrawalFee: '0% for SEPA transfers',
      exitFee: '0% upon asset sale'
    },
    paymentSchedule: {
      distributionFrequency: 'Monthly',
      payoutDate: '1st of each month directly to investor wallet',
      annualReconciliation: 'Annual commercial lease report issued in February',
      maturityTerms: '100% Principal + capital appreciation from indexed commercial valuation at month 48'
    },
    financialBreakdown: {
      propertyPrice: 420000,
      refurbishmentBudget: 35000,
      legalAndClosingCosts: 40000,
      operatingReserve: 25000,
      totalProjectCost: 520000,
      projectedAnnualGrossRent: 61000,
      estimatedOperatingExpenses: 4840,
      projectedAnnualNetRent: 56160,
      estimatedNetYield: 10.8,
      estimatedCapitalGainYield: 4.0,
      totalEstimatedYield: 14.8
    },
    documents: [
      {
        id: 'doc-bcn1',
        name: 'Triple-Net Commercial Lease Agreement (10-Yr)',
        category: 'Legal',
        size: '3.4 MB',
        url: '#',
        updatedAt: '2026-02-18'
      },
      {
        id: 'doc-bcn2',
        name: 'CBRE Commercial Real Estate Valuation',
        category: 'Valuation',
        size: '4.1 MB',
        url: '#',
        updatedAt: '2026-02-22'
      }
    ],
    investorCount: 96,
    createdAt: '2026-02-15',
    isSampleRecord: true
  },
  {
    id: 'prop-sev-06',
    slug: 'seville-santa-cruz-historic-living',
    title: 'Seville Santa Cruz Historic Living',
    location: 'Plaza de Doña Elvira 8, Santa Cruz, Seville',
    city: 'Seville',
    country: 'Spain',
    type: 'Residential',
    status: 'funding',
    images: [
      '/src/assets/images/prop_valencia_apt_1791998371242.jpg',
      '/src/assets/images/hero_real_estate_1791998371047.jpg'
    ],
    bannerImage: '/src/assets/images/prop_valencia_apt_1791998371242.jpg',
    targetAmount: 390000,
    fundedAmount: 195000,
    tokenPrice: 100,
    totalTokens: 3900,
    availableTokens: 1950,
    estimatedAnnualYield: 11.9,
    capitalAppreciationYield: 4.4,
    totalEstimatedReturn: 16.3,
    durationMonths: 36,
    minimumInvestment: 2000, // Enforced minimum >= €1,000 (20 Tokens)
    distributionFrequency: 'Monthly',
    tokenTicker: 'RENT-SEV06',
    blockchainNetwork: 'Polygon POS',
    tokenContractAddress: '0x7129A83c5D1b901235123991048bCe94719023ab',
    description: 'Charming 4-apartment historic townhouse in the heart of Seville’s Santa Cruz district. Restored with traditional Andalusian architecture, modern interior finishes, and private courtyard patios.',
    investmentStructure: 'Participatory SPV Note with Seville Heritage Assets SL, protected by registered first mortgage deed.',
    highlights: [
      'Iconic historic location in Seville’s most photographed quarter',
      'Dual medium-term residential and seasonal high-yield flexibility',
      'Energy efficiency restoration with solar thermal water heating',
      'High historical capital appreciation in prime Seville center'
    ],
    risks: [
      'Historic district building maintenance requirements',
      'Seasonal occupancy variance in peak summer months',
      'Local municipal residential regulation updates'
    ],
    exitStrategy: 'Individual unit sales to private second-home buyers at the end of the 36-month investment cycle.',
    feeStructure: {
      structuringFee: '3.6% (Included in offering capitalization)',
      managementFee: '10.0% of collected rent',
      withdrawalFee: '0% for SEPA transfers',
      exitFee: '0% upon liquidation'
    },
    paymentSchedule: {
      distributionFrequency: 'Monthly',
      payoutDate: '1st of every month directly to investor wallet',
      annualReconciliation: 'Annual audited financial report issued in February',
      maturityTerms: '100% principal return + capital appreciation distributed at month 36'
    },
    financialBreakdown: {
      propertyPrice: 295000,
      refurbishmentBudget: 48000,
      legalAndClosingCosts: 27000,
      operatingReserve: 20000,
      totalProjectCost: 390000,
      projectedAnnualGrossRent: 54600,
      estimatedOperatingExpenses: 8190,
      projectedAnnualNetRent: 46410,
      estimatedNetYield: 11.9,
      estimatedCapitalGainYield: 4.4,
      totalEstimatedYield: 16.3
    },
    documents: [
      {
        id: 'doc-sev1',
        name: 'Heritage Architecture & Technical Renovation Plan',
        category: 'Technical',
        size: '3.8 MB',
        url: '#',
        updatedAt: '2026-02-12'
      },
      {
        id: 'doc-sev2',
        name: 'Independent Appraisal (Savills Spain)',
        category: 'Valuation',
        size: '2.7 MB',
        url: '#',
        updatedAt: '2026-02-14'
      }
    ],
    investorCount: 78,
    createdAt: '2026-02-10',
    isSampleRecord: true
  }
];
