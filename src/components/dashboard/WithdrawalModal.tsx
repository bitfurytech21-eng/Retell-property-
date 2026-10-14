import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { ledger } from '../../lib/ledger';
import { formatCurrency } from '../../lib/utils';
import { isValidIBAN } from '../../lib/validation';
import { ArrowUpRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateProfile: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateProfile
}) => {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState<number>(100);
  const [iban, setIban] = useState<string>('ES9121000418450200051829');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !user) return null;

  const isKYCVerified = user.kycStatus === 'verified';

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isKYCVerified) {
      setError('Regulatory compliance requires identity verification (KYC) before withdrawing funds.');
      return;
    }

    if (amount <= 0) {
      setError('Withdrawal amount must be greater than €0.00.');
      return;
    }

    if (amount > user.walletBalance) {
      setError(`Requested amount (€${amount.toFixed(2)}) exceeds available wallet balance (€${user.walletBalance.toFixed(2)}).`);
      return;
    }

    if (!isValidIBAN(iban)) {
      setError('Please provide a valid European IBAN format.');
      return;
    }

    setIsSubmitting(true);
    try {
      await ledger.requestWithdrawal(user.id, amount, 'SEPA Bank Wire', { bankIban: iban });
      refreshUser();
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Withdrawal request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E3E8E3] relative animate-in fade-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C24141] flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#18211F]">Withdraw Funds</h3>
              <p className="text-xs text-[#69736F]">Transfer capital to your designated bank account</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1">
            ✕
          </button>
        </div>

        {!isKYCVerified ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#B7791F] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#18211F]">Identity Verification Required</h4>
            <p className="text-xs text-[#69736F] max-w-xs mx-auto leading-relaxed">
              In adherence to European AML/CFT regulations, withdrawals can only be processed to bank accounts belonging to verified investors.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onNavigateProfile();
                }}
                className="btn btn-primary text-xs font-bold w-full"
              >
                Complete Identity Verification (2 min)
              </button>
              <button onClick={onClose} className="btn btn-secondary text-xs font-medium w-full">
                Cancel
              </button>
            </div>
          </div>
        ) : !success ? (
          <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
            <div className="bg-[#F6F7F4] p-4 rounded-2xl border border-[#E3E8E3] flex justify-between items-center text-xs">
              <span className="text-[#69736F]">Available for Withdrawal:</span>
              <span className="text-base font-extrabold text-[#182D2A]">{formatCurrency(user.walletBalance)}</span>
            </div>

            <div className="form-field">
              <label>Withdrawal Amount (EUR)</label>
              <div className="relative">
                <input
                  type="number"
                  min={10}
                  max={user.walletBalance}
                  step={10}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="font-bold text-base"
                />
                <button
                  type="button"
                  onClick={() => setAmount(user.walletBalance)}
                  className="absolute right-3 top-3 text-[11px] font-bold text-[#27845D] hover:underline"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Destination European Bank IBAN</label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="ES91 2100 0418 ..."
                required
                className="font-mono text-xs uppercase"
              />
              <span className="text-[11px] text-[#69736F]">
                Account holder name must match your verified identity: <strong>{user.fullName}</strong>
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            <div className="p-3 rounded-2xl bg-[#EEF1EC] text-[11px] text-[#69736F] leading-tight space-y-1">
              <p>• SEPA processing time: 1–2 European banking business days.</p>
              <p>• Zero withdrawal fee charged by Rental-log.</p>
              <p>• Funds are escrowed immediately to prevent double processing.</p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting || user.walletBalance <= 0}
                className="btn btn-primary text-xs font-bold w-full py-3"
              >
                {isSubmitting ? 'Verifying Risk Ledger...' : `Confirm Withdrawal of ${formatCurrency(amount)}`}
              </button>
              <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-medium w-full">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#18211F]">Withdrawal Request Logged</h4>
            <p className="text-xs text-[#69736F] max-w-xs mx-auto">
              Your withdrawal of <strong>{formatCurrency(amount)}</strong> has been registered on the financial ledger and is in administrative review.
            </p>
            <button onClick={onClose} className="btn btn-primary text-xs font-bold w-full mt-4">
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
