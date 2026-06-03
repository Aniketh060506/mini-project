import { FiCheckCircle, FiX, FiCopy, FiDownload } from 'react-icons/fi';
import QRCodeDisplay from './QRCodeDisplay';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  touristId: string;
  blockchainId: string;
}

const SuccessModal = ({ isOpen, onClose, touristId, blockchainId }: SuccessModalProps) => {
  if (!isOpen) return null;
  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl p-7 max-w-md w-full animate-scale-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/18">
          <FiX size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-400/25 border border-green-300/40 flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-200" size={32} />
          </div>
          <h3 className="text-xl font-black text-white drop-shadow">Registration Successful!</h3>
          <p className="text-sm text-white/55 mt-1 font-medium">Your identity has been secured on the blockchain</p>
        </div>

        <div className="space-y-3 mb-5">
          {[['Tourist ID', touristId], ['Blockchain ID', blockchainId]].map(([label, val]) => (
            <div key={label} className="p-3.5 rounded-2xl bg-white/15 border border-white/25">
              <p className="text-xs text-white/50 font-medium mb-1.5">{label}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-mono font-bold text-white truncate">{val}</span>
                <button onClick={() => copy(val)} className="text-white/55 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/18 shrink-0">
                  <FiCopy size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-5">
          <QRCodeDisplay value={blockchainId} size={150} />
        </div>

        <p className="text-xs text-center text-white/40 font-medium mb-5">
          📧 A confirmation email has been sent to your registered email.
        </p>

        <div className="flex gap-3">
          <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/15 border border-white/28 text-white/80 text-sm font-semibold hover:bg-white/22 hover:text-white transition-all">
            <FiDownload size={14} /> Download
          </button>
          <button onClick={onClose} className="flex-1 btn-signin !w-auto py-3 text-sm font-bold rounded-xl">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
