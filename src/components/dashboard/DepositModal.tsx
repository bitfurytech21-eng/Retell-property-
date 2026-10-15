import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { ledger } from '../../lib/ledger';
import { formatCurrency } from '../../lib/utils';
import { Copy, Check, QrCode, ArrowDownLeft, ShieldCheck, CheckCircle2, ChevronDown, Building2, Coins, ArrowLeft, ExternalLink } from 'lucide-react';
import { TokenSymbolIcon, NetworkBadgeIcon } from '../common/TokenSymbolIcon';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, refreshUser } = useAuth();

  // Selected coin & network states matching user interface
  const [method, setMethod] = useState<'crypto' | 'sepa'>('crypto');
  const [selectedCoin, setSelectedCoin] = useState<string>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Tron (TRC20)');
  const [isQrGenerated, setIsQrGenerated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(500);
  const [txHashInput, setTxHashInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState<boolean>(false);

  // CRITICAL: Prevent modal from rendering or covering dashboard when closed
  if (!isOpen || !user) {
    return null;
  }

  const paymentConfig = ledger.getPaymentConfig();

  // Expanded major blockchain coins with authentic profile photos / symbols
  const baseCoins = [
    { symbol: 'USDT', name: 'Tether USD', color: '#26a17b' },
    { symbol: 'USDC', name: 'USD Coin', color: '#2775ca' },
    { symbol: 'BTC', name: 'Bitcoin', color: '#f7931a' },
    { symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
    { symbol: 'SOL', name: 'Solana', color: '#14f195' },
    { symbol: 'BNB', name: 'BNB Chain', color: '#f3ba2f' },
    { symbol: 'XRP', name: 'Ripple', color: '#23292f' },
    { symbol: 'POL', name: 'Polygon', color: '#8247e5' },
    { symbol: 'AVAX', name: 'Avalanche', color: '#e84142' },
    { symbol: 'TON', name: 'Toncoin', color: '#0098ea' },
    { symbol: 'TRX', name: 'TRON', color: '#ef0027' },
    { symbol: 'ADA', name: 'Cardano', color: '#0033ad' }
  ];

  const adminTokens = paymentConfig.cryptoNetworks
    .filter(n => n.enabled !== false)
    .flatMap(n => n.token.split('/').map(t => t.trim().toUpperCase()));
  const allSymbols = Array.from(new Set([...baseCoins.map(c => c.symbol), ...adminTokens]));
  const coins = allSymbols.map(sym => {
    const existing = baseCoins.find(c => c.symbol === sym);
    return existing || { symbol: sym, name: sym, color: '#10B981' };
  });

  // Calculate dynamic networks for selected coin from admin paymentConfig
  const matchingNetworksFromConfig = paymentConfig.cryptoNetworks
    .filter(n => n.enabled !== false && n.token.toUpperCase().includes(selectedCoin.toUpperCase()))
    .map(n => n.name);

  // Expanded comprehensive networks for each token
  const fallbackNetworks: Record<string, string[]> = {
    USDT: [
      'Tron (TRC20)',
      'Ethereum (ERC20)',
      'Polygon POS',
      'BNB Smart Chain (BEP20)',
      'Arbitrum One',
      'Optimism (OP Mainnet)',
      'Solana SPL',
      'TON Network',
      'Avalanche C-Chain'
    ],
    USDC: [
      'Polygon POS',
      'Ethereum (ERC20)',
      'Arbitrum One',
      'Solana SPL',
      'Base Mainnet',
      'Optimism (OP Mainnet)',
      'BNB Smart Chain (BEP20)',
      'Avalanche C-Chain'
    ],
    ETH: [
      'Ethereum (ERC20)',
      'Arbitrum One',
      'Optimism (OP Mainnet)',
      'Base Mainnet',
      'Polygon POS (WETH)'
    ],
    BTC: [
      'Bitcoin Native SegWit (Bech32)',
      'Bitcoin Legacy (P2PKH)',
      'Bitcoin Taproot',
      'BNB Smart Chain (BEP20 - BTCB)'
    ],
    SOL: ['Solana SPL'],
    BNB: ['BNB Smart Chain (BEP20)', 'opBNB Mainnet'],
    XRP: ['Ripple XRP Ledger'],
    POL: ['Polygon POS (POL/MATIC)', 'Ethereum (ERC20)'],
    MATIC: ['Polygon POS (POL/MATIC)', 'Ethereum (ERC20)'],
    AVAX: ['Avalanche C-Chain'],
    TON: ['TON Network'],
    TRX: ['Tron (TRC20)'],
    ADA: ['Cardano Shelley']
  };

  const currentNetworks = matchingNetworksFromConfig.length > 0
    ? matchingNetworksFromConfig
    : (fallbackNetworks[selectedCoin] || ['Ethereum (ERC20)']);

  const matchingCurrentNet = paymentConfig.cryptoNetworks.find(
    net => net.enabled !== false &&
    net.name.toLowerCase() === selectedNetwork.toLowerCase() &&
    net.token.toUpperCase().includes(selectedCoin.toUpperCase())
  );
  const currentContract = matchingCurrentNet?.contractEnd || 'Verified';

  // Get deposit address dynamically based on admin configuration and selected network standard
  const getDepositAddress = (): string => {
    const matchingNet = paymentConfig.cryptoNetworks.find(
      net => net.enabled !== false &&
      net.name.toLowerCase() === selectedNetwork.toLowerCase() &&
      net.token.toUpperCase().includes(selectedCoin.toUpperCase())
    );
    if (matchingNet && matchingNet.walletAddress) {
      return matchingNet.walletAddress;
    }
    const fallbackNet = paymentConfig.cryptoNetworks.find(
      net => net.enabled !== false && net.name.toLowerCase() === selectedNetwork.toLowerCase()
    );
    if (fallbackNet && fallbackNet.walletAddress) {
      return fallbackNet.walletAddress;
    }
    if (selectedNetwork.includes('Tron') || selectedNetwork.includes('TRC20') || selectedCoin === 'TRX') {
      return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    }
    if (selectedNetwork.includes('Bitcoin') || selectedCoin === 'BTC') {
      if (selectedNetwork.includes('Legacy')) return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
      if (selectedNetwork.includes('Taproot')) return 'bc1p5d7rjq7g6rd22r3kyt5gt429z626498087qku5wqv30ng';
      return 'bc1q9x46w98m4p74j9s2w83e65x7k2c5v0l2n8j4';
    }
    if (selectedNetwork.includes('Solana') || selectedCoin === 'SOL') {
      return '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
    }
    if (selectedNetwork.includes('TON') || selectedCoin === 'TON') {
      return 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs';
    }
    if (selectedNetwork.includes('Ripple') || selectedCoin === 'XRP') {
      return 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh';
    }
    if (selectedNetwork.includes('Cardano') || selectedCoin === 'ADA') {
      return 'addr1q9k4k4z88046m8x0mwt7tgy0z22f0g0d6h98m24e';
    }
    return user.cryptoDepositAddress || '0x71C8135C0e41B3fA128912389128f9A19b28A0bf';
  };

  const depositAddress = getDepositAddress();

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    const available = paymentConfig.cryptoNetworks
      .filter(n => n.enabled !== false && n.token.toUpperCase().includes(coin.toUpperCase()))
      .map(n => n.name);
    const resolvedNetworks = available.length > 0 ? available : (fallbackNetworks[coin] || ['Ethereum (ERC20)']);
    if (resolvedNetworks && resolvedNetworks.length > 0) {
      setSelectedNetwork(resolvedNetworks[0]);
    }
    setIsQrGenerated(false);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorMsg('Deposit amount must be greater than zero.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const currency = method === 'sepa' ? 'EUR' : selectedCoin;
      const paymentMethodName = method === 'crypto' 
        ? `Crypto ${selectedCoin} (${selectedNetwork})` 
        : 'SEPA Bank Transfer';
      
      await ledger.processDeposit(
        user.id,
        amount,
        currency,
        paymentMethodName,
        txHashInput ? `TX-${txHashInput.substring(0, 10)}` : undefined,
        {
          network: selectedNetwork,
          coin: selectedCoin,
          depositAddress: method === 'crypto' ? depositAddress : paymentConfig.traditional.iban,
          txHash: txHashInput || undefined
        }
      );

      refreshUser();
      setSuccessMsg(`Deposit request for ${amount.toFixed(2)} ${currency} registered! Awaiting treasury confirmation.`);
      onSuccess();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Deposit submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#181818] text-white rounded-3xl max-w-lg w-full p-4 sm:p-6 border border-[#333] relative animate-in slide-in-from-bottom-4 duration-200 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header with clear Move Back / Close */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#181818]/95 backdrop-blur-xs py-1 z-20 border-b border-[#282828] pb-3">
          <button
            onClick={onClose}
            title="Move Back"
            aria-label="Move Back"
            className="w-8 h-8 rounded-xl bg-[#252525] hover:bg-[#333] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#34D399]" />
          </button>
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">Deposit Funds</h3>
            <p className="text-[11px] text-gray-400 font-medium">Instant Multi-Chain & Bank Gateway</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#252525] hover:bg-[#333] text-gray-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Method Toggle: Crypto vs SEPA */}
        <div className="flex bg-[#202020] p-1 rounded-xl mb-5 border border-[#333]">
          <button
            type="button"
            onClick={() => setMethod('crypto')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              method === 'crypto'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Multi-Chain Crypto</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('sepa')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              method === 'sepa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>SEPA Bank Wire</span>
          </button>
        </div>

        {successMsg && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* 1. CRYPTO DEPOSIT FLOW WITH OFFICIAL ORIGINAL BLOCKCHAIN TOKENS */}
        {method === 'crypto' && (
          <form onSubmit={handleDepositSubmit} className="space-y-5">
            {/* Step 1: Select Coin */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    1
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Select Coin</h4>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">12 Supported Blockchains</span>
              </div>

              {/* Coin Preview Bar showing authentic token profile logo */}
              <div className="bg-[#242424] px-4 py-3 rounded-xl mb-3 flex items-center justify-between border border-[#383838]">
                <div className="flex items-center gap-3">
                  <TokenSymbolIcon symbol={selectedCoin} className="w-7 h-7 shadow-sm" />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-white tracking-wide">{selectedCoin}</span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {coins.find(c => c.symbol === selectedCoin)?.name || selectedCoin}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-md font-semibold border border-emerald-500/30">
                    Active
                  </span>
                  <span className="text-xs text-gray-400">▼</span>
                </div>
              </div>

              {/* Coin selector grid with original symbol photos */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {coins.map(c => {
                  const isSelected = selectedCoin === c.symbol;
                  return (
                    <button
                      key={c.symbol}
                      type="button"
                      onClick={() => handleCoinSelect(c.symbol)}
                      className={`p-2 rounded-lg transition-all border flex flex-col items-center justify-center gap-1.5 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#2b2b2b] text-emerald-400 border-emerald-500 shadow-xs'
                          : 'bg-[#202020] text-gray-300 border-[#333333] hover:bg-[#282828] hover:border-gray-500 hover:text-white'
                      }`}
                    >
                      <TokenSymbolIcon 
                        symbol={c.symbol} 
                        className={`w-6 h-6 transition-transform group-hover:scale-105 ${isSelected ? 'scale-105' : 'opacity-90'}`} 
                      />
                      <span className="text-[11px] font-bold leading-none">{c.symbol}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Network with Multi-chain expansion */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    2
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Select Network</h4>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {currentNetworks.length} {currentNetworks.length === 1 ? 'Network' : 'Networks'} Available
                </span>
              </div>

              <div
                onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                className="bg-[#242424] px-4 py-2.5 rounded-xl mb-1.5 flex items-center justify-between border border-[#383838] cursor-pointer hover:border-gray-500 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <NetworkBadgeIcon networkName={selectedNetwork} className="w-5 h-5 shrink-0" />
                  <span className="font-bold text-sm text-white">{selectedNetwork}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isNetworkDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isNetworkDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-40 bg-[#222222] border border-[#444] rounded-xl shadow-2xl py-1 mt-1 max-h-56 overflow-y-auto divide-y divide-[#333]">
                  {currentNetworks.map(net => {
                    const isSelected = selectedNetwork === net;
                    return (
                      <button
                        key={net}
                        type="button"
                        onClick={() => {
                          setSelectedNetwork(net);
                          setIsNetworkDropdownOpen(false);
                          setIsQrGenerated(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#2f2f2f] transition-colors cursor-pointer ${
                          isSelected ? 'text-emerald-400 bg-[#2a2a2a]' : 'text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <NetworkBadgeIcon networkName={net} className="w-4 h-4 shrink-0" />
                          <span className="font-medium">{net}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 pt-0.5">
                <span>Network Protocol standard</span>
                <span className="text-gray-300 font-mono">Contract Ends With: {currentContract}</span>
              </div>
            </div>

            {/* Step 3: Address & QR Generation */}
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  3
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Deposit Address & QR</h4>
              </div>

              {!isQrGenerated ? (
                <button
                  type="button"
                  onClick={() => setIsQrGenerated(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow-xs transition-colors cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Generate QR Code & Deposit Address</span>
                </button>
              ) : (
                <div className="space-y-4 bg-[#242424] p-4 sm:p-5 rounded-2xl border border-[#383838]">
                  {/* Visual QR Code Display with centered token photo */}
                  <div className="flex flex-col items-center justify-center py-1">
                    <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-inner flex flex-col items-center justify-center relative">
                      {/* Synthetic crisp SVG QR Code matrix representation */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect width="100" height="100" fill="white" />
                        {/* Position detection patterns */}
                        <rect x="5" y="5" width="26" height="26" fill="black" />
                        <rect x="9" y="9" width="18" height="18" fill="white" />
                        <rect x="13" y="13" width="10" height="10" fill="black" />

                        <rect x="69" y="5" width="26" height="26" fill="black" />
                        <rect x="73" y="9" width="18" height="18" fill="white" />
                        <rect x="77" y="13" width="10" height="10" fill="black" />

                        <rect x="5" y="69" width="26" height="26" fill="black" />
                        <rect x="9" y="73" width="18" height="18" fill="white" />
                        <rect x="13" y="77" width="10" height="10" fill="black" />

                        {/* Data dots */}
                        <rect x="36" y="8" width="6" height="6" fill="black" />
                        <rect x="46" y="8" width="6" height="6" fill="black" />
                        <rect x="56" y="8" width="6" height="6" fill="black" />
                        <rect x="36" y="20" width="6" height="6" fill="black" />
                        <rect x="46" y="26" width="6" height="6" fill="black" />
                        <rect x="8" y="38" width="6" height="6" fill="black" />
                        <rect x="20" y="38" width="6" height="6" fill="black" />
                        <rect x="36" y="38" width="6" height="6" fill="black" />
                        <rect x="50" y="38" width="6" height="6" fill="black" />
                        <rect x="66" y="38" width="6" height="6" fill="black" />
                        <rect x="82" y="38" width="6" height="6" fill="black" />
                        <rect x="8" y="50" width="6" height="6" fill="black" />
                        <rect x="26" y="50" width="6" height="6" fill="black" />
                        <rect x="38" y="50" width="6" height="6" fill="black" />
                        <rect x="60" y="50" width="6" height="6" fill="black" />
                        <rect x="74" y="50" width="6" height="6" fill="black" />
                        <rect x="88" y="50" width="6" height="6" fill="black" />
                        <rect x="38" y="68" width="6" height="6" fill="black" />
                        <rect x="50" y="68" width="6" height="6" fill="black" />
                        <rect x="66" y="68" width="6" height="6" fill="black" />
                        <rect x="82" y="68" width="6" height="6" fill="black" />
                        <rect x="38" y="82" width="6" height="6" fill="black" />
                        <rect x="52" y="82" width="6" height="6" fill="black" />
                        <rect x="68" y="82" width="6" height="6" fill="black" />
                        <rect x="84" y="82" width="6" height="6" fill="black" />
                      </svg>

                      {/* Authentic original symbol profile photo centered in QR code */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-white p-1 shadow-lg flex items-center justify-center border-2 border-white">
                          <TokenSymbolIcon symbol={selectedCoin} className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-2 font-mono text-center">
                      Scan with Binance, OKX, Bybit, Trust Wallet or Metamask
                    </span>
                  </div>

                  {/* Address Copy Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5">
                        <NetworkBadgeIcon networkName={selectedNetwork} className="w-3.5 h-3.5" />
                        <span>{selectedCoin} Deposit Address ({selectedNetwork})</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-semibold">1 Confirmation Required</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#1a1a1a] p-2.5 rounded-xl border border-[#333]">
                      <span className="font-mono text-xs text-white truncate flex-1 select-all font-semibold">
                        {depositAddress}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Deposit Amount Entry */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-gray-400 font-bold mb-1">
                        Amount to Credit ({selectedCoin})
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 font-bold mb-1">
                        Tx Hash / Note (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="0x... or transaction id"
                        value={txHashInput}
                        onChange={(e) => setTxHashInput(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Submission Action */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Deposit Request...</span>
                      </>
                    ) : (
                      <span>Confirm Deposit Submission</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Footer matching screenshot */}
            <div className="border-t border-[#333] pt-4 flex justify-between text-xs text-gray-400">
              <div>
                <p className="text-[11px]">Deposit to Account</p>
                <p className="text-white font-bold text-sm mt-0.5">Primary Vault Spot ▼</p>
              </div>
              <div className="text-right">
                <p className="text-[11px]">Minimum Deposit Amount</p>
                <p className="text-white font-bold text-sm mt-0.5">1 {selectedCoin}</p>
              </div>
            </div>
          </form>
        )}

        {/* 2. SEPA BANK WIRE FLOW */}
        {method === 'sepa' && (
          <form onSubmit={handleDepositSubmit} className="space-y-5">
            <div className="bg-[#242424] p-5 rounded-xl border border-[#383838] space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>European Bank Escrow Account Details</span>
              </div>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Beneficiary Name</span>
                  <span className="font-bold text-white font-mono">{paymentConfig.traditional.beneficiary}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Bank Name</span>
                  <span className="font-semibold text-white">{paymentConfig.traditional.bankName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">IBAN Account Number</span>
                  <div className="flex items-center justify-between bg-[#1a1a1a] p-2 rounded-lg border border-[#333] mt-1 font-mono text-xs">
                    <span className="text-white select-all">{paymentConfig.traditional.iban}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentConfig.traditional.iban);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-emerald-400 hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      {copied ? 'Copied' : 'Copy IBAN'}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">BIC / SWIFT</span>
                  <span className="font-mono text-white">{paymentConfig.traditional.bic}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Mandatory Wire Transfer Concept / Reference</span>
                  <div className="bg-[#1a1a1a] p-2 rounded-lg border border-[#333] mt-1 text-emerald-400 font-mono font-bold">
                    KRETZ-DEP-{user.email.split('@')[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Declared Wire Deposit Amount (€ EUR)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-[#242424] border border-[#383838] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs"
            >
              {isSubmitting ? 'Registering SEPA Deposit...' : 'Confirm SEPA Transfer Request'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
