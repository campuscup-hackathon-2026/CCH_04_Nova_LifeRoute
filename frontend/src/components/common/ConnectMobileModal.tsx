import React from 'react';
import { Smartphone, QrCode, X, ExternalLink, PhoneCall, Radio, CheckCircle2 } from 'lucide-react';

interface ConnectMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectMobileModal: React.FC<ConnectMobileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Local mobile network link
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  const mobileUrl = `${window.location.protocol}//${hostname}${port}/dial-109`;

  // Quick QR Code image via standard secure SVG/API for zero-dependency rendering
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobileUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-healthcare-50 text-healthcare-600 flex items-center justify-center mx-auto border border-healthcare-200 shadow-sm">
            <Smartphone className="w-7 h-7 text-healthcare-600" />
          </div>
          <h3 className="text-xl font-black text-navy-900">
            Connect Your Mobile Phone (109)
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Scan with your mobile camera or open the link below to turn your phone into a live 109 emergency dialer.
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center mb-6">
          <img
            src={qrImageSrc}
            alt="Scan with phone"
            className="w-44 h-44 rounded-xl border border-slate-200 shadow-sm bg-white p-2"
          />
          <span className="text-[11px] font-bold text-slate-500 mt-2 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emergency-500 animate-pulse" />
            Scan with iPhone / Android Camera
          </span>
        </div>

        {/* Direct Link */}
        <div className="space-y-3">
          <div className="text-[11px] font-semibold text-slate-500 text-center">
            Or open directly in your mobile browser:
          </div>
          <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-xs text-slate-700 text-center break-all select-all border border-slate-200 font-semibold">
            {mobileUrl}
          </div>
          <a
            href={mobileUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-healthcare-600 hover:bg-healthcare-700 text-white font-bold text-xs transition shadow"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Mobile Dialer Here to Test</span>
          </a>
        </div>
      </div>
    </div>
  );
};

