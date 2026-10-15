import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { ledger } from '../../lib/ledger';
import { BalanceCard } from '../dashboard/BalanceCard';
import { PortfolioOverview } from '../dashboard/PortfolioOverview';
import { TransactionTable } from '../dashboard/TransactionTable';
import { DistributionsView } from '../dashboard/DistributionsView';
import { DepositModal } from '../dashboard/DepositModal';
import { WithdrawalModal } from '../dashboard/WithdrawalModal';
import { DocumentViewerModal } from '../dashboard/DocumentViewerModal';
import { ProfilePage } from './ProfilePage';
import { PropertyCard } from '../properties/PropertyCard';
import { 
  ArrowRight, ArrowLeft, LogOut, Bell, Building2, TrendingUp, Wallet, ShieldCheck, History, 
  PieChart, ArrowDownLeft, ArrowUpRight, HelpCircle, User, FileText, LayoutDashboard, Coins,
  Share2, Award, CheckCircle2, AlertCircle, ExternalLink, Copy, Check, Menu, X, Sparkles, Search
} from 'lucide-react';
import { ShortcutsHub } from '../dashboard/ShortcutsHub';
import { PropertyDocumentsHub } from '../documents/PropertyDocumentsHub';
import { PropertyDocumentGenerator } from '../documents/PropertyDocumentGenerator';
import { Property } from '../../types/property';
import { PropertyDocumentType } from '../../types/document';
import { formatCurrency, formatDate } from '../../lib/utils';

interface DashboardPageProps {
  defaultTab?: string;
  onSelectProperty: (propertyId: string) => void;
  onExploreProperties: () => void;
  onNavigateProfile: () => void;
  onNavigateTransactions: () => void;
  onNavigatePortfolio: () => void;
  onNavigateHome?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  defaultTab = 'overview',
  onSelectProperty,
  onExploreProperties,
  onNavigateProfile,
  onNavigateTransactions,
  onNavigatePortfolio,
  onNavigateHome,
}) => {
  const { user, refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(defaultTab === 'deposit' ? 'wallet' : defaultTab);
  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isDepositOpen, setIsDepositOpen] = useState(defaultTab === 'deposit');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedDocInvestment, setSelectedDocInvestment] = useState<any | null>(null);
  const [selectedGeneratorProperty, setSelectedGeneratorProperty] = useState<Property | null>(null);
  const [generatorDocType, setGeneratorDocType] = useState<PropertyDocumentType>('brochure');
  const [copiedLink, setCopiedLink] = useState(false);
  const [documentSectionTab, setDocumentSectionTab] = useState<'property-generator' | 'my-certificates'>('property-generator');

  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev.slice(-10), activeTab]);
      setActiveTab(newTab);
    }
  };

  const handleMoveBack = () => {
    if (tabHistory.length > 0 && activeTab !== 'overview') {
      const prev = tabHistory[tabHistory.length - 1];
      setTabHistory(old => old.slice(0, -1));
      setActiveTab(prev || 'overview');
    } else if (activeTab !== 'overview') {
      setActiveTab('overview');
    } else if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = '/';
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of your investor account?')) {
      setIsLoggingOut(true);
      try {
        await logout();
        if (onNavigateHome) {
          onNavigateHome();
        } else {
          window.location.hash = '/';
        }
      } catch (err) {
        console.error(err);
        if (onNavigateHome) {
          onNavigateHome();
        } else {
          window.location.hash = '/';
        }
      } finally {
        setIsLoggingOut(false);
      }
    }
  };
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [supportTicketSent, setSupportTicketSent] = useState(false);
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [dashboardTheme, setDashboardTheme] = useState<'slate' | 'sandstone' | 'titanium' | 'obsidian'>(() => {
    return (localStorage.getItem('dashboard_theme') as any) || 'slate';
  });

  const handleSelectTheme = (newTheme: 'slate' | 'sandstone' | 'titanium' | 'obsidian') => {
    setDashboardTheme(newTheme);
    localStorage.setItem('dashboard_theme', newTheme);
  };

  React.useEffect(() => {
    const handleThemeEvent = (e: any) => {
      if (e.detail) {
        setDashboardTheme(e.detail);
      }
    };
    window.addEventListener('dashboard-theme-changed', handleThemeEvent);
    return () => window.removeEventListener('dashboard-theme-changed', handleThemeEvent);
  }, []);

  React.useEffect(() => {
    if (defaultTab === 'deposit') {
      setActiveTab('wallet');
      setIsDepositOpen(true);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8 bg-[#F6F7F4]">
        <div className="w-8 h-8 border-3 border-[#182D2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const investments = ledger.getInvestments(user.id);
  const transactions = ledger.getTransactions(user.id);
  const notifications = ledger.getNotifications(user.id);
  const unreadNotifications = notifications.filter(n => !n.read);
  const properties = ledger.getProperties();

  React.useEffect(() => {
    if (activeTab === 'notifications' && unreadNotifications.length > 0) {
      ledger.markAllNotificationsAsRead(user.id);
      setDataVersion(v => v + 1);
    }
  }, [activeTab, user.id, unreadNotifications.length]);

  const handleDepositSuccess = () => {
    refreshUser();
    setDataVersion(v => v + 1);
  };

  const handleWithdrawalSuccess = () => {
    refreshUser();
    setDataVersion(v => v + 1);
  };

  const referralLink = `https://realtyfund.eu/register?ref=${user.email.split('@')[0].toUpperCase()}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'portfolio', label: 'My Portfolio', icon: Building2, count: investments.length },
    { id: 'properties', label: 'Explore Properties', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: History, count: transactions.length },
    { id: 'distributions', label: 'Distributions', icon: Coins },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'documents', label: 'Documents', icon: FileText, count: investments.length },
    { id: 'referrals', label: 'Referrals', icon: Share2 },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifications.length },
    { id: 'profile', label: 'Profile & Settings', icon: User },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div 
      className={`flex h-screen overflow-hidden dashboard-theme-${dashboardTheme}`}
      style={{ backgroundColor: 'var(--dash-bg)' }}
    >
      {/* Desktop Fixed-Width Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0A1614] border-r border-[#152B27] h-screen sticky top-0 z-30 shrink-0 text-white">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-[#152B27] flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#047857] text-white flex items-center justify-center font-black text-base shadow-sm">
            RF
          </div>
          <div>
            <h2 className="font-black text-sm text-white tracking-tight">RealtyFund Pro</h2>
            <p className="text-[10px] text-[#A0A8A5]">Institutional Real Estate</p>
          </div>
        </div>

        {/* User Mini Card */}
        <div className="p-3 mx-4 my-2.5 bg-[#11221F] rounded-2xl border border-[#1A3832] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-xs text-white truncate">{user.fullName}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {user.kycStatus === 'verified' && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#34D399] bg-[#064E3B] px-1.5 py-0.5 rounded-full border border-[#059669]/30">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Move Back Symbol Button in Sidebar */}
        <div className="px-4 pb-2">
          <button
            onClick={handleMoveBack}
            title={activeTab !== 'overview' ? 'Back to Overview' : 'Move back to Homepage'}
            aria-label="Back"
            className="w-full flex items-center justify-center p-2 rounded-xl bg-[#11221F] hover:bg-[#1A3832] border border-[#1E3E37] text-[#34D399] transition-all cursor-pointer group shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#34D399] group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#10B981]/20 to-[#047857]/25 text-[#34D399] border-l-2 border-[#10B981] shadow-xs'
                    : 'text-[#94A3B8] hover:bg-[#11221F] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#34D399]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#059669] text-white' : 'bg-[#1A3832] text-[#94A3B8]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Deposit & Logout Buttons */}
        <div className="p-4 border-t border-[#152B27] space-y-2 bg-[#0A1614]">
          <button
            onClick={() => setIsDepositOpen(true)}
            className="w-full bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 mr-1.5" /> Deposit Funds
          </button>
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="w-full bg-[#11221F] hover:bg-[#1A3832] text-white border border-[#1E3E37] text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 mr-1.5" /> Withdraw
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 hover:text-white border border-rose-900/40 text-xs font-bold transition-all cursor-pointer mt-1 disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>{isLoggingOut ? 'Logging out...' : 'Sign Out / Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        {/* Top Header Bar */}
        <header className="dash-header backdrop-blur-md border-b h-16 shrink-0 z-20 px-3 sm:px-8 flex items-center justify-between shadow-xs relative">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Move Back Symbol Button */}
            <button
              onClick={handleMoveBack}
              title={activeTab !== 'overview' ? 'Return to Dashboard Overview' : 'Move back to Homepage'}
              aria-label="Back"
              className="w-8 h-8 rounded-xl bg-[#11221F] hover:bg-[#1A3832] text-white border border-[#1E3E37] transition-all shadow-xs cursor-pointer group hover:border-[#10B981]/50 flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[#34D399] group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => handleTabChange('profile')}
              title="View Profile & Settings"
              className="md:hidden w-8 h-8 rounded-xl bg-[#0A1614] text-[#34D399] flex items-center justify-center font-black text-xs shadow-sm hover:opacity-90 transition-opacity cursor-pointer border border-[#152B27]"
            >
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </button>
            
            {/* Clean Static Portal Identity & Network Health Badge (No dynamic changing tab title!) */}
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight dash-text hidden md:inline">
                RealtyFund <span className="text-[#10B981]">Vault</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="hidden sm:inline">Institutional · Polygon & SEPA Live</span>
                <span className="sm:hidden">Live</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Instant Wallet Balance Quick View */}
            <button
              onClick={() => handleTabChange('wallet')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg dash-inner border text-xs font-bold dash-text hover:opacity-90 transition-all cursor-pointer"
              title="View Liquid Cash Wallet"
            >
              <Wallet className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{formatCurrency(user.walletBalance)}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => handleTabChange('notifications')}
              title="Notifications"
              className={`relative w-8 h-8 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-[#059669] to-[#10B981] text-white border-transparent shadow-xs'
                  : 'dash-inner border dash-text hover:opacity-85'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#059669] text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Dedicated Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Log Out of Investor Account"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* NAVBAR ICON: Power Shortcuts & Tools Hub */}
            <button
              onClick={() => setIsShortcutsOpen(!isShortcutsOpen)}
              title="Quick Power Shortcuts & Utilities"
              className={`relative w-8 h-8 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                isShortcutsOpen
                  ? 'bg-gradient-to-r from-[#059669] to-[#10B981] text-white border-transparent shadow-xs ring-2 ring-emerald-500/20'
                  : 'dash-inner border dash-text hover:opacity-85'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="sr-only">Power Shortcuts</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#059669]"></span>
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Welcome Back Widget */}
                <div className="bg-gradient-to-r from-[#182D2A] to-[#24423C] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-no-repeat bg-right opacity-10 pointer-events-none bg-[radial-gradient(#B7E36A_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="flex items-center gap-5 z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#B7E36A] text-[#182D2A] flex items-center justify-center font-black text-2xl shadow-md shrink-0 overflow-hidden">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        user.fullName.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    <div>
                      {user.kycStatus === 'verified' && (
                        <div className="mb-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-900/40 px-2.5 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Verified Investor
                          </span>
                        </div>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Welcome back, {user.fullName}! 👋
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 z-10 shrink-0">
                    <button
                      onClick={() => setIsDepositOpen(true)}
                      className="btn btn-accent text-xs font-bold px-5 py-3 shadow-md"
                    >
                      <ArrowDownLeft className="w-4 h-4 mr-1.5" /> Deposit Funds
                    </button>
                    <button
                      onClick={() => setActiveTab('properties')}
                      className="btn bg-white/10 text-white hover:bg-white/20 border border-white/20 text-xs font-bold px-4 py-3"
                    >
                      Explore Properties
                    </button>
                  </div>
                </div>

                {unreadNotifications.length > 0 && (
                  <div className="dash-inner border p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm bg-emerald-950/20 border-emerald-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold dash-text mr-1.5">{unreadNotifications[0].title}:</span>
                        <span className="dash-muted">{unreadNotifications[0].message}</span>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('notifications')} className="text-xs font-bold text-emerald-400 hover:underline whitespace-nowrap">
                      View All ({unreadNotifications.length})
                    </button>
                  </div>
                )}

                <BalanceCard
                  user={user}
                  onDeposit={() => setIsDepositOpen(true)}
                  onWithdraw={() => setIsWithdrawOpen(true)}
                />

                <div className="dash-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold dash-text">Your Tokenized Assets</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      View Full Portfolio <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <PortfolioOverview
                    investments={investments}
                    onSelectProperty={onSelectProperty}
                    onExploreMore={() => setActiveTab('properties')}
                  />
                </div>

                <div className="dash-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold dash-text">Recent Transactions & Distributions</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      All Transactions ({transactions.length}) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <TransactionTable transactions={transactions} maxRows={5} />
                </div>
              </div>
            )}

            {/* 2. MY PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="dash-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black dash-text">My Real Estate Portfolio</h2>
                  </div>
                </div>
                <PortfolioOverview
                  investments={investments}
                  onSelectProperty={onSelectProperty}
                  onExploreMore={() => setActiveTab('properties')}
                />
              </div>
            )}

            {/* 3. EXPLORE PROPERTIES TAB */}
            {activeTab === 'properties' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dash-card p-6 rounded-3xl border">
                  <div>
                    <h2 className="text-2xl font-black dash-text">Explore Investment Opportunities</h2>
                  </div>
                  <button onClick={onExploreProperties} className="btn btn-secondary btn-sm text-xs font-bold">
                    Open Full Marketplace View
                  </button>
                </div>

                <div className="property-grid">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={(prop) => onSelectProperty(prop.id)}
                      onInvest={(prop) => {
                        onSelectProperty(prop.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 4. TRANSACTIONS TAB */}
            {activeTab === 'transactions' && (
              <div className="dash-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl font-black dash-text">Transactions & Audit Ledger</h2>
                </div>
                <TransactionTable transactions={transactions} />
              </div>
            )}

            {/* 5. DISTRIBUTIONS TAB */}
            {activeTab === 'distributions' && (
              <div className="animate-in fade-in duration-200">
                <DistributionsView
                  investments={investments}
                  transactions={transactions}
                  onSelectProperty={onSelectProperty}
                  onExploreProperties={() => setActiveTab('properties')}
                />
              </div>
            )}

            {/* 6. WALLET TAB */}
            {activeTab === 'wallet' && (
              <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
                <div className="dash-card p-8 rounded-3xl border shadow-sm space-y-6">
                  <div>
                    <h2 className="text-2xl font-black dash-text">Investor Wallet & Balances</h2>
                  </div>

                  <BalanceCard
                    user={user}
                    onDeposit={() => setIsDepositOpen(true)}
                    onWithdraw={() => setIsWithdrawOpen(true)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="p-6 rounded-2xl dash-inner border space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm dash-text">
                        <Building2 className="w-4 h-4 text-emerald-400" /> SEPA Instant Bank Transfer
                      </div>
                      <p className="text-xs dash-muted">
                        Linked IBAN: <code className="dash-card px-2 py-0.5 rounded border dash-text">DE89 3704 0044 ... 9012</code>
                      </p>
                      <button onClick={() => setIsDepositOpen(true)} className="btn btn-primary btn-sm text-xs font-bold w-full">
                        Deposit via SEPA
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl dash-inner border space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm dash-text">
                        <Coins className="w-4 h-4 text-emerald-400" /> USDC / Stablecoin Gateway
                      </div>
                      <p className="text-xs dash-muted">
                        Instant settlement on Ethereum / Polygon network.
                      </p>
                      <button onClick={() => setIsDepositOpen(true)} className="btn btn-secondary btn-sm text-xs font-bold w-full">
                        Deposit USDC
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header & Section Switcher */}
                <div className="dash-card p-6 sm:p-7 rounded-3xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black dash-text">Property Documents & Legal Hub</h2>
                    <p className="text-xs dash-muted mt-0.5">
                      Generate, customize, download and print official documentation, brochures, and reservation agreements for every listed property.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-inherit/30 shrink-0 dash-inner">
                    <button
                      onClick={() => setDocumentSectionTab('property-generator')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        documentSectionTab === 'property-generator'
                          ? 'bg-[#182D2A] text-[#00FF9D] shadow-xs'
                          : 'dash-muted hover:opacity-100'
                      }`}
                    >
                      Property Generator ({properties.length})
                    </button>
                    <button
                      onClick={() => setDocumentSectionTab('my-certificates')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        documentSectionTab === 'my-certificates'
                          ? 'bg-[#182D2A] text-[#00FF9D] shadow-xs'
                          : 'dash-muted hover:opacity-100'
                      }`}
                    >
                      My SPV Certificates ({investments.length})
                    </button>
                  </div>
                </div>

                {/* Quick Property Document Generator Action Bar */}
                <div className="dash-card p-5 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#27845D]/15 text-[#27845D] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold dash-text">Instant Document Generator & Preview</h3>
                      <p className="text-xs dash-muted">Select any property to preview luxury brochures or generate binding legal reservation forms</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      className="text-xs font-bold p-2.5 rounded-xl border border-inherit/40 dash-inner dash-text max-w-xs cursor-pointer"
                      onChange={(e) => {
                        const found = properties.find(p => p.id === e.target.value);
                        if (found) {
                          setSelectedGeneratorProperty(found);
                          setGeneratorDocType('brochure');
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select property to preview...</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.city})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const target = properties[0];
                        if (target) {
                          setSelectedGeneratorProperty(target);
                          setGeneratorDocType('brochure');
                        }
                      }}
                      className="btn btn-secondary text-xs font-bold px-3 py-2 flex items-center gap-1 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#27845D]" /> Property Brochure
                    </button>

                    <button
                      onClick={() => {
                        const target = properties[0];
                        if (target) {
                          setSelectedGeneratorProperty(target);
                          setGeneratorDocType('reservation-agreement');
                        }
                      }}
                      className="btn btn-primary text-xs font-bold px-3.5 py-2 flex items-center gap-1 cursor-pointer bg-[#27845D] text-white shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" /> Reservation Form
                    </button>
                  </div>
                </div>

                {documentSectionTab === 'property-generator' ? (
                  <PropertyDocumentsHub properties={properties} />
                ) : (
                  <div className="dash-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
                    <div>
                      <h3 className="text-lg font-bold dash-text">Personal Portfolio Investment Deeds</h3>
                      <p className="text-xs dash-muted">Audited ownership certificates and tokenized equity rights</p>
                    </div>

                    {investments.length === 0 ? (
                      <div className="text-center py-12 dash-muted space-y-3">
                        <FileText className="w-12 h-12 mx-auto opacity-40" />
                        <p className="text-sm font-semibold">No active investments yet.</p>
                        <button onClick={() => setActiveTab('properties')} className="btn btn-primary btn-sm text-xs font-bold cursor-pointer">
                          Explore Properties
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {investments.map((inv) => {
                          const prop = properties.find(p => p.id === inv.propertyId);
                          return (
                            <div key={inv.id} className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 dash-inner hover:opacity-90 transition-opacity">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#182D2A] text-[#B7E36A] flex items-center justify-center font-bold">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="font-bold dash-text text-sm">{inv.propertyTitle || prop?.title || 'Real Estate Asset'}</h4>
                                  <p className="text-xs dash-muted">
                                    Invested {formatCurrency(inv.totalAmountInvested)} · {inv.tokensPurchased} Tokens · {formatDate(inv.purchasedAt)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => setSelectedDocInvestment(inv)}
                                  className="btn btn-secondary btn-sm text-xs font-bold cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 mr-1" /> View SPV Certificate
                                </button>
                                {prop && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedGeneratorProperty(prop);
                                        setGeneratorDocType('brochure');
                                      }}
                                      className="btn btn-secondary btn-sm text-xs font-bold cursor-pointer flex items-center gap-1"
                                      title="Preview Property Brochure"
                                    >
                                      <Building2 className="w-3.5 h-3.5 text-[#27845D]" /> Brochure
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedGeneratorProperty(prop);
                                        setGeneratorDocType('reservation-agreement');
                                      }}
                                      className="btn btn-primary btn-sm text-xs font-bold cursor-pointer flex items-center gap-1 bg-[#27845D] text-white"
                                      title="Open Reservation Agreement & Terms"
                                    >
                                      <FileText className="w-3.5 h-3.5" /> Reservation Form
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 8. REFERRALS TAB */}
            {activeTab === 'referrals' && (
              <div className="dash-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black dash-text">Investor Referral Program</h2>
                  </div>
                </div>

                <div className="p-6 rounded-2xl dash-inner border space-y-4">
                  <label className="block text-xs font-bold dash-text">Your Unique Referral Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="w-full px-4 py-2.5 rounded-xl border dash-card text-xs font-mono dash-text"
                    />
                    <button
                      onClick={copyReferral}
                      className="btn btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 shrink-0"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedLink ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-5 rounded-2xl border dash-inner">
                    <div className="text-2xl font-black dash-text">0</div>
                    <div className="text-xs dash-muted mt-1">Successful Referrals</div>
                  </div>
                  <div className="p-5 rounded-2xl border dash-inner">
                    <div className="text-2xl font-black text-emerald-400">€0.00</div>
                    <div className="text-xs dash-muted mt-1">Referral Bonuses Earned</div>
                  </div>
                  <div className="p-5 rounded-2xl border dash-inner">
                    <div className="text-2xl font-black dash-text">€500</div>
                    <div className="text-xs dash-muted mt-1">Bonus Per Investor</div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="dash-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black dash-text">Notification Center</h2>
                    <p className="text-xs dash-muted mt-0.5">Stay updated on your deposits, property yields, and account activity</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotifications.length > 0 ? (
                      <button
                        onClick={() => {
                          ledger.markAllNotificationsAsRead(user.id);
                          setDataVersion(v => v + 1);
                        }}
                        className="px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/30 text-xs font-bold">
                        All Read
                      </span>
                    )}
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-12 dash-muted space-y-2">
                    <Bell className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-sm font-semibold">You have no new notifications.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.read) {
                            ledger.markNotificationAsRead(notif.id);
                            setDataVersion(v => v + 1);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                          notif.read
                            ? 'dash-inner opacity-75 border-[#152B27]'
                            : 'bg-emerald-950/20 border-emerald-500/40 shadow-xs'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                          notif.read ? 'dash-card text-emerald-400/60' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        }`}>
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                              )}
                              <h4 className="font-bold dash-text text-xs">{notif.title}</h4>
                            </div>
                            <span className="text-[10px] dash-muted">{formatDate(notif.createdAt)}</span>
                          </div>
                          <p className="text-xs dash-muted">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 10. PROFILE & SETTINGS TAB */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-200">
                <ProfilePage 
                  dashboardTheme={dashboardTheme}
                  onSelectTheme={handleSelectTheme}
                />
              </div>
            )}

            {/* 11. HELP & SUPPORT TAB */}
            {activeTab === 'support' && (
              <div className="dash-card p-8 rounded-3xl border shadow-sm space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black dash-text">Investor Support & Help Center</h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-5 rounded-2xl dash-inner border space-y-2">
                    <h3 className="font-bold dash-text text-sm">Frequently Asked Questions</h3>
                    <ul className="space-y-2 dash-muted">
                      <li>• <strong>When are rental dividends paid?</strong> Dividends are credited automatically to your available balance on the 1st of every month.</li>
                      <li>• <strong>How do I withdraw funds?</strong> Go to your wallet balance and click Withdraw. SEPA transfers take 1-2 business days.</li>
                      <li>• <strong>What is the minimum investment?</strong> All properties have a minimum investment threshold of €1,000.</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl dash-inner border space-y-4">
                    <h3 className="font-bold dash-text text-sm">Contact Investor Relations</h3>
                    {supportTicketSent ? (
                      <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>Support Ticket Submitted Successfully</span>
                        </div>
                        <p>Our European compliance and investor relations desk will review your inquiry and respond within 4 hours.</p>
                        <button
                          onClick={() => setSupportTicketSent(false)}
                          className="btn btn-secondary btn-sm text-xs font-semibold mt-2"
                        >
                          Submit Another Inquiry
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setSupportTicketSent(true);
                        }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="block text-[11px] font-semibold dash-muted mb-1">Subject</label>
                          <input type="text" placeholder="e.g. Question about SEPA deposit or SPV deed" required className="w-full px-4 py-2.5 rounded-xl border dash-card dash-text text-xs focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold dash-muted mb-1">Message</label>
                          <textarea rows={4} placeholder="Describe your inquiry..." required className="w-full px-4 py-2.5 rounded-xl border dash-card dash-text text-xs focus:outline-none focus:border-emerald-500" />
                        </div>
                        <button type="submit" className="btn btn-primary text-xs font-bold px-6">
                          Submit Support Request
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A1614] border-t border-[#152B27] flex items-center justify-around py-2 px-1 shadow-2xl">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'portfolio', label: 'Portfolio', icon: Building2 },
          { id: 'properties', label: 'Explore', icon: TrendingUp },
          { id: 'transactions', label: 'Ledger', icon: History },
          { id: 'more', label: 'More', icon: Coins, isMore: true },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = !tab.isMore && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.isMore) {
                  setIsMoreMenuOpen(true);
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                isActive ? 'text-[#34D399]' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* More Menu Modal / Bottom Sheet for Mobile */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 md:hidden flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#0A1614] rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto space-y-3 border-t border-[#152B27] text-white">
            <div className="flex items-center justify-between border-b border-[#152B27] pb-2.5">
              <span className="font-extrabold text-xs text-white">Menu & Navigation</span>
              <button onClick={() => setIsMoreMenuOpen(false)} className="text-[11px] font-bold text-[#94A3B8] hover:text-white cursor-pointer">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabChange(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                      isActive ? 'bg-gradient-to-r from-[#10B981]/20 to-[#047857]/25 text-[#34D399] border-[#10B981]' : 'bg-[#11221F] text-white border-[#1A3832] hover:border-[#10B981]/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Actions: Move Back & Logout */}
            <div className="pt-2 border-t border-[#152B27] flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  handleMoveBack();
                }}
                title={activeTab !== 'overview' ? 'Back to Overview' : 'Move back to Homepage'}
                aria-label="Back"
                className="p-2.5 rounded-xl bg-[#11221F] hover:bg-[#1A3832] text-white border border-[#1E3E37] text-xs font-bold transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-[#34D399]" />
              </button>
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-900/50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out / Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onSuccess={handleDepositSuccess}
      />

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onSuccess={handleWithdrawalSuccess}
        onNavigateProfile={() => setActiveTab('profile')}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        investment={selectedDocInvestment}
        isOpen={!!selectedDocInvestment}
        onClose={() => setSelectedDocInvestment(null)}
      />

      {/* Property Document Generator Preview Modal */}
      {selectedGeneratorProperty && (
        <PropertyDocumentGenerator
          property={selectedGeneratorProperty}
          initialType={generatorDocType}
          isOpen={!!selectedGeneratorProperty}
          onClose={() => setSelectedGeneratorProperty(null)}
          buyerInfo={{
            buyerName: user?.fullName || 'David Vance',
            buyerEmail: user?.email || 'investor@reental-log.com',
            buyerPhone: user?.phoneNumber || '+34 612 345 678',
            buyerNationality: user?.country || 'European Union'
          }}
          onDocumentUpdated={() => setDataVersion(v => v + 1)}
        />
      )}

      {/* Brought-Down Power Shortcuts & Utilities Hub (Clear View Architecture) */}
      <ShortcutsHub
        user={user}
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsShortcutsOpen(false);
        }}
        onOpenDeposit={() => {
          setIsDepositOpen(true);
          setIsShortcutsOpen(false);
        }}
        onOpenWithdraw={() => {
          setIsWithdrawOpen(true);
          setIsShortcutsOpen(false);
        }}
      />
    </div>
  );
};
