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

            {/* Dedicated Marketplace Gateway Section */}
            <section className="py-14 sm:py-20 bg-[#F6F7F4] border-b border-[#E3E8E3]">
              <div className="container">
                <div className="bg-white rounded-2xl border border-[#E3E8E3] p-8 sm:p-12 shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        <span>Kretz Asset Marketplace</span>
                        <span>·</span>
                        <span className="text-[#69736F] font-normal normal-case">Direct Fractional Real Estate</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18211F] tracking-tight">
                        Access Curated Prime Offerings in the Marketplace
                      </h2>
                      <p className="text-sm sm:text-base text-[#69736F] max-w-2xl leading-relaxed">
                        The full marketplace is hosted in an independent investment portal with advanced filtering, 
                        RICS certified appraisals, notarial deed verification, and real-time funding progress. 
                        Invest directly from €750 with automated monthly dividend distributions.
                      </p>
                      
                      {/* Marketplace Metrics Bar */}
                      <div className="pt-2 flex flex-wrap items-center gap-y-3 gap-x-8 text-xs font-medium text-[#18211F]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span><strong>{properties.filter(p => p.status !== 'hidden' && p.status !== 'pending_approval').length}</strong> Active Offerings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span><strong>€750</strong> Minimum Investment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span><strong>11.4%</strong> Avg. Target Net IRR</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span><strong>100%</strong> Independent SPVs</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                      <button
                        onClick={() => navigateTo('/properties')}
                        className="btn btn-primary py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <span>Enter Marketplace</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigateTo('/investing')}
                        className="btn btn-secondary py-3.5 px-6 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Review How It Works</span>
                      </button>
                    </div>
                  </div>
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
