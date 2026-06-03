import { FiAlertCircle, FiX } from 'react-icons/fi';

const ErrorAlert = ({ message, onClose }: { message: string; onClose?: () => void }) => (
  <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-400/20 animate-scale-in">
    <FiAlertCircle className="mt-0.5 shrink-0 text-red-400" size={18} />
    <p className="text-sm flex-1 text-red-300">{message}</p>
    {onClose && (
      <button onClick={onClose} className="shrink-0 text-red-400/60 hover:text-red-300 transition-colors">
        <FiX size={16} />
      </button>
    )}
  </div>
);

export default ErrorAlert;
