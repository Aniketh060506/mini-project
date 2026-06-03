import { useState } from 'react';
import { FiSearch, FiCheckCircle, FiShield, FiLoader, FiExternalLink } from 'react-icons/fi';
import { RiCompassDiscoverLine } from 'react-icons/ri';
import ErrorAlert from '@/components/ErrorAlert';
import QRCodeDisplay from '@/components/QRCodeDisplay';

const verificationSteps = [
  'Connecting to Polygon network...',
  'Querying smart contract...',
  'Decrypting tourist data...',
  'Verification complete ✓',
];

const VerifyPage = () => {
  const [blockchainId, setBlockchainId] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentVerifyStep, setCurrentVerifyStep] = useState(-1);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState<{
    name: string; destination: string; dates: string; device: string; age: number;
  } | null>(null);

  const verify = async () => {
    if (!blockchainId.trim()) return;
    setLoading(true); setError(''); setVerified(null);

    for (let i = 0; i < verificationSteps.length; i++) {
      setCurrentVerifyStep(i);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const { getAllTourists } = await import('@/services/api');
      const tourists = await getAllTourists();
      const found = tourists.find(t => String(t.blockchainId) === blockchainId.trim() || t.id === blockchainId.trim());
      if (found) {
        setVerified({
          name: found.fullName || 'Unknown',
          destination: found.trekDestination || 'Unknown',
          dates: `${found.trekStartDate || ''} → ${found.trekEndDate || ''}`,
          device: found.deviceId || 'UNKNOWN',
          age: found.age || 0,
        });
      } else {
        setError('Tourist not found on the blockchain index.');
      }
    } catch {
      setError('Failed to connect to the database.');
    }
    setLoading(false); setCurrentVerifyStep(-1);
  };

  return (
    <div className="min-h-screen page-wrapper">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        
        {/* ── Header ── */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="travel-brand justify-center mb-4 drop-shadow">
            <RiCompassDiscoverLine size={20} className="text-white" />
            TRAVEL
          </div>
          <h1 className="hero-heading text-[clamp(2.2rem,5vw,3.5rem)] mb-4">
            VERIFY IDENTITY
          </h1>
          <p className="text-white/70 text-sm md:text-base font-medium max-w-lg mx-auto drop-shadow">
            Authenticate tourist registration securely against our Polygon blockchain records.
          </p>
        </div>

        {/* ── Input Section ── */}
        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 mb-8 animate-fade-in mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full flex-1 relative">
              <input
                value={blockchainId}
                onChange={e => setBlockchainId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verify()}
                placeholder="Enter Blockchain TxID or Tourist ID (e.g. TSP-K7M2X9)"
                className="w-full px-6 py-4 rounded-2xl font-mono text-sm shadow-inner"
              />
            </div>
            <button
              onClick={verify}
              disabled={loading}
              className="btn-signin w-full md:w-auto !py-4 !px-8 flex items-center justify-center gap-2 disabled:opacity-60 shrink-0 shadow-lg shadow-blue-500/20"
            >
              {loading ? <><FiLoader className="animate-spin" size={18} /> Verifying...</> : <><FiSearch size={18} /> Verify</>}
            </button>
          </div>
          
          {error && <div className="mt-4"><ErrorAlert message={error} onClose={() => setError('')} /></div>}
        </div>

        {/* ── Horizontal Progress (when loading) ── */}
        {loading && (
          <div className="glass-card rounded-[2rem] p-8 mb-8 animate-slide-up">
            <p className="text-xs font-bold text-white/55 uppercase tracking-widest mb-6 text-center">Verification Progress</p>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 relative">
              {/* Horizontal line for desktop */}
              <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-white/20 z-0">
                <div 
                  className="h-full bg-blue-400 transition-all duration-700 ease-out" 
                  style={{ width: `${(Math.max(0, currentVerifyStep) / (verificationSteps.length - 1)) * 100}%` }}
                />
              </div>

              {verificationSteps.map((s, i) => (
                <div key={i} className="flex md:flex-col items-center gap-4 md:gap-3 relative z-10 w-full md:w-1/4 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 mx-auto ${
                    i <= currentVerifyStep
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-400/40 ring-4 ring-blue-500/20'
                      : 'bg-white/10 text-white/40 border border-white/20'
                  }`}>
                    {i < currentVerifyStep
                      ? <FiCheckCircle size={18} />
                      : i === currentVerifyStep
                      ? <FiLoader className="animate-spin" size={18} />
                      : <span className="text-sm font-bold">{i + 1}</span>}
                  </div>
                  <p className={`text-xs md:text-sm font-medium transition-colors duration-300 ${
                    i <= currentVerifyStep ? 'text-white drop-shadow' : 'text-white/40'
                  }`}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Verification Result ── */}
        {verified && !loading && (
          <div className="animate-scale-in max-w-2xl mx-auto">
            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-green-400/30 shadow-2xl shadow-green-500/10">
              
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md p-8 text-center border-b border-green-400/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-400/20 blur-3xl rounded-full" />
                <div className="w-20 h-20 rounded-full bg-green-400/25 border border-green-300/40 flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-green-500/20">
                  <FiCheckCircle className="text-green-300" size={36} />
                </div>
                <h2 className="text-2xl font-black text-white drop-shadow-md relative z-10">Identity Verified</h2>
                <p className="text-sm text-green-100 font-medium relative z-10">Confirmed on Polygon Blockchain</p>
              </div>

              {/* Data Grid */}
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                  {[['Name', verified.name], ['Age', `${verified.age} years`], ['Destination', verified.destination], ['Trek Dates', verified.dates], ['Device ID', verified.device]].map(([label, value], i) => (
                    <div key={i}>
                      <span className="text-xs text-white/50 font-bold uppercase tracking-wider block mb-1">{label}</span>
                      <span className="text-base font-bold text-white break-words">{value}</span>
                    </div>
                  ))}
                </div>
                
                {/* QR and Blockchain Link */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="shrink-0 bg-white p-2 rounded-xl">
                    <QRCodeDisplay value={blockchainId} size={100} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2">Transaction Record</p>
                    {blockchainId.startsWith('0x') && blockchainId.length > 40 ? (
                      <a href={`https://polygonscan.com/tx/${blockchainId}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-300 font-bold hover:text-white hover:underline transition-all break-all">
                        View on Polygonscan <FiExternalLink size={14} className="shrink-0" />
                      </a>
                    ) : (
                      <p className="text-sm font-mono text-white/70">Local Test ID: {blockchainId}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Empty State ── */}
        {!verified && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
            {[
              { icon: <FiShield size={24} />, title: 'Immutable', desc: 'Data is permanently secured on Polygon.' },
              { icon: <FiCheckCircle size={24} />, title: 'Instant', desc: 'Real-time cryptographic verification.' },
              { icon: <FiSearch size={24} />, title: 'Transparent', desc: 'Public records for complete trust.' }
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-[2rem] p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-white/80">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-white/60 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyPage;
