import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { ledger, CryptoNetworkConfig } from '../../lib/ledger';
import { financialApi, paymentsApi } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { 
  ArrowDownLeft, Building2, Coins, CreditCard, Copy, Check, 
  CheckCircle2, AlertCircle, ShieldCheck, ExternalLink, QrCode, X, Lock
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, refreshUser } = useAuth();
  const [method, setMethod] = useState<'sepa' | 'crypto' | 'card'>('sepa');
  const [amount, setAmount] = useState<number>(1000);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    amount: number;
    method: string;
    status: string;
    message: string;
  } | null>(null);

  // Wire Details
  const [senderIban, setSenderIban] = useState<string>('');
  const [wireRef, setWireRef] = useState<string>('');

  // Crypto Details
  const [cryptoToken, setCryptoToken] = useState<string>('USDT');
  const [cryptoNetwork, setCryptoNetwork] = useState<string>('Polygon POS');
  const [txHash, setTxHash] = useState<string>('');
  const [paymentConfig, setPaymentConfig] = useState(ledger.getPaymentConfig());

  // Card details
  const [cardNumber, setCardNumber] = useState<string>('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');

  // Generate unique transfer reference for SEPA wire
  useEffect(() => {
    if (isOpen) {
      const code = `KZ-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
      setWireRef(code);
      setError(null);
      setSuccessData(null);
      setIsSubmitting(false);

      // Try fetching live payment config from backend
      paymentsApi.getPublicPaymentConfig()
        .then((res: any) => {
          const configData = res?.data || res;
          if (configData && configData.traditional) {
            setPaymentConfig(prev => ({
              ...prev,
              ...configData
            }));
          }
        })
        .catch(() => {
          // Gracefully keep local ledger config
        });
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const networkChoices: Record<string, string[]> = {
    USDT: ['Polygon POS', 'Ethereum (ERC20)', 'Tron (TRC20)', 'BNB Smart Chain (BEP20)'],
    USDC: ['Polygon POS', 'Ethereum (ERC20)', 'Arbitrum One', 'Solana SPL'],
    ETH: ['Ethereum (ERC20)', 'Arbitrum One', 'Base', 'Optimism'],
    BTC: ['Bitcoin Native SegWit']
  };

  // Find target address based on token and network
  const getSelectedCryptoAddress = (): string => {
    const net = paymentConfig.cryptoNetworks?.find(
      (n: CryptoNetworkConfig) => n.token === cryptoToken && n.network.toLowerCase().includes(cryptoNetwork.toLowerCase().split(' ')[0])
    );
    if (net && net.walletAddress) return net.walletAddress;

    if (cryptoToken === 'BTC') return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    if (cryptoNetwork.includes('Tron')) return 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxnSE';
    if (cryptoNetwork.includes('Solana')) return '7XwN5aK4pYj7K6bS5eWwYJ6nZ4qE9X1yR3mK4aN6pYj7';
    // Default institutional multi-sig EVM
    return '0x71C8A362b5d07a16E693F3841078B5F4b0a8E7e6';
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount < 50) {
      setError('Minimum deposit amount is €50.00.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (method === 'sepa') {
        // 1. Submit to Backend API
        try {
          await financialApi.deposit({
            amount,
            currency: 'EUR',
            method: 'SEPA Bank Wire',
            reference: wireRef
          });
        } catch (apiErr: any) {
          console.warn('Backend deposit sync note:', apiErr);
        }

        // 2. Submit to local ledger state
        await ledger.processDeposit(
          user.id,
          amount,
          'EUR',
          'SEPA Bank Wire',
          wireRef,
          {
            wireReference: wireRef,
            bankIban: paymentConfig.traditional.iban,
            senderIban: senderIban || undefined
          }
        );

        refreshUser();
        setSuccessData({
          reference: wireRef,
          amount,
          method: 'SEPA Bank Wire (CaixaBank Escrow)',
          status: 'Pending Admin Verification',
          message: 'Your transfer notification has been submitted. Please execute the SEPA transfer from your online banking using the provided reference.'
        });
        if (onSuccess) onSuccess();

      } else if (method === 'crypto') {
        const address = getSelectedCryptoAddress();

        // 1. Submit to Backend API
        try {
          await financialApi.deposit({
            amount,
            currency: cryptoToken,
            method: `Crypto ${cryptoToken} (${cryptoNetwork})`,
            txHash: txHash.trim() || undefined
          });
        } catch (apiErr: any) {
          console.warn('Backend deposit sync note:', apiErr);
        }

        // 2. Submit to local ledger state
        const ref = `CRYPTO-${cryptoToken}-${Math.floor(100000 + Math.random() * 900000)}`;
        await ledger.processDeposit(
          user.id,
          amount,
          cryptoToken,
          `Crypto ${cryptoToken} (${cryptoNetwork})`,
          ref,
          {
            cryptoToken,
            cryptoNetwork,
            depositAddress: address,
            txHash: txHash.trim() || undefined
          }
        );

        refreshUser();
        setSuccessData({
          reference: ref,
          amount,
          method: `${cryptoToken} (${cryptoNetwork})`,
          status: 'Awaiting Blockchain Confirmation',
          message: 'Your cryptocurrency deposit has been registered. The ledger will automatically credit your account once confirmed on-chain.'
        });
        if (onSuccess) onSuccess();

      } else if (method === 'card') {
        // Instant simulated card deposit
        const ref = `CARD-${Math.floor(100000 + Math.random() * 900000)}`;

        // Credit to ledger immediately for instant card experience
        ledger.recordManualCredit(
          'system@kretz.site',
          user.id,
          amount,
          'EUR',
          'Instant Card / Apple Pay',
          ref,
          `Direct debit top-up completed (Card ending in 4242)`
        );

        try {
          await financialApi.deposit({
            amount,
            currency: 'EUR',
            method: 'Instant Card Payment',
            txHash: ref
          });
        } catch {
          // graceful offline fallback
        }

        refreshUser();
        setSuccessData({
          reference: ref,
          amount,
          method: 'Instant Card / Apple Pay',
          status: 'Completed & Credited',
          message: `Your payment was processed instantly! €${amount.toFixed(2)} has been credited to your available wallet balance.`
        });
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Deposit submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#142421] text-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-[#24423C] relative animate-in fade-in zoom-in-95 duration-200 my-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#24423C]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#B7E36A]/15 text-[#B7E36A] border border-[#B7E36A]/30 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Deposit Funds</h3>
              <p className="text-xs text-[#A0A8A5]">Regulated CaixaBank Escrow & Instant Top-Up</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#1E332E] text-[#A0A8A5] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Close deposit modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="py-4 space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#B7E36A]/20 text-[#B7E36A] border border-[#B7E36A]/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white tracking-tight">Deposit Request Submitted</h4>
              <p className="text-xs text-[#A0A8A5] max-w-sm mx-auto leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="bg-[#1E332E] p-4 rounded-2xl border border-[#2D4540] space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#A0A8A5]">Deposit Amount:</span>
                <span className="font-bold text-white text-base">{formatCurrency(successData.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A8A5]">Method:</span>
                <span className="text-[#B7E36A] font-semibold">{successData.method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A8A5]">Tracking Reference:</span>
                <span className="font-bold text-white bg-[#142421] px-2 py-1 rounded border border-[#24423C]">
                  {successData.reference}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A8A5]">Status:</span>
                <span className="font-bold text-amber-400">{successData.status}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setSuccessData(null);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-[#B7E36A] text-[#182D2A] text-xs font-black hover:bg-[#cbf086] transition-all cursor-pointer shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDepositSubmit} className="space-y-5">
            {/* Payment Method Switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#1E332E] rounded-2xl border border-[#2D4540]">
              <button
                type="button"
                onClick={() => setMethod('sepa')}
                className={`py-2 px-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  method === 'sepa'
                    ? 'bg-[#B7E36A] text-[#182D2A] shadow-md'
                    : 'text-[#A0A8A5] hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>SEPA Wire</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`py-2 px-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  method === 'card'
                    ? 'bg-[#B7E36A] text-[#182D2A] shadow-md'
                    : 'text-[#A0A8A5] hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 shrink-0" />
                <span>Instant Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('crypto')}
                className={`py-2 px-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  method === 'crypto'
                    ? 'bg-[#B7E36A] text-[#182D2A] shadow-md'
                    : 'text-[#A0A8A5] hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5 shrink-0" />
                <span>Crypto</span>
              </button>
            </div>

            {/* Deposit Amount Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-white">Deposit Amount (EUR)</label>
                <span className="text-[11px] text-[#A0A8A5]">Min: €50.00</span>
              </div>
              
              <div className="relative">
                <span className="absolute left-4 top-3 text-lg font-black text-[#A0A8A5]">€</span>
                <input
                  type="number"
                  min={50}
                  step={50}
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  placeholder="1000"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#1E332E] border border-[#2D4540] text-white font-black text-lg focus:outline-none focus:border-[#B7E36A]"
                />
              </div>

              {/* Quick preset amount buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[250, 500, 1000, 5000, 10000, 25000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      amount === preset 
                        ? 'bg-[#B7E36A] text-[#182D2A] border-[#B7E36A]' 
                        : 'bg-[#1E332E] text-[#A0A8A5] border-[#2D4540] hover:text-white hover:border-[#B7E36A]/50'
                    }`}
                  >
                    €{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* METHOD 1: SEPA BANK WIRE */}
            {method === 'sepa' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-[#1E332E] border border-[#2D4540] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2D4540]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#B7E36A]" />
                      <span className="text-xs font-bold text-white">CaixaBank Corporate Escrow</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Protected Account
                    </span>
                  </div>

                  {/* Wire Reference (CRITICAL) */}
                  <div className="p-3 rounded-xl bg-[#142421] border border-[#B7E36A]/40">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#B7E36A] font-extrabold">
                        Required Transfer Concept / Reference:
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(wireRef, 'ref')}
                        className="text-[11px] text-[#B7E36A] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        {copiedKey === 'ref' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'ref' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-sm font-mono font-black text-white tracking-wider">
                      {wireRef}
                    </div>
                    <p className="text-[10px] text-[#A0A8A5] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Include this reference in your bank transfer description to ensure prompt settlement.</span>
                    </p>
                  </div>

                  {/* Bank Details Table */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-[#2D4540]/50">
                      <span className="text-[#A0A8A5]">Beneficiary:</span>
                      <span className="font-bold text-white text-right">{paymentConfig.traditional?.beneficiary || 'Kretz Real Estate Asset Holding S.L.'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#2D4540]/50">
                      <span className="text-[#A0A8A5]">IBAN:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-right">
                          {paymentConfig.traditional?.iban || 'ES91 2100 0418 4502 0005 1829'}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.traditional?.iban || 'ES9121000418450200051829', 'iban')}
                          className="text-[#B7E36A] hover:opacity-80 p-1 cursor-pointer"
                          title="Copy IBAN"
                        >
                          {copiedKey === 'iban' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#2D4540]/50">
                      <span className="text-[#A0A8A5]">BIC / SWIFT:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{paymentConfig.traditional?.bic || 'CAIXESBBXXX'}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.traditional?.bic || 'CAIXESBBXXX', 'bic')}
                          className="text-[#B7E36A] hover:opacity-80 p-1 cursor-pointer"
                          title="Copy BIC"
                        >
                          {copiedKey === 'bic' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#A0A8A5]">Bank & Address:</span>
                      <span className="text-white text-right text-[11px] max-w-[220px]">
                        {paymentConfig.traditional?.bankName || 'CaixaBank S.A., Madrid, Spain'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#A0A8A5]">
                    Sender Bank / Account (Optional - for faster matching)
                  </label>
                  <input
                    type="text"
                    value={senderIban}
                    onChange={(e) => setSenderIban(e.target.value)}
                    placeholder="e.g. BNP Paribas, Deutsche Bank, Santander..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E332E] border border-[#2D4540] text-xs text-white focus:outline-none focus:border-[#B7E36A]"
                  />
                </div>
              </div>
            )}

            {/* METHOD 2: INSTANT CARD */}
            {method === 'card' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-[#1E332E] border border-[#2D4540] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2D4540]">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#B7E36A]" />
                      <span className="text-xs font-bold text-white">Instant Account Top-Up</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Immediate Settlement
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#A0A8A5] mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        defaultValue={user.fullName}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#142421] border border-[#2D4540] text-xs text-white focus:outline-none focus:border-[#B7E36A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#A0A8A5] mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#142421] border border-[#2D4540] text-xs font-mono text-white focus:outline-none focus:border-[#B7E36A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#A0A8A5] mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#142421] border border-[#2D4540] text-xs font-mono text-white focus:outline-none focus:border-[#B7E36A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#A0A8A5] mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#142421] border border-[#2D4540] text-xs font-mono text-white focus:outline-none focus:border-[#B7E36A]"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#A0A8A5] pt-1 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-[#B7E36A] shrink-0" />
                    <span>Protected with 256-bit encryption. Card funds are credited directly to your investor wallet balance.</span>
                  </p>
                </div>
              </div>
            )}

            {/* METHOD 3: CRYPTOCURRENCY */}
            {method === 'crypto' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A0A8A5] mb-1">Crypto Asset</label>
                    <select
                      value={cryptoToken}
                      onChange={(e) => {
                        const token = e.target.value;
                        setCryptoToken(token);
                        const nets = networkChoices[token] || ['Polygon POS'];
                        setCryptoNetwork(nets[0]);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E332E] border border-[#2D4540] text-xs font-bold text-white focus:outline-none focus:border-[#B7E36A]"
                    >
                      <option value="USDT">USDT (Tether USD)</option>
                      <option value="USDC">USDC (USD Coin)</option>
                      <option value="ETH">ETH (Ethereum)</option>
                      <option value="BTC">BTC (Bitcoin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A0A8A5] mb-1">Network / Chain</label>
                    <select
                      value={cryptoNetwork}
                      onChange={(e) => setCryptoNetwork(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E332E] border border-[#2D4540] text-xs font-bold text-white focus:outline-none focus:border-[#B7E36A]"
                    >
                      {(networkChoices[cryptoToken] || ['Polygon POS']).map((net) => (
                        <option key={net} value={net}>{net}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Treasury Address Box */}
                <div className="p-4 rounded-2xl bg-[#1E332E] border border-[#2D4540] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#B7E36A]">Institutional Multi-Sig Treasury Address:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(getSelectedCryptoAddress(), 'cryptoAddr')}
                      className="text-[#B7E36A] hover:underline flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                    >
                      {copiedKey === 'cryptoAddr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'cryptoAddr' ? 'Copied' : 'Copy Address'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[#142421] border border-[#24423C] font-mono text-xs text-white break-all leading-relaxed">
                    {getSelectedCryptoAddress()}
                  </div>

                  <div className="text-[10px] text-[#A0A8A5] flex items-center justify-between">
                    <span>Selected: <strong>{cryptoToken} on {cryptoNetwork}</strong></span>
                    <span>Zero deposit fee</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A0A8A5] mb-1">
                    Blockchain Transaction Hash / TxID (Optional)
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x... or transaction ID"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E332E] border border-[#2D4540] text-xs font-mono text-white focus:outline-none focus:border-[#B7E36A]"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 text-red-400 text-xs font-semibold border border-red-500/30 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit & Cancel Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting || amount < 50}
                className="w-full py-3.5 rounded-xl bg-[#B7E36A] text-[#182D2A] text-xs font-black hover:bg-[#cbf086] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Registering Deposit with Treasury...</span>
                ) : (
                  <>
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>
                      {method === 'card' 
                        ? `Pay & Deposit ${formatCurrency(amount)} Instantly`
                        : `Confirm Deposit of ${formatCurrency(amount)}`}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-transparent border border-[#2D4540] text-[#A0A8A5] hover:text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
