import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { ledger } from '../../lib/ledger';
import { KYCStatus } from '../../types/user';
import { ShieldCheck, User as UserIcon, Building2, UploadCloud, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [docType, setDocType] = useState('Passport');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user) return null;

  const handleKYCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      ledger.updateKYCStatus(user.id, 'pending', docType);
      refreshUser();
      setIsSubmitting(false);
      setMessage('Identity document submitted! It is now pending administrative compliance review.');
    }, 600);
  };

  const handleSimulateInstantVerify = () => {
    ledger.updateKYCStatus(user.id, 'verified', 'Passport');
    refreshUser();
    setMessage('KYC instantly verified for testing!');
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
    <div className="bg-[#F6F7F4] min-h-screen py-10">
      <div className="container max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-black text-[#18211F]">Account & Verification</h1>
          <p className="text-xs text-[#69736F]">
            Manage your personal investor profile, compliance status, and security preferences.
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-green-50 text-green-800 text-xs font-bold border border-green-200">
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white p-7 rounded-3xl border border-[#E3E8E3] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E8E3]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#182D2A] text-[#B7E36A] flex items-center justify-center font-bold text-lg overflow-hidden shadow-sm">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user.fullName.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#18211F]">{user.fullName}</h2>
                <span className="text-xs text-[#69736F]">{user.email}</span>
                <div className="mt-2">{renderKYCBadge(user.kycStatus)}</div>
              </div>
            </div>

            {user.kycStatus !== 'verified' && (
              <button
                onClick={handleSimulateInstantVerify}
                className="btn btn-secondary btn-sm text-xs font-bold text-[#27845D] border-[#27845D]/40 hover:bg-green-50"
              >
                Instant Verify (Demo Mode)
              </button>
            )}
          </div>

          {/* Dedicated Image Uploader Component */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-[#18211F] mb-3">Custom Profile Photo</h3>
            <ImageUploader
              currentAvatarUrl={user.avatarUrl}
              userName={user.fullName}
              onUpload={handleAvatarUpload}
              onRemove={handleAvatarRemove}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F6F7F4] border border-[#E3E8E3]">
              <span className="text-[#69736F] block mb-0.5">Investor ID</span>
              <span className="font-mono font-bold text-[#182D2A]">{user.id}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F7F4] border border-[#E3E8E3]">
              <span className="text-[#69736F] block mb-0.5">User Role</span>
              <span className="font-bold text-[#182D2A] uppercase">{user.role}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F7F4] border border-[#E3E8E3]">
              <span className="text-[#69736F] block mb-0.5">Assigned Crypto Deposit Address</span>
              <span className="font-mono font-bold text-[#182D2A] break-all">{user.cryptoDepositAddress}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F7F4] border border-[#E3E8E3]">
              <span className="text-[#69736F] block mb-0.5">Account Registered Since</span>
              <span className="font-bold text-[#182D2A]">
                {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* KYC Submission Section if not verified */}
        {user.kycStatus !== 'verified' && (
          <div className="bg-white p-7 rounded-3xl border border-[#E3E8E3] shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF1EC] text-[#27845D] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#18211F]">Submit Identity Verification (KYC)</h3>
                <p className="text-xs text-[#69736F]">
                  Required by European AML Directive 2018/843 to unlock unlimited property investing and withdrawals.
                </p>
              </div>
            </div>

            <form onSubmit={handleKYCSubmit} className="space-y-4">
              <div className="form-field">
                <label>Document Type</label>
                <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="Passport">International Passport</option>
                  <option value="National Identity Card">European National Identity Card (DNI / NIE)</option>
                  <option value="Driver's License">Driver's License</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-[#E3E8E3] rounded-2xl p-8 text-center bg-[#F6F7F4] space-y-2">
                <UploadCloud className="w-8 h-8 text-[#69736F] mx-auto" />
                <p className="text-xs font-bold text-[#18211F]">Upload Official Document Scan / Photo</p>
                <p className="text-[11px] text-[#828D89]">
                  Supported formats: PDF, JPG, PNG (Max 15MB). Both front and back sides required for ID cards.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary text-xs font-bold px-8"
              >
                {isSubmitting ? 'Uploading to Compliance Encrypted Vault...' : 'Submit Document for Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
