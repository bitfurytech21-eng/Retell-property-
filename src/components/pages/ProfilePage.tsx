import React, { useState, useRef } from 'react';
import { useAuth } from '../../lib/auth';
import { ledger } from '../../lib/ledger';
import { userApi } from '../../lib/api';
import { formatDate } from '../../lib/utils';
import { KYCStatus, getAccountTypeLabel, getAccountTypeBadge } from '../../types/user';
import { 
  ShieldCheck, User as UserIcon, Building2, UploadCloud, CheckCircle2, 
  Clock, XCircle, AlertCircle, Palette, Check, Lock, Crown,
  FileText, Eye, Trash2, Download, Paperclip, RefreshCw, ZoomIn, X, ExternalLink, FileCheck
} from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';
import { AccountTypeSwitcher } from '../common/AccountTypeSwitcher';
import { UserMembershipCard } from '../club/UserMembershipCard';

export type DashboardThemeId = 'slate' | 'sandstone' | 'titanium' | 'obsidian';

export interface ThemeOption {
  id: DashboardThemeId;
  name: string;
  desc: string;
  preview: string;
  border: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'slate', name: 'Executive Slate', desc: 'Midnight slate blue & deep graphite (Default dark)', preview: '#0B0F19', border: '#1E293B' },
  { id: 'sandstone', name: 'Warm Sandstone', desc: 'Luxury cashmere & architectural warm stone tone', preview: '#E7E1D4', border: '#DCD4C6' },
  { id: 'titanium', name: 'Nordic Titanium', desc: 'Clean cool steel & minimalist titanium aesthetic', preview: '#DCE3EB', border: '#CBD5E1' },
  { id: 'obsidian', name: 'Obsidian Carbon', desc: 'Ultra-deep pure OLED jet black contrast', preview: '#090A0E', border: '#1D212B' },
];

interface ProfilePageProps {
  dashboardTheme?: DashboardThemeId;
  onSelectTheme?: (theme: DashboardThemeId) => void;
}

export interface KycUploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

const SAMPLE_PASSPORT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380"><rect width="600" height="380" rx="16" fill="%230f1e1b"/><rect x="16" y="16" width="568" height="348" rx="12" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><rect x="16" y="16" width="568" height="48" rx="12" fill="%23182d2a"/><text x="36" y="46" fill="%23b7e36a" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" letter-spacing="1">UNIÓN EUROPEA · DOCUMENTO OFICIAL DE IDENTIDAD</text><rect x="40" y="80" width="130" height="165" rx="8" fill="%23e2e8f0" stroke="%2394a3b8"/><circle cx="105" cy="135" r="32" fill="%2394a3b8"/><path d="M65,220 C65,180 145,180 145,220 Z" fill="%2394a3b8"/><text x="190" y="102" fill="%2364748b" font-family="sans-serif" font-size="10" font-weight="bold">DOCUMENTO / DOCUMENT TYPE</text><text x="190" y="122" fill="%230f172a" font-family="sans-serif" font-size="13" font-weight="bold">PASAPORTE BIOMÉTRICO (PASSPORT)</text><text x="420" y="102" fill="%2364748b" font-family="sans-serif" font-size="10" font-weight="bold">PAÍS EMISOR / ISSUING STATE</text><text x="420" y="122" fill="%230f172a" font-family="sans-serif" font-size="13" font-weight="bold">ESP (ESPAÑA)</text><text x="190" y="152" fill="%2364748b" font-family="sans-serif" font-size="10" font-weight="bold">APELLIDOS / SURNAME</text><text x="190" y="172" fill="%230f172a" font-family="sans-serif" font-size="13" font-weight="bold">GARCÍA HERNÁNDEZ</text><text x="190" y="202" fill="%2364748b" font-family="sans-serif" font-size="10" font-weight="bold">NOMBRE / GIVEN NAMES</text><text x="190" y="222" fill="%230f172a" font-family="sans-serif" font-size="13" font-weight="bold">ALEJANDRO</text><text x="190" y="252" fill="%2364748b" font-family="sans-serif" font-size="10" font-weight="bold">N° DE REGISTRO / REG NO.</text><text x="190" y="272" fill="%230f172a" font-family="monospace" font-size="13" font-weight="bold">PAE749201-ESP-98</text><rect x="36" y="295" width="528" height="52" rx="6" fill="%23f1f5f9" stroke="%23e2e8f0"/><text x="48" y="316" fill="%23334155" font-family="monospace" font-size="11">P&lt;ESPGARCIA&lt;HERNANDEZ&lt;&lt;ALEJANDRO&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text><text x="48" y="334" fill="%23334155" font-family="monospace" font-size="11">PAE7492014ESP8804152M3208159A19208000&lt;&lt;&lt;&lt;42</text></svg>`;

export const ProfilePage: React.FC<ProfilePageProps> = ({
  dashboardTheme,
  onSelectTheme
}) => {
  const { user, refreshUser } = useAuth();
  const [docType, setDocType] = useState('Passport');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<KycUploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string; type?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localTheme, setLocalTheme] = useState<DashboardThemeId>(() => {
    return (localStorage.getItem('dashboard_theme') as DashboardThemeId) || 'slate';
  });

  const activeTheme = dashboardTheme || localTheme;

  const handleThemeChange = (newTheme: DashboardThemeId) => {
    setLocalTheme(newTheme);
    localStorage.setItem('dashboard_theme', newTheme);
    if (onSelectTheme) {
      onSelectTheme(newTheme);
    }
    window.dispatchEvent(new CustomEvent('dashboard-theme-changed', { detail: newTheme }));
    setMessage(`Dashboard background tone updated to ${THEME_OPTIONS.find(t => t.id === newTheme)?.name}!`);
  };

  if (!user) return null;

  const handleFileSelect = (selectedFileList: FileList | File[]) => {
    const list = Array.from(selectedFileList);
    if (list.length === 0) return;

    list.forEach(file => {
      if (file.size > 15 * 1024 * 1024) {
        setMessage('Selected file exceeds maximum 15MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        setUploadedFiles(prev => [
          ...prev,
          {
            id: 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            name: file.name,
            size: file.size,
            type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
            dataUrl: resultUrl
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleLoadSampleDocument = () => {
    setUploadedFiles([
      {
        id: 'sample-' + Date.now(),
        name: 'EU_Passport_Official_Scan_Sample.svg',
        size: 34500,
        type: 'image/svg+xml',
        dataUrl: SAMPLE_PASSPORT_SVG
      }
    ]);
    setMessage('Sample European Passport loaded! Ready to submit for compliance verification.');
  };

  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      setMessage('Please upload at least one identity document scan or select a sample document before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const primary = uploadedFiles[0];
      
      // 1. Submit to Backend API server
      try {
        await userApi.submitKycDocument({
          docType,
          documentName: primary.name,
          documentUrl: primary.dataUrl
        });
      } catch (apiErr) {
        console.warn('Backend KYC submit warning:', apiErr);
      }

      // 2. Submit to local ledger state
      ledger.updateKYCStatus(
        user.id, 
        'pending', 
        docType, 
        primary.dataUrl, 
        primary.name
      );

      refreshUser();
      setIsSubmitting(false);
      setShowUploadForm(false);
      setMessage(`Identity document "${primary.name}" (${docType}) successfully submitted to the compliance verification vault!`);
      setUploadedFiles([]);
    } catch (err: any) {
      setIsSubmitting(false);
      setMessage(err.message || 'Failed to submit identity document.');
    }
  };

  const handleAvatarUpload = (base64: string) => {
    ledger.updateUserAvatar(user.id, base64);
    refreshUser();
    setMessage('Profile picture updated successfully in real-time!');
  };

  const handleAvatarRemove = () => {
    ledger.updateUserAvatar(user.id, '');
    refreshUser();
    setMessage('Custom profile picture removed.');
  };

  const renderKYCBadge = (status: KYCStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#27845D] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Identity Verified (Level 2)
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#B7791F] text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Under Compliance Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C24141] text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> Verification Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF1EC] text-[#69736F] text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" /> Unverified
          </span>
        );
    }
  };

  return (
    <div className="py-4 space-y-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black dash-text">Account & Verification</h1>
          <p className="text-xs dash-muted">
            Manage your personal investor profile, background color theme, compliance status, and security preferences.
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="dash-card p-7 rounded-3xl border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-inherit/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#182D2A] text-[#B7E36A] flex items-center justify-center font-bold text-lg overflow-hidden shadow-sm">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user.fullName.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold dash-text">{user.fullName}</h2>
                <span className="text-xs dash-muted">{user.email}</span>
                <div className="mt-2">{renderKYCBadge(user.kycStatus)}</div>
              </div>
            </div>
          </div>

          {/* Dedicated Image Uploader Component */}
          <div className="pt-2">
            <h3 className="text-sm font-bold dash-text mb-3">Custom Profile Photo</h3>
            <ImageUploader
              currentAvatarUrl={user.avatarUrl}
              userName={user.fullName}
              onUpload={handleAvatarUpload}
              onRemove={handleAvatarRemove}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl dash-inner border">
              <span className="dash-muted block mb-0.5">Investor ID</span>
              <span className="font-mono font-bold dash-text">{user.id}</span>
            </div>
            <div className="p-4 rounded-2xl dash-inner border">
              <span className="dash-muted block mb-0.5">Account Type</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-bold dash-text">{getAccountTypeLabel(user.accountType, user.role)}</span>
                <span className="text-[10px] font-bold text-[#27845D] bg-[#27845D]/10 px-2 py-0.5 rounded-full">
                  {getAccountTypeBadge(user.accountType, user.role)}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-2xl dash-inner border">
              <span className="dash-muted block mb-0.5">Assigned Crypto Deposit Address</span>
              <span className="font-mono font-bold dash-text break-all">{user.cryptoDepositAddress}</span>
            </div>
            <div className="p-4 rounded-2xl dash-inner border">
              <span className="dash-muted block mb-0.5">Account Registered Since</span>
              <span className="font-bold dash-text">
                {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Kretz Club Privé Membership Status */}
        {(() => {
          const userMem = ledger.getUserMembership(user.id);
          const tiers = ledger.getMembershipTiers();
          return (
            <div className="dash-card p-7 rounded-3xl border shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-inherit/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold dash-text">Kretz Club Privé Pass</h3>
                    <p className="text-xs dash-muted">
                      Your exclusive membership credentials, off-market privileges, and concierge code.
                    </p>
                  </div>
                </div>
                <a
                  href="#/club"
                  className="px-3.5 py-1.5 rounded-xl border border-inherit/30 text-xs font-semibold hover:bg-white/10 transition-colors"
                >
                  Club Portal →
                </a>
              </div>

              {userMem ? (
                <UserMembershipCard
                  membership={userMem}
                  tiers={tiers}
                  onRefresh={refreshUser}
                  onUpgradeClick={() => { window.location.hash = '/club'; }}
                />
              ) : (
                <div className="p-6 rounded-2xl dash-inner border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold dash-text text-sm">No Active Membership Pass</p>
                    <p className="text-xs dash-muted">
                      Unlock confidential off-market property dossiers, private salon cocktail invitations, and dedicated lifestyle advisory.
                    </p>
                  </div>
                  <a
                    href="#/club"
                    className="px-5 py-2.5 rounded-xl bg-[#182D2A] text-[#B7E36A] font-bold text-xs hover:bg-[#24423C] transition-colors whitespace-nowrap"
                  >
                    Explore Membership Tiers
                  </a>
                </div>
              )}
            </div>
          );
        })()}

        {/* Account Type Switcher Component */}
        <AccountTypeSwitcher user={user} onRefresh={refreshUser} onMessage={(m) => setMessage(m)} />


        {/* Dashboard Appearance & Color Theme Settings Feature */}
        <div className="dash-card p-7 rounded-3xl border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                <Palette className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold dash-text">Dashboard Background & Appearance</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    Live Tone
                  </span>
                </div>
                <p className="text-xs dash-muted">
                  Choose your dashboard background color outside the navy green tones. Updates in real-time across the platform.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold dash-muted bg-inherit/10 px-3 py-1.5 rounded-xl border border-inherit/20 self-start sm:self-auto">
              <span>Active Theme:</span>
              <span className="text-emerald-400 font-bold">
                {THEME_OPTIONS.find(t => t.id === activeTheme)?.name}
              </span>
            </div>
          </div>

          {/* Theme Option Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = activeTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleThemeChange(opt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20 shadow-md'
                      : 'dash-inner border-inherit/30 hover:border-inherit/60 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl border shadow-inner flex items-center justify-center shrink-0"
                        style={{ backgroundColor: opt.preview, borderColor: opt.border }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold dash-text flex items-center gap-2">
                          {opt.name}
                          {isSelected && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] dash-muted mt-0.5">{opt.desc}</div>
                      </div>
                    </div>
                  </div>

                  {/* Swatch & Preview Bar */}
                  <div className="pt-2 border-t border-inherit/20 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.preview }} />
                      <span className="font-mono text-[10px] dash-muted">{opt.preview}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-400' : 'dash-muted'}`}>
                      {isSelected ? 'Currently Applied' : 'Click to Set Tone'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Identity Verification (KYC) Dossier & Document Upload Section */}
        <div className="dash-card p-7 rounded-3xl border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold dash-text">Identity Verification & Documents (KYC / AML)</h3>
                  {user.kycStatus === 'verified' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Level 2 Active
                    </span>
                  )}
                </div>
                <p className="text-xs dash-muted">
                  European AML Directive 2018/843 regulatory compliance. Upload notarized government documents for institutional verification.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {renderKYCBadge(user.kycStatus)}
            </div>
          </div>

          {/* Current Submitted Document on File Card */}
          {(user.kycDocumentName || user.kycDocumentUrl || user.kycStatus === 'verified' || user.kycStatus === 'pending') && (
            <div className="p-4 rounded-2xl dash-inner border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#182D2A] text-[#B7E36A] flex items-center justify-center shrink-0 shadow-xs">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold dash-text">
                      {user.kycDocumentType || 'Government Identity Document'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#24423C] text-[#B7E36A] font-semibold">
                      Encrypted File
                    </span>
                  </div>
                  <p className="text-[11px] dash-muted mt-0.5">
                    File: <strong className="dash-text">{user.kycDocumentName || 'Official_Government_ID_Scan.pdf'}</strong>
                    {user.kycSubmittedAt && ` · Submitted on ${formatDate(user.kycSubmittedAt)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {user.kycDocumentUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewDoc({
                      name: user.kycDocumentName || user.kycDocumentType || 'KYC Document',
                      url: user.kycDocumentUrl!,
                      type: user.kycDocumentUrl!.startsWith('data:image') || user.kycDocumentUrl!.includes('svg') ? 'image' : 'pdf'
                    })}
                    className="btn btn-secondary btn-sm text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Scan</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="btn btn-primary btn-sm text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{showUploadForm ? 'Hide Uploader' : 'Upload Updated Document'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Document Upload Form */}
          {(user.kycStatus !== 'verified' || showUploadForm) && (
            <form onSubmit={handleKYCSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="dash-text">Document Category</label>
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)} 
                    className="dash-inner border dash-text rounded-xl p-2.5 text-xs font-bold w-full"
                  >
                    <option value="Passport">International Biometric Passport</option>
                    <option value="National Identity Card">European National Identity Card (DNI / NIE)</option>
                    <option value="Driver's License">Official Driver's License</option>
                    <option value="Proof of Address">Proof of Residential Address (Utility Bill / Bank Statement &lt; 3 months)</option>
                    <option value="Corporate Entity Bylaws">Corporate Incorporation Deed / Commercial Register (Entities)</option>
                  </select>
                </div>

                <div className="flex items-end justify-between sm:justify-end pb-1">
                  <span className="text-xs dash-muted">
                    Official scans must be clearly readable without glare or cropped margins.
                  </span>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFileSelect(e.dataTransfer.files);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/15'
                    : 'border-inherit/40 dash-inner hover:border-emerald-500/60 hover:bg-white/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,image/png,image/jpeg,image/webp,.jpg"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold dash-text">
                  Drag & Drop Document Scan or <span className="text-emerald-400 underline">Browse Files</span>
                </h4>
                <p className="text-xs dash-muted mt-1 max-w-sm mx-auto">
                  Accepted formats: PDF, JPG, PNG, WEBP (Max 15MB). Both front and back required for European ID cards.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Select File from Device</span>
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] dash-muted">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-bit AES Encryption
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated Compliance Verification
                  </span>
                </div>
              </div>

              {/* Uploaded Files Queue List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold dash-text block">
                    Staged Documents Ready for Compliance Submission ({uploadedFiles.length}):
                  </span>
                  <div className="space-y-2">
                    {uploadedFiles.map((f) => (
                      <div
                        key={f.id}
                        className="p-3.5 rounded-2xl dash-inner border flex items-center justify-between gap-3 animate-in fade-in duration-150"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#182D2A] text-[#B7E36A] flex items-center justify-center shrink-0">
                            {f.type.includes('image') || f.name.endsWith('.svg') || f.name.endsWith('.jpg') || f.name.endsWith('.png') ? (
                              <img src={f.dataUrl} alt={f.name} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold dash-text block truncate max-w-xs sm:max-w-md">
                              {f.name}
                            </span>
                            <span className="text-[10px] dash-muted">
                              {(f.size / 1024).toFixed(1)} KB · {docType}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc({ name: f.name, url: f.dataUrl, type: f.type })}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-400 transition-colors cursor-pointer"
                            title="Preview file"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedFile(f.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit KYC Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || uploadedFiles.length === 0}
                  className="btn btn-primary text-xs font-bold py-3 px-8 w-full sm:w-auto shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#182D2A] border-t-transparent rounded-full animate-spin" />
                      <span>Encrypting & Submitting to Compliance Vault...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Submit Document for Compliance Review</span>
                    </>
                  )}
                </button>

                {showUploadForm && (
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="btn btn-secondary text-xs font-medium py-3 px-6 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Document Lightbox Preview Modal */}
        {previewDoc && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreviewDoc(null);
            }}
          >
            <div className="bg-[#142421] text-white rounded-3xl max-w-2xl w-full border border-[#24423C] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-[#24423C] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#B7E36A]" />
                  <span className="text-xs font-bold text-white truncate max-w-md">{previewDoc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewDoc.url}
                    download={previewDoc.name}
                    className="p-1.5 rounded-lg bg-[#1E332E] text-[#A0A8A5] hover:text-white transition-colors"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 rounded-lg bg-[#1E332E] text-[#A0A8A5] hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex items-center justify-center bg-[#0B1513] min-h-[300px] max-h-[70vh] overflow-auto">
                {previewDoc.url.startsWith('data:image') || previewDoc.url.includes('svg') || previewDoc.name.endsWith('.png') || previewDoc.name.endsWith('.jpg') ? (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.name}
                    className="max-h-[60vh] max-w-full rounded-xl object-contain border border-[#24423C]"
                  />
                ) : (
                  <iframe
                    src={previewDoc.url}
                    title={previewDoc.name}
                    className="w-full h-[60vh] rounded-xl border border-[#24423C]"
                  />
                )}
              </div>

              <div className="p-3 border-t border-[#24423C] bg-[#142421] flex justify-between items-center text-xs">
                <span className="text-[#A0A8A5] font-mono text-[11px]">Protected Document Preview</span>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#B7E36A] text-[#182D2A] font-bold text-xs cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
