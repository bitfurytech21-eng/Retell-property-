import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { ledger } from '../../lib/ledger';
import { formatCurrency } from '../../lib/utils';
import { Building, QrCode, Copy, Check, ArrowDownLeft, ShieldCheck, AlertCircle } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedCoin, setSelectedCoin] = useState('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum (ERC20)');

  const coins = ['BTC', 'SOL', 'ETH', 'USDT', 'USDC'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181818] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#333] relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ← Back
          </button>
          <h3 className="text-xl font-bold">Deposit</h3>
          <div className="w-10"></div>
        </div>

        {/* Step 1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#fcd535] text-black font-bold flex items-center justify-center">1</div>
            <h4 className="text-lg font-bold text-white">Select Coin</h4>
          </div>
          <div className="bg-[#2a2a2a] p-3 rounded-xl mb-3 flex items-center justify-between border border-[#444]">
            <span className="font-bold flex items-center gap-2"><div className='w-5 h-5 bg-[#26a17b] rounded-full'></div> {selectedCoin} TetherUS</span>
            <span>▼</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {coins.map(coin => (
              <button key={coin} onClick={() => setSelectedCoin(coin)} className={`p-2 rounded-lg text-xs font-bold ${selectedCoin === coin ? 'bg-[#333]' : 'bg-[#2a2a2a]'} border border-[#444]`}>
                {coin}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#fcd535] text-black font-bold flex items-center justify-center">2</div>
            <h4 className="text-lg font-bold text-white">Select Network</h4>
          </div>
          <div className="bg-[#2a2a2a] p-3 rounded-xl mb-2 flex items-center justify-between border border-[#444]">
            <span className="font-bold">{selectedNetwork}</span>
            <span>▼</span>
          </div>
          <p className="text-xs text-gray-400 text-right">Contract Address Ends With 831ec7 &gt;</p>
        </div>

        {/* Step 3 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#fcd535] text-black font-bold flex items-center justify-center">3</div>
            <h4 className="text-lg font-bold text-white">Address</h4>
          </div>
          <button className="w-full bg-[#fcd535] text-black font-bold py-3 rounded-xl">
            Click to Generate QR Code
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-[#333] pt-6 flex justify-between text-sm text-gray-400">
          <div>
            <p>Deposit to</p>
            <p className="text-white font-bold">Spot ▼</p>
          </div>
          <div className='text-right'>
            <p>Minimum Deposit Amount</p>
            <p className="text-white font-bold">1 USDT</p>
          </div>
        </div>
      </div>
    </div>
  );
};
