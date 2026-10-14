import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { ledger } from './lib/ledger';
import { Property } from './types/property';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Home Components
import { Hero } from './components/home/Hero';
import { PlatformStats } from './components/home/PlatformStats';
import { HowItWorks } from './components/home/HowItWorks';
import { Benefits } from './components/home/Benefits';
import { FAQSection } from './components/home/FAQSection';
import { FinalCTA } from './components/home/FinalCTA';
import { PropertyCard } from './components/properties/PropertyCard';

// Dedicated Pages
import { PropertiesPage } from './components/pages/PropertiesPage';
import { PropertyDetailView } from './components/properties/PropertyDetailView';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { TokenPage } from './components/pages/TokenPage';
import { FAQPage } from './components/pages/FAQPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { TeamPage } from './components/pages/TeamPage';
import { WealthPage } from './components/pages/WealthPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AuthPages } from './components/pages/AuthPages';
import { DashboardPage } from './components/pages/DashboardPage';
import { PortfolioOverview } from './components/dashboard/PortfolioOverview';
import { TransactionTable } from './components/dashboard/TransactionTable';
import { AdminPanel } from './components/admin/AdminPanel';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { ArrowRight, ShieldCheck, UserCheck, Plus, Sparkles } from 'lucide-react';

function MainApp() {
  const { user, isConfigured, quickDemoSession } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [pendingInvestmentProperty, setPendingInvestmentProperty] = useState<Property | null>(null);
  const [returnDestination, setReturnDestination] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>(ledger.getProperties());

  // Listen to popstate and initial hash navigation (handles Supabase recovery redirects)
  useEffect(() => {
    const handlePopState = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      const hash = !rawHash || rawHash === '/' ? '/' : (rawHash.startsWith('/') ? rawHash : `/${rawHash}`);
      if (hash.includes('type=recovery') || hash.startsWith('reset-password') || hash.startsWith('/reset-password')) {
        setCurrentPath('/reset-password');
        return;
      }
      if (hash.startsWith('/property/')) {
        const slug = hash.replace('/property/', '');
        const currentList = ledger.getProperties();
        const found = currentList.find(p => p.slug === slug || p.id === slug);
        if (found) setSelectedProperty(found);
      }
      setCurrentPath(hash);
    };

    window.addEventListener('popstate', handlePopState);
    if (window.location.hash) {
      handlePopState();
    } else {
      setCurrentPath('/');
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    const cleanPath = !path || path === '/' ? '/' : (path.startsWith('/') ? path : `/${path}`);
    setCurrentPath(cleanPath);
    window.location.hash = cleanPath;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    navigateTo(`/property/${property.slug}`);
  };

  // Requirement 10: Preserve selected property when visitor signs in before continuing an investment
  const handleInvestProperty = (property: Property) => {
    if (!user) {
      setPendingInvestmentProperty(property);
      setSelectedProperty(property);
      setReturnDestination(`/property/${property.slug}`);
      navigateTo('/login');
    } else {
      setSelectedProperty(property);
      navigateTo(`/property/${property.slug}`);
    }
  };

  const handleAuthSuccess = () => {
    if (pendingInvestmentProperty) {
      const target = pendingInvestmentProperty;
      setPendingInvestmentProperty(null);
      setSelectedProperty(target);
      navigateTo(`/property/${target.slug}`);
    } else if (returnDestination) {
      const dest = returnDestination;
      setReturnDestination(null);
      navigateTo(dest);
    } else {
      navigateTo('/dashboard');
    }
  };

  const handleQuickRoleSwitch = async (role: 'investor' | 'admin') => {
    try {
      await quickDemoSession(role);
    } catch (e) {
      console.error(e);
    }
  };

  // Synchronize properties state whenever an investment occurs
  const handleInvestmentSuccess = () => {
    setProperties(ledger.getProperties());
  };

  // Render appropriate view based on currentPath
  const renderContent = () => {
    const basePath = currentPath.split('#')[0] || '/';

    // Property detail view
    if (basePath.startsWith('/property/')) {
      const slug = basePath.replace('/property/', '');
      const currentList = properties;
      const found = (selectedProperty && (selectedProperty.slug === slug || selectedProperty.id === slug))
        ? selectedProperty
        : currentList.find(p => p.slug === slug || p.id === slug) || currentList[0];

      if (found) {
        return (
          <PropertyDetailView
            property={found}
            onBack={() => navigateTo('/properties')}
            onNavigateDeposit={() => navigateTo('/dashboard')}
            onNavigateAuthForInvestment={(prop) => {
              setPendingInvestmentProperty(prop);
              setReturnDestination(`/property/${prop.slug}`);
              navigateTo('/login');
            }}
            onInvestmentSuccess={handleInvestmentSuccess}
          />
        );
      }
    }

    switch (basePath) {
      case '/properties':
        return (
          <PropertiesPage
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onInvestProperty={handleInvestProperty}
          />
        );

      case '/team':
        return (
          <TeamPage
            onExplore={() => navigateTo('/properties')}
            onContact={() => navigateTo('/contact')}
          />
        );

      case '/wealth':
        return (
          <WealthPage
            onExplore={() => navigateTo('/properties')}
            onContact={() => navigateTo('/contact')}
          />
        );

      case '/investing':
        return (
          <HowItWorksPage
            onExplore={() => navigateTo('/properties')}
            onRegister={() => navigateTo('/register')}
          />
        );

      case '/token':
        return (
          <TokenPage
            onExplore={() => navigateTo('/properties')}
          />
        );

      case '/faq':
        return (
          <FAQPage
            onContact={() => navigateTo('/contact')}
          />
        );

      case '/contact':
        return <ContactPage />;

      case '/terms':
        return <LegalPage mode="terms" />;

      case '/privacy':
        return <LegalPage mode="privacy" />;

      case '/login':
        return (
          <AuthPages
            initialMode="login"
            preservedProperty={pendingInvestmentProperty}
            onSuccess={handleAuthSuccess}
            onNavigateMode={(m) => navigateTo(`/${m}`)}
          />
        );

      case '/register':
        return (
          <AuthPages
            initialMode="register"
            preservedProperty={pendingInvestmentProperty}
            onSuccess={handleAuthSuccess}
            onNavigateMode={(m) => navigateTo(`/${m}`)}
          />
        );

      case '/forgot-password':
        return (
          <AuthPages
            initialMode="forgot-password"
            onSuccess={() => navigateTo('/login')}
            onNavigateMode={(m) => navigateTo(`/${m}`)}
          />
        );

      case '/reset-password':
        return (
          <AuthPages
            initialMode="reset-password"
            onSuccess={() => navigateTo('/login')}
            onNavigateMode={(m) => navigateTo(`/${m}`)}
          />
        );

      case '/dashboard':
      case '/portfolio':
      case '/transactions':
      case '/distributions':
      case '/wallet':
      case '/deposit':
      case '/documents':
      case '/referrals':
      case '/notifications':
      case '/profile':
      case '/support': {
        const tabMap: Record<string, string> = {
          '/dashboard': 'overview',
          '/portfolio': 'portfolio',
          '/transactions': 'transactions',
          '/distributions': 'distributions',
          '/wallet': 'wallet',
          '/deposit': 'deposit',
          '/documents': 'documents',
          '/referrals': 'referrals',
          '/notifications': 'notifications',
          '/profile': 'profile',
          '/support': 'support',
        };
        const tab = tabMap[basePath] || 'overview';
        return (
          <ProtectedRoute
            onNavigateLogin={() => {
              setReturnDestination(basePath);
              navigateTo('/login');
            }}
          >
            <DashboardPage
              defaultTab={tab}
              onSelectProperty={(id) => {
                const p = properties.find(prop => prop.id === id);
                if (p) handleSelectProperty(p);
              }}
              onExploreProperties={() => navigateTo('/properties')}
              onNavigateProfile={() => navigateTo('/profile')}
              onNavigateTransactions={() => navigateTo('/transactions')}
              onNavigatePortfolio={() => navigateTo('/portfolio')}
              onNavigateHome={() => navigateTo('/')}
            />
          </ProtectedRoute>
        );
      }

      case '/admin':
        return (
          <ProtectedRoute
            requireAdmin={true}
            onNavigateLogin={() => {
              setReturnDestination('/admin');
              navigateTo('/login');
            }}
          >
            <AdminPanel />
          </ProtectedRoute>
        );

      // Default: Homepage
      case '/':
      default:
        return (
          <main>
            <Hero
              onExplore={() => navigateTo('/properties')}
              onHowItWorks={() => navigateTo('/investing')}
            />

            <PlatformStats />

            {/* Featured Properties Marketplace Section */}
            <section className="section bg-white" id="properties">
              <div className="container">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F7F4] border border-[#E3E8E3] text-xs font-semibold text-[#182D2A] mb-3">
                      <span>Curated Institutional Assets</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18211F]">
                      Featured Investment Opportunities
                    </h2>
                    <p className="text-sm text-[#69736F] max-w-xl">
                      Each asset is structured via an independent SPV with certified RICS appraisals, 
                      institutional underwriting, and verified monthly distributions.
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo('/properties')}
                    className="btn btn-secondary text-xs font-bold self-start sm:self-auto"
                  >
                    View All Opportunities ({properties.filter(p => p.minimumInvestment >= 1000).length})
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>

                <div className="property-grid">
                  {Array.from(
                    new Map(
                      properties
                        .filter((p) => (p.minimumInvestment || 0) >= 1000)
                        .map((p) => [p.id, p])
                    ).values()
                  )
                    .slice(0, 3)
                    .map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onSelect={handleSelectProperty}
                        onInvest={handleInvestProperty}
                      />
                    ))}
                </div>
              </div>
            </section>

            <HowItWorks />

            <Benefits />

            <FAQSection
              onNavigateFAQ={() => navigateTo('/faq')}
              onNavigateContact={() => navigateTo('/contact')}
            />

            <FinalCTA
              onRegister={() => navigateTo('/register')}
              onExplore={() => navigateTo('/properties')}
            />
          </main>
        );
    }
  };

  const currentBasePath = currentPath.split('#')[0] || '/';
  const isDashboardView = [
    '/dashboard', '/portfolio', '/transactions', '/distributions', 
    '/wallet', '/deposit', '/documents', '/referrals', '/notifications', 
    '/profile', '/support'
  ].includes(currentBasePath) || currentBasePath.startsWith('/dashboard');

  return (
    <div className={`flex flex-col bg-white ${isDashboardView ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Supabase & Active Session Banner (Hidden on dashboard views) */}
      {!isDashboardView && (
        <div className="bg-[#182D2A] text-white py-1.5 px-4 text-xs font-medium border-b border-[#24423C]">
          <div className="container flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConfigured ? 'bg-[#B7E36A] animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-[11px] font-semibold text-[#EEF1EC]">
                  {isConfigured ? 'Supabase Auth: Active' : 'Supabase Auth: Awaiting Keys'}
                </span>
              </div>

              <span className="text-white/30 hidden sm:inline">|</span>

              <span>
                Session: <strong>{user ? `${user.fullName} (${user.role})` : 'Guest (Signed Out)'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              {!isConfigured && (
                <span className="text-amber-200/80 text-[10px] hidden md:inline">
                  (Preview Switcher Active)
                </span>
              )}
              <button
                onClick={() => handleQuickRoleSwitch('investor')}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  user?.role === 'investor' ? 'bg-[#B7E36A] text-[#18211F]' : 'bg-[#24423C] text-white hover:bg-[#2e544c]'
                }`}
                title="Switch session persona for interface testing"
              >
                Investor Mode
              </button>
              <button
                onClick={() => {
                  handleQuickRoleSwitch('admin');
                  navigateTo('/admin');
                }}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  user?.role === 'admin' ? 'bg-[#B7E36A] text-[#18211F]' : 'bg-[#24423C] text-white hover:bg-[#2e544c]'
                }`}
                title="Switch to administrator role for access review"
              >
                Admin Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {!isDashboardView && <Header currentPath={currentPath} onNavigate={navigateTo} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>

      {!isDashboardView && <Footer onNavigate={navigateTo} />}
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F6F7F4]">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E3E8E3] shadow-lg text-center space-y-4">
            <h2 className="text-xl font-bold text-[#18211F]">Application Error</h2>
            <p className="text-xs text-[#69736F]">{this.state.error?.message || 'An unexpected error occurred while rendering the interface.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary w-full py-3 text-xs font-bold"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}
