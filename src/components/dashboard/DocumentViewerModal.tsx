import React from 'react';
import { Investment } from '../../types/investment';
import { ShieldCheck, X, FileText, Download, ExternalLink, Award } from 'lucide-react';
import { formatCurrency, formatDate, formatPercent } from '../../lib/utils';

interface DocumentViewerModalProps {
  investment: Investment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  investment,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !investment) return null;

  const handleDownloadDoc = (docName: string) => {
    alert(`Downloading verified document: ${docName} for ${investment.certificateId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-7 shadow-2xl border border-[#E3E8E3] relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#F6F7F4] text-[#69736F] hover:bg-[#E3E8E3] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#182D2A] text-[#B7E36A] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#18211F]">Official Investment Documents</h3>
            <p className="text-xs text-[#69736F]">
              Cryptographically timestamped and legally binding SPV fractional certificates.
            </p>
          </div>
        </div>

        {/* Investment Summary Box */}
        <div className="bg-[#F6F7F4] p-4 rounded-2xl border border-[#E3E8E3] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#69736F]">Property Asset</span>
            <span className="font-bold text-[#18211F]">{investment.propertyTitle}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#69736F]">Certificate Identifier</span>
            <span className="font-mono font-bold text-[#27845D]">{investment.certificateId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#69736F]">Tokens Acquired</span>
            <span className="font-bold text-[#18211F]">{investment.tokensPurchased} tokens ({formatCurrency(investment.totalAmountInvested)})</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#69736F]">Acquisition Date</span>
            <span className="font-medium text-[#18211F]">{formatDate(investment.purchasedAt)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#69736F]">Verified TX Hash</span>
            <span className="font-mono text-[11px] text-[#69736F] truncate max-w-[240px]">{investment.transactionHash}</span>
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#18211F] uppercase tracking-wider">Available Legal Instruments</h4>
          
          <div className="space-y-2">
            <div className="p-4 rounded-2xl border border-[#E3E8E3] flex items-center justify-between bg-white hover:border-[#182D2A] transition-all">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#27845D]" />
                <div>
                  <span className="text-xs font-bold text-[#18211F] block">SPV Shareholder Certificate & Trust Deed</span>
                  <span className="text-[10px] text-[#69736F]">PDF · Signed by Notary & Corporate Director</span>
                </div>
              </div>
              <button
                onClick={() => handleDownloadDoc('SPV_Certificate_' + investment.certificateId + '.pdf')}
                className="btn btn-secondary btn-sm text-xs font-semibold py-1.5 px-3"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-[#E3E8E3] flex items-center justify-between bg-white hover:border-[#182D2A] transition-all">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#27845D]" />
                <div>
                  <span className="text-xs font-bold text-[#18211F] block">RICS Certified Independent Property Valuation</span>
                  <span className="text-[10px] text-[#69736F]">PDF · Appraisal Date: January 2026</span>
                </div>
              </div>
              <button
                onClick={() => handleDownloadDoc('RICS_Valuation_' + investment.propertyId + '.pdf')}
                className="btn btn-secondary btn-sm text-xs font-semibold py-1.5 px-3"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-[#E3E8E3] flex items-center justify-between bg-white hover:border-[#182D2A] transition-all">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#27845D]" />
                <div>
                  <span className="text-xs font-bold text-[#18211F] block">Notarized Property Purchase Deed & Land Registry</span>
                  <span className="text-[10px] text-[#69736F]">PDF · Official Spanish Land Registry Extract</span>
                </div>
              </div>
              <button
                onClick={() => handleDownloadDoc('Notarized_Deed_' + investment.propertyId + '.pdf')}
                className="btn btn-secondary btn-sm text-xs font-semibold py-1.5 px-3"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="btn btn-primary text-xs font-bold px-6">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
