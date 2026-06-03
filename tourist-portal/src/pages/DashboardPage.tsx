import { useState, useEffect, useCallback } from 'react';
import {
  FiSearch, FiAlertTriangle, FiMapPin, FiClock, FiUser,
  FiPhone, FiMail, FiCalendar, FiCpu, FiLink,
} from 'react-icons/fi';
import { FaHeartbeat, FaLungs, FaThermometerHalf } from 'react-icons/fa';
import { RiCompassDiscoverLine } from 'react-icons/ri';
import MapView from '@/components/MapView';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { getAllTourists, getTelemetry, type Tourist, type Telemetry } from '@/services/api';

const BarGauge = ({ label, value, unit, min, max, icon, gStart, gEnd }: {
  label: string; value: number; unit: string; min: number; max: number;
  icon: React.ReactNode; gStart: string; gEnd: string;
}) => {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="glass-card rounded-2xl p-5 hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center">{icon}</div>
          <span className="text-sm font-bold text-white drop-shadow-sm">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white drop-shadow">{typeof value === 'number' ? value.toFixed(value % 1 ? 1 : 0) : value}</span>
          <span className="text-xs text-white/60 ml-1 font-medium">{unit}</span>
        </div>
      </div>
      <div className="bar-gauge-track">
        <div className="bar-gauge-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${gStart}, ${gEnd})` }} />
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [searchId, setSearchId] = useState('');
  const [tourist, setTourist] = useState<Tourist | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!searchId.trim()) return;
    setLoading(true); setError(''); setTourist(null); setTelemetry(null);
    try {
      const tourists = await getAllTourists();
      const found = tourists.find(t => t.id === searchId.trim() || t.blockchainId === searchId.trim());
      if (!found) throw new Error();
      setTourist(found);
      try { setTelemetry(await getTelemetry(found.deviceId)); } catch {}
    } catch {
      setError('Tourist not found. Check the ID and try again.');
    } finally { setLoading(false); }
  };

  const refreshTelemetry = useCallback(async () => {
    if (tourist) { try { setTelemetry(await getTelemetry(tourist.deviceId)); } catch {} }
  }, [tourist]);

  useEffect(() => {
    if (!tourist) return;
    const interval = setInterval(refreshTelemetry, 5000);
    return () => clearInterval(interval);
  }, [tourist, refreshTelemetry]);

  return (
    <div className="min-h-screen page-wrapper">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">

        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <div className="travel-brand mb-4 drop-shadow">
            <RiCompassDiscoverLine size={18} className="text-white" />
            TRAVEL
          </div>
          <h1 className="hero-heading text-[clamp(2.2rem,5vw,3.8rem)] mb-2">
            LIVE<br />DASHBOARD
          </h1>
          <p className="text-white/65 text-sm font-medium drop-shadow">Real-time monitoring of registered trekkers</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mb-10 animate-slide-up delay-100">
          <div className="glass-card rounded-2xl flex gap-3 p-2.5">
            <input
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search by Tourist ID (e.g. TSP-K7M2X9)..."
              className="search-input-transparent flex-1 text-sm px-3"
            />
            <button
              onClick={search}
              disabled={loading}
              className="btn-signin !w-auto !px-6 !py-2.5 !text-sm !rounded-xl flex items-center gap-2 disabled:opacity-60"
            >
              <FiSearch size={15} /> Search
            </button>
          </div>
        </div>

        {error && <div className="max-w-2xl mb-6"><ErrorAlert message={error} onClose={() => setError('')} /></div>}
        {loading && <LoadingSpinner text="Fetching tourist data..." />}

        {tourist && (
          <div className="space-y-6 animate-fade-in">
            {/* Profile banner */}
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/60 to-indigo-600/60 backdrop-blur-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <FiUser className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-white drop-shadow">{tourist.fullName}</h2>
                  <p className="text-sm text-white/55 font-mono">ID: {tourist.id}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-400/25 border border-green-300/40">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  <span className="text-sm font-bold text-green-100">Device Active</span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <FiPhone size={13} />, label: 'Phone', value: tourist.phone },
                  { icon: <FiMail size={13} />, label: 'Email', value: tourist.email },
                  { icon: <FiMapPin size={13} />, label: 'Destination', value: tourist.trekDestination },
                  { icon: <FiCalendar size={13} />, label: 'Trek', value: `${tourist.trekStartDate} → ${tourist.trekEndDate}` },
                  { icon: <FiCpu size={13} />, label: 'Device', value: tourist.deviceId },
                  { icon: <FiUser size={13} />, label: 'Age', value: `${tourist.age} years` },
                  { icon: <FiCalendar size={13} />, label: 'Registered', value: tourist.registrationDate },
                  { icon: <FiLink size={13} />, label: 'Blockchain', value: tourist.blockchainId, link: true },
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/12 border border-white/18">
                    <div className="flex items-center gap-1.5 text-white/50 mb-1.5">
                      {f.icon}
                      <span className="text-xs font-medium">{f.label}</span>
                    </div>
                    {(f as any).link ? (
                      <a href={`https://polygonscan.com/tx/${f.value}`} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-mono text-blue-200 hover:text-white underline truncate block">{f.value}</a>
                    ) : (
                      <p className="text-sm font-bold text-white truncate">{f.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry */}
            {telemetry && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white drop-shadow-md">Live Telemetry</h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/25 text-xs">
                    <FiClock size={11} className="text-white/55" />
                    <span className="text-white/55 font-medium">{new Date(telemetry.timestamp).toLocaleTimeString()}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  <div className="md:col-span-2 lg:col-span-2 glass-card rounded-3xl p-4 min-h-[300px]">
                    <div className="flex items-center gap-2 mb-3">
                      <FiMapPin className="text-white/80" size={14} />
                      <span className="text-sm font-bold text-white drop-shadow-sm">Location</span>
                      <span className="text-xs text-white/50 ml-auto font-mono">{telemetry.latitude.toFixed(4)}°N, {telemetry.longitude.toFixed(4)}°E</span>
                    </div>
                    <MapView lat={telemetry.latitude} lng={telemetry.longitude} label={tourist.fullName} />
                  </div>
                  <div className="md:col-span-1 lg:col-span-3 space-y-4">
                    <BarGauge label="Heart Rate" value={telemetry.heartRate} unit="BPM" min={40} max={180}
                      icon={<FaHeartbeat className="text-red-300" size={16} />}
                      gStart="hsl(0,80%,60%)" gEnd="hsl(20,85%,65%)" />
                    <BarGauge label="SpO2" value={telemetry.spo2} unit="%" min={80} max={100}
                      icon={<FaLungs className="text-sky-200" size={16} />}
                      gStart="hsl(200,90%,58%)" gEnd="hsl(214,100%,65%)" />
                    <BarGauge label="Body Temperature" value={telemetry.temperature} unit="°C" min={35} max={42}
                      icon={<FaThermometerHalf className="text-amber-200" size={16} />}
                      gStart="hsl(38,92%,52%)" gEnd="hsl(25,90%,62%)" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty state */}
        {!tourist && !loading && (
          <div className="max-w-lg mx-auto mt-16 glass-card rounded-3xl p-12 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-5">
              <FiSearch className="text-white" size={30} />
            </div>
            <h3 className="text-xl font-black text-white mb-2 drop-shadow">Search for a Trekker</h3>
            <p className="text-sm text-white/60 max-w-xs mx-auto font-medium">
              Enter a Tourist ID or Blockchain ID to view real-time health and location data
            </p>
          </div>
        )}
      </div>

      {tourist && (
        <button className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-2xl bg-red-500 text-white shadow-2xl shadow-red-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform animate-pulse-slow border-2 border-red-300/50">
          <FiAlertTriangle size={26} />
        </button>
      )}
    </div>
  );
};

export default DashboardPage;
