import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { ledger } from '../../lib/ledger';
import { formatCurrency, formatDate, formatShortHash } from '../../lib/utils';
import { Property, PropertyType, PropertyStatus } from '../../types/property';
import {
  Shield,
  Plus,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  ClipboardList,
  RefreshCw,
  Coins
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8 bg-[#F6F7F4]">
        <div className="w-8 h-8 border-3 border-[#182D2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'kyc' | 'properties' | 'audit' | 'payment-settings'>('deposits');
  const [transactions, setTransactions] = useState(ledger.getTransactions());
  const [properties, setProperties] = useState(ledger.getProperties());
  const [users, setUsers] = useState(ledger.getUsers());
  const [auditLogs, setAuditLogs] = useState(ledger.getAuditLogs());
  const [paymentConfig, setPaymentConfig] = useState(ledger.getPaymentConfig());
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Property Form State
  const [showNewPropertyModal, setShowNewPropertyModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<PropertyType>('Residential');
  const [newTarget, setNewTarget] = useState<number>(350000);
  const [newYield, setNewYield] = useState<number>(11.5);
  const [newAppreciation, setNewAppreciation] = useState<number>(4.0);
  const [newDuration, setNewDuration] = useState<number>(36);

  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
  const pendingKYCUsers = users.filter(u => u.kycStatus === 'pending');

  const refreshAll = () => {
    setTransactions(ledger.getTransactions());
    setProperties(ledger.getProperties());
    setUsers(ledger.getUsers());
    setAuditLogs(ledger.getAuditLogs());
    setPaymentConfig(ledger.getPaymentConfig());
  };

  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    ledger.updatePaymentConfig(paymentConfig);
    setActionSuccess('Payment gateway and crypto treasury wallet settings updated successfully!');
    refreshAll();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleReviewDeposit = async (txId: string, approved: boolean) => {
    try {
      await ledger.reviewDeposit(txId, approved, approved ? undefined : 'Bank transfer wire reference could not be verified in treasury feed.');
      setActionSuccess(`Deposit request ${approved ? 'approved and credited to wallet balance' : 'declined'}.`);
      refreshAll();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Action failed');
    }
  };

  const handleReviewWithdrawal = async (txId: string, approved: boolean) => {
    try {
      await ledger.reviewWithdrawal(txId, approved, approved ? undefined : 'Compliance review flagged incomplete banking documentation.');
      setActionSuccess(`Withdrawal ${approved ? 'approved and executed' : 'declined and refunded to user'}.`);
      refreshAll();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Action failed');
    }
  };

  const handleReviewKYC = (userId: string, approved: boolean) => {
    try {
      ledger.updateKYCStatus(userId, approved ? 'verified' : 'rejected');
      setActionSuccess(`User KYC ${approved ? 'verified' : 'rejected'}.`);
      refreshAll();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Action failed');
    }
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenPrice = 100;
    const totalTokens = Math.floor(newTarget / tokenPrice);
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const createdProp: Property = {
      id: 'prop-' + Math.random().toString(36).substring(2, 8),
      slug: slug,
      title: newTitle,
      location: newLocation,
      city: newLocation.split(',')[1]?.trim() || 'Madrid',
      country: 'Spain',
      type: newType,
      status: 'funding',
      images: ['/src/assets/images/prop_valencia_apt_1791998371242.jpg'],
      bannerImage: '/src/assets/images/prop_valencia_apt_1791998371242.jpg',
      targetAmount: newTarget,
      fundedAmount: 0,
      tokenPrice: tokenPrice,
      totalTokens: totalTokens,
      availableTokens: totalTokens,
      estimatedAnnualYield: newYield,
      capitalAppreciationYield: newAppreciation,
      totalEstimatedReturn: Number((newYield + newAppreciation).toFixed(1)),
      durationMonths: newDuration,
      minimumInvestment: 1000,
      distributionFrequency: 'Monthly',
      tokenTicker: 'RENT-' + newTitle.substring(0, 3).toUpperCase(),
      blockchainNetwork: 'Polygon POS',
      tokenContractAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      description: `Newly published institutional real estate offering located in ${newLocation}. Fully structured through a dedicated SPV with conservative yield projections.`,
      investmentStructure: 'Participatory SPV Note with certified mortgage deed and ring-fenced legal assets.',
      highlights: [
        'Vetted architectural asset with high rental demand',
        'Independent appraisal and structural review verified',
        'Fixed participatory tokenization contract'
      ],
      risks: ['General property market cycles', 'Tenancy vacancy during turnover'],
      exitStrategy: 'Sale to institutional fund upon duration completion.',
      feeStructure: {
        structuringFee: '3.5% (Pre-funded in target capital)',
        managementFee: '10.0% of gross monthly rental income',
        withdrawalFee: '0% for SEPA transfers',
        exitFee: '0% at maturity'
      },
      paymentSchedule: {
        distributionFrequency: 'Monthly',
        payoutDate: '1st of every calendar month',
        annualReconciliation: 'Annual audit statement issued in February',
        maturityTerms: '100% Principal + capital gains distributed upon terminal asset sale'
      },
      financialBreakdown: {
        propertyPrice: Math.round(newTarget * 0.78),
        refurbishmentBudget: Math.round(newTarget * 0.12),
        legalAndClosingCosts: Math.round(newTarget * 0.06),
        operatingReserve: Math.round(newTarget * 0.04),
        totalProjectCost: newTarget,
        projectedAnnualGrossRent: Math.round(newTarget * (newYield / 100) * 1.25),
        estimatedOperatingExpenses: Math.round(newTarget * (newYield / 100) * 0.25),
        projectedAnnualNetRent: Math.round(newTarget * (newYield / 100)),
        estimatedNetYield: newYield,
        estimatedCapitalGainYield: newAppreciation,
        totalEstimatedYield: Number((newYield + newAppreciation).toFixed(1))
      },
      documents: [
        {
          id: 'doc-new1',
          name: 'SPV Deed & Constitutional By-laws',
          category: 'Legal',
          size: '2.1 MB',
          url: '#',
          updatedAt: new Date().toISOString().split('T')[0]
        }
      ],
      investorCount: 0,
      createdAt: new Date().toISOString(),
      isSampleRecord: true
    };

    ledger.saveProperty(createdProp);
    refreshAll();
    setShowNewPropertyModal(false);
    setActionSuccess(`New property "${newTitle}" created and opened for public funding!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleTogglePropertyStatus = (prop: Property) => {
    const nextStatus: PropertyStatus = prop.status === 'funding' ? 'funded' : prop.status === 'funded' ? 'upcoming' : 'funding';
    const updated = { ...prop, status: nextStatus };
    ledger.saveProperty(updated);
    refreshAll();
  };

  return (
    <div className="bg-[#F6F7F4] min-h-screen py-10">
      <div className="container">
        {/* Header */}
        <div className="bg-[#182D2A] text-white p-7 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#24423C] text-[#B7E36A] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Platform Administration</h1>
                <span className="bg-[#24423C] text-[#B7E36A] text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-[#A0A8A5]">
                Manage asset offerings, compliance reviews, and financial ledger risk checks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewPropertyModal(true)}
              className="btn btn-accent text-xs font-bold px-5"
            >
              <Plus className="w-4 h-4 mr-1" />
              Publish New Property
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-4 mb-6 rounded-2xl bg-green-50 text-green-800 text-xs font-bold border border-green-200 flex items-center justify-between">
            <span>{actionSuccess}</span>
            <button onClick={() => setActionSuccess(null)} className="text-gray-500">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E3E8E3] mb-8 gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'deposits' ? 'border-[#182D2A] text-[#182D2A]' : 'border-transparent text-[#69736F]'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Deposit Approvals ({pendingDeposits.length})
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'withdrawals' ? 'border-[#182D2A] text-[#182D2A]' : 'border-transparent text-[#69736F]'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdrawal Approvals ({pendingWithdrawals.length})
          </button>

          <button
            onClick={() => setActiveTab('kyc')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kyc' ? 'border-[#182D2A] text-[#182D2A]' : 'border-transparent text-[#69736F]'
            }`}
          >
            <Users className="w-4 h-4" />
            KYC Identity Queue ({pendingKYCUsers.length})
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'properties' ? 'border-[#182D2A] text-[#182D2A]' : 'border-transparent text-[#69736F]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Manage Properties ({properties.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit' ? 'border-[#182D2A] text-[#182D2A]' : 'border-transparent text-[#69736F]'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Ledger Audit Logs
          </button>

          <button
            onClick={() => setActiveTab('payment-settings')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'payment-settings' ? 'border-[#182D2A] text-[#182D2A]' : 'border-transparent text-[#69736F]'
            }`}
          >
            <Coins className="w-4 h-4" />
            Payment Settings & Wallets
          </button>
        </div>

        {/* Tab 0: Deposit Approvals */}
        {activeTab === 'deposits' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E3E8E3] shadow-sm">
            <h3 className="text-lg font-bold text-[#18211F] mb-4">Pending Investor Deposits (Awaiting Treasury Confirmation)</h3>
            {pendingDeposits.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#69736F]">
                No pending deposit requests requiring admin confirmation.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDeposits.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-[#F6F7F4] border border-[#E3E8E3] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#27845D] uppercase tracking-wider">
                          Deposit Wire / Crypto
                        </span>
                        <span className="font-mono text-xs text-[#69736F]">{tx.reference}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-[#18211F]">
                        {formatCurrency(tx.amount)} ({tx.currency})
                      </h4>
                      <p className="text-xs text-[#69736F]">
                        Method: <strong>{tx.paymentMethod}</strong>
                      </p>
                      <span className="text-[11px] text-[#828D89]">Requested: {formatDate(tx.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReviewDeposit(tx.id, true)}
                        className="btn btn-primary text-xs font-bold px-4 py-2 bg-[#27845D] hover:bg-[#1f6b4a]"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve & Credit
                      </button>
                      <button
                        onClick={() => handleReviewDeposit(tx.id, false)}
                        className="btn btn-secondary text-xs font-bold px-4 py-2 text-[#C24141] border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1.5" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Withdrawal Approvals */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E3E8E3] shadow-sm">
            <h3 className="text-lg font-bold text-[#18211F] mb-4">Pending Bank & Crypto Withdrawals</h3>
            {pendingWithdrawals.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#69736F]">
                No pending withdrawals requiring approval.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingWithdrawals.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-[#F6F7F4] border border-[#E3E8E3] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#C24141] uppercase tracking-wider">
                          Withdrawal Request
                        </span>
                        <span className="font-mono text-xs text-[#69736F]">{tx.reference}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-[#18211F]">
                        {formatCurrency(tx.amount)}
                      </h4>
                      <p className="text-xs text-[#69736F]">
                        Destination: <strong>{tx.metadata?.bankIban || tx.metadata?.destinationAddress || 'Bank Wire'}</strong>
                      </p>
                      <span className="text-[11px] text-[#828D89]">Requested: {formatDate(tx.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReviewWithdrawal(tx.id, true)}
                        className="btn btn-primary btn-sm bg-[#27845D] hover:bg-[#1f6b4a] text-xs font-bold text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Approve & Execute SEPA
                      </button>
                      <button
                        onClick={() => handleReviewWithdrawal(tx.id, false)}
                        className="btn btn-secondary btn-sm text-xs font-bold text-[#C24141] hover:bg-red-50"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Decline & Refund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: KYC Reviews */}
        {activeTab === 'kyc' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E3E8E3] shadow-sm">
            <h3 className="text-lg font-bold text-[#18211F] mb-4">Investor Identity Verifications (AML5/6)</h3>
            {pendingKYCUsers.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#69736F]">
                All registered investors have been reviewed. No pending KYC submissions.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingKYCUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl bg-[#F6F7F4] border border-[#E3E8E3] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#18211F]">{u.fullName}</h4>
                      <p className="text-xs text-[#69736F]">{u.email} · {u.country || 'Spain'}</p>
                      <span className="text-[11px] text-[#27845D] font-semibold block mt-1">
                        Submitted: {u.kycSubmittedAt ? formatDate(u.kycSubmittedAt) : 'Recently'} · Doc: {u.kycDocumentType || 'Passport'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewKYC(u.id, true)}
                        className="btn btn-primary btn-sm bg-[#27845D] text-xs font-bold"
                      >
                        Approve Verification
                      </button>
                      <button
                        onClick={() => handleReviewKYC(u.id, false)}
                        className="btn btn-secondary btn-sm text-xs font-bold text-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Manage Properties */}
        {activeTab === 'properties' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E3E8E3] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#18211F]">Property Offerings Portfolio</h3>
              <button
                onClick={() => setShowNewPropertyModal(true)}
                className="btn btn-primary btn-sm text-xs font-bold"
              >
                + Add Property
              </button>
            </div>

            <div className="divide-y divide-[#E3E8E3]">
              {properties.map((p) => (
                <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={p.images[0] || p.bannerImage} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#18211F]">{p.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#69736F]">
                        <span>{p.location}</span>
                        <span>·</span>
                        <span className="font-semibold text-[#27845D]">{p.estimatedAnnualYield}% Yield</span>
                        <span>·</span>
                        <span>Target: {formatCurrency(p.targetAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`status-badge ${p.status} text-xs font-bold`}>
                      {p.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleTogglePropertyStatus(p)}
                      className="btn btn-secondary btn-sm text-xs font-semibold"
                    >
                      Cycle Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E3E8E3] shadow-sm">
            <h3 className="text-lg font-bold text-[#18211F] mb-4">Financial Ledger & Administrative Audit Trail</h3>
            <div className="divide-y divide-[#E3E8E3] max-h-96 overflow-y-auto font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-[#182D2A] mr-2">[{log.action}]</span>
                    <span className="text-[#69736F]">{log.details}</span>
                  </div>
                  <div className="text-[11px] text-[#828D89] whitespace-nowrap">
                    {formatDate(log.timestamp)} · Admin: {log.adminEmail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Payment Settings & Wallets */}
        {activeTab === 'payment-settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3E8E3] shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#E3E8E3] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#18211F]">Dual Payment Architecture & Treasury Configuration</h3>
                <p className="text-xs text-[#69736F]">Configure traditional bank transfer wire accounts and multi-chain cryptocurrency wallet addresses.</p>
              </div>
            </div>

            <form onSubmit={handleSavePaymentConfig} className="space-y-6">
              {/* Traditional Bank Transfer Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#182D2A] uppercase tracking-wider">Traditional Bank Transfer (SEPA / Wire)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label>Bank Name / Institution</label>
                    <input
                      type="text"
                      value={paymentConfig.traditional.bankName}
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig,
                        traditional: { ...paymentConfig.traditional, bankName: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Beneficiary Name</label>
                    <input
                      type="text"
                      value={paymentConfig.traditional.beneficiary}
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig,
                        traditional: { ...paymentConfig.traditional, beneficiary: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>IBAN Account</label>
                    <input
                      type="text"
                      value={paymentConfig.traditional.iban}
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig,
                        traditional: { ...paymentConfig.traditional, iban: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>BIC / SWIFT</label>
                    <input
                      type="text"
                      value={paymentConfig.traditional.bic}
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig,
                        traditional: { ...paymentConfig.traditional, bic: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Support Email for Receipts</label>
                    <input
                      type="email"
                      value={paymentConfig.traditional.supportEmail}
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig,
                        traditional: { ...paymentConfig.traditional, supportEmail: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="form-field md:col-span-2">
                    <label>Transfer Instructions</label>
                    <textarea
                      rows={2}
                      value={paymentConfig.traditional.instructions}
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig,
                        traditional: { ...paymentConfig.traditional, instructions: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Crypto Wallet & Networks Settings */}
              <div className="space-y-4 pt-4 border-t border-[#E3E8E3]">
                <h4 className="text-sm font-bold text-[#182D2A] uppercase tracking-wider">Cryptocurrency Treasury Wallets & Networks</h4>
                <div className="space-y-4">
                  {paymentConfig.cryptoNetworks.map((net, index) => (
                    <div key={net.id} className="p-4 rounded-2xl bg-[#F6F7F4] border border-[#E3E8E3] grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="text-[11px] font-bold text-[#69736F] block">Network Name</label>
                        <input
                          type="text"
                          value={net.name}
                          onChange={(e) => {
                            const updated = [...paymentConfig.cryptoNetworks];
                            updated[index].name = e.target.value;
                            setPaymentConfig({ ...paymentConfig, cryptoNetworks: updated });
                          }}
                          className="text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#69736F] block">Supported Asset</label>
                        <input
                          type="text"
                          value={net.token}
                          onChange={(e) => {
                            const updated = [...paymentConfig.cryptoNetworks];
                            updated[index].token = e.target.value;
                            setPaymentConfig({ ...paymentConfig, cryptoNetworks: updated });
                          }}
                          className="text-xs font-bold"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-bold text-[#69736F] block">Insured Treasury Wallet Address</label>
                        <input
                          type="text"
                          value={net.walletAddress}
                          onChange={(e) => {
                            const updated = [...paymentConfig.cryptoNetworks];
                            updated[index].walletAddress = e.target.value;
                            setPaymentConfig({ ...paymentConfig, cryptoNetworks: updated });
                          }}
                          className="text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="btn btn-primary text-xs font-bold px-8 py-3">
                  Save Payment Configuration & Treasury Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* New Property Modal */}
      {showNewPropertyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E3E8E3] relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#18211F]">Publish New Real Estate Asset</h3>
              <button onClick={() => setShowNewPropertyModal(false)} className="text-gray-400 hover:text-black text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div className="form-field">
                <label>Property Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barcelona Eixample Boutique Apartments"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Address & City</label>
                <input
                  type="text"
                  required
                  placeholder="Carrer de Mallorca 112, Barcelona, Spain"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-field">
                  <label>Asset Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as PropertyType)}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Coliving">Coliving Hub</option>
                    <option value="Vacation Rental">Vacation Rental</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Target Funding (EUR)</label>
                  <input
                    type="number"
                    min={50000}
                    step={10000}
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="form-field">
                  <label>Est. Net Yield (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={newYield}
                    onChange={(e) => setNewYield(Number(e.target.value))}
                  />
                </div>
                <div className="form-field">
                  <label>Capital Gain (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={newAppreciation}
                    onChange={(e) => setNewAppreciation(Number(e.target.value))}
                  />
                </div>
                <div className="form-field">
                  <label>Duration (Mo)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="btn btn-primary flex-1 text-xs font-bold">
                  Publish Property to Marketplace
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPropertyModal(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
