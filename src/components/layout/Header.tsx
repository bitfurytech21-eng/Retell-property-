import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { MAIN_NAV_LINKS } from '../../data/navigation';
import { Building2, Menu, X, User as UserIcon, Shield, LogOut, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Zone */}
        <button
          onClick={() => handleNavClick('/')}
          className="brand hover:opacity-90 transition-opacity flex items-center gap-2.5 text-left"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#182D2A] flex items-center justify-center text-[#B7E36A] shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#182D2A] leading-none">
              Rental<span className="text-[#27845D]">·log</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#69736F] font-semibold mt-0.5">
              Real Estate Tokens
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="main-nav hidden md:flex items-center gap-7">
          {MAIN_NAV_LINKS.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-sm transition-colors cursor-pointer py-1 ${
                  isActive
                    ? 'text-[#182D2A] font-semibold border-b-2 border-[#182D2A]'
                    : 'text-[#69736F] hover:text-[#182D2A] font-medium'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone */}
        <div className="header-actions flex items-center gap-3">
          {user ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Wallet Balance Chip */}
                <button
                  onClick={() => handleNavClick('/dashboard')}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF1EC] text-[#182D2A] text-xs font-semibold hover:bg-[#E3E8E3] transition-colors"
                  title="View Investor Dashboard"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#27845D]" />
                  <span>{formatCurrency(user.walletBalance)}</span>
                </button>

                {/* User menu trigger */}
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E3E8E3] hover:border-[#182D2A] bg-white text-xs font-semibold text-[#182D2A] transition-all"
                >
                  <UserIcon className="w-4 h-4 text-[#69736F]" />
                  <span className="max-w-[110px] truncate">{user.fullName.split(' ')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="bg-[#182D2A] text-[#B7E36A] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                      Admin
                    </span>
                  )}
                </button>
              </div>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#E3E8E3] rounded-2xl shadow-xl py-2 z-50 text-left"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E3E8E3] mb-1">
                    <p className="text-xs text-[#69736F]">Signed in as</p>
                    <p className="text-sm font-semibold text-[#182D2A] truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#27845D] font-medium">
                      <span>KYC:</span>
                      <span className="capitalize font-semibold">{user.kycStatus}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleNavClick('/dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[#18211F] hover:bg-[#F6F7F4] flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4 text-[#69736F]" />
                    Investor Dashboard
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('/portfolio');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[#18211F] hover:bg-[#F6F7F4] flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-[#69736F]" />
                    My Portfolio
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('/transactions');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[#18211F] hover:bg-[#F6F7F4] flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-[#69736F]" />
                    Transactions & Ledger
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        handleNavClick('/admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#182D2A] bg-[#F6F7F4] hover:bg-[#EEF1EC] flex items-center gap-2 font-semibold"
                    >
                      <Shield className="w-4 h-4 text-[#27845D]" />
                      Admin Control Panel
                    </button>
                  )}

                  <div className="border-t border-[#E3E8E3] my-1" />

                  <button
                    onClick={async () => {
                      await logout();
                      setUserDropdownOpen(false);
                      onNavigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[#C24141] hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('/login')}
                className="btn btn-secondary btn-sm"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('/register')}
                className="btn btn-primary btn-sm"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#182D2A] rounded-lg hover:bg-[#F6F7F4]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E3E8E3] px-6 py-4 flex flex-col gap-3 shadow-lg">
          {MAIN_NAV_LINKS.map((link) => (
            <button
              key={`mobile-${link.path}`}
              onClick={() => handleNavClick(link.path)}
              className="text-left text-sm font-semibold text-[#182D2A] py-2 border-b border-gray-100"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('/dashboard')}
                className="btn btn-secondary btn-sm w-full"
              >
                Investor Dashboard
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('/admin')}
                  className="btn btn-primary btn-sm w-full"
                >
                  Admin Control Panel
                </button>
              )}
              <button
                onClick={async () => {
                  await logout();
                  setMobileMenuOpen(false);
                  onNavigate('/');
                }}
                className="text-xs text-red-600 font-semibold py-2 text-center cursor-pointer hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('/login')}
                className="btn btn-secondary btn-sm w-full"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('/register')}
                className="btn btn-primary btn-sm w-full"
              >
                Create Free Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
