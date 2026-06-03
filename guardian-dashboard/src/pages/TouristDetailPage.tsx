import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiThermometer, FiActivity, FiMapPin, FiPhoneCall } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTourists, getTelemetryHistory, Tourist, TelemetryPoint } from '@/services/api';
import MapView from '@/components/MapView';

const TouristDetailPage: React.FC = () => {
  const { touristId } = useParams();
  const navigate = useNavigate();
  const [tourist, setTourist] = useState<Tourist | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let currentDevice = '';
    const fetchData = async () => {
      try {
        const tourists = await getTourists();
        const found = tourists.find(t => t.id === touristId || t.deviceId === touristId);
        if (found) {
          setTourist(found);
          currentDevice = found.deviceId;
        }

        try {
          const data = await getTelemetryHistory(currentDevice || touristId || '');
          setTelemetry(data);
        } catch (e) { console.error("Telemetry err:", e); }

      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [touristId]);

  if (loading) return <div className="p-10 text-gray-500">Loading tourist details...</div>;
  if (!tourist) return <div className="p-10 text-gray-500">Tourist not found.</div>;

  const latestVitals = telemetry[0] || { heartRate: tourist.heartRate, spo2: tourist.spo2, temperature: tourist.temperature, lat: tourist.lat, lng: tourist.lng };
  const displayTourist = { ...tourist, lat: latestVitals.lat || tourist.lat, lng: latestVitals.lng || tourist.lng };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm">
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">{tourist.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">ID: {tourist.id} | Device: {tourist.deviceId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vitals Overview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] shadow-sm transition-colors">
            <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-white transition-colors">Current Vitals</h3>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center text-xl transition-colors">
                  <FiHeart />
                </div>
                <div>
                  <div className="text-sm text-red-800/60 dark:text-red-300/60 font-semibold transition-colors">Heart Rate</div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 transition-colors">{latestVitals.heartRate > 0 ? latestVitals.heartRate : '--'} <span className="text-lg">bpm</span></div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center text-xl transition-colors">
                  <FiActivity />
                </div>
                <div>
                  <div className="text-sm text-blue-800/60 dark:text-blue-300/60 font-semibold transition-colors">SpO2 (Oxygen)</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors">{latestVitals.spo2 > 0 ? latestVitals.spo2 : '--'} <span className="text-lg">%</span></div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 text-orange-500 dark:text-orange-400 rounded-full flex items-center justify-center text-xl transition-colors">
                  <FiThermometer />
                </div>
                <div>
                  <div className="text-sm text-orange-800/60 dark:text-orange-300/60 font-semibold transition-colors">Body Temp</div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 transition-colors">{latestVitals.temperature > 0 ? latestVitals.temperature.toFixed(1) : '--'} <span className="text-lg">°C</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1b5e3a] p-6 rounded-[2rem] text-white shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-emerald-100">Emergency Information</h3>
            <div className="space-y-4">
              <div>
                <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Emergency Contact</div>
                <div className="text-lg font-medium">{tourist.emergencyContact || 'Not provided'}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center">
                  <FiPhoneCall />
                </div>
                <div className="text-lg font-bold">{tourist.emergencyPhone || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Map & Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white transition-colors">Live Location Tracking</h3>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-colors">
                <FiMapPin /> {tourist.trekDestination}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-[#222] transition-colors">
              <MapView tourists={[displayTourist]} height="340px" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] shadow-sm transition-colors">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white transition-colors">Tourist Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1 transition-colors">Email</div>
                <div className="font-medium text-slate-700 dark:text-gray-300 truncate transition-colors">{tourist.email || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1 transition-colors">Phone</div>
                <div className="font-medium text-slate-700 dark:text-gray-300 transition-colors">{tourist.phone || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1 transition-colors">Age</div>
                <div className="font-medium text-slate-700 dark:text-gray-300 transition-colors">{tourist.age || 'N/A'} yrs</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1 transition-colors">Registration</div>
                <div className="font-medium text-slate-700 dark:text-gray-300 truncate transition-colors">{new Date(tourist.registrationDate || Date.now()).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Graphs Section */}
          <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] shadow-sm transition-colors">
            <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-white transition-colors">Telemetry History</h3>
            {telemetry.length < 2 ? (
              <div className="h-64 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                Insufficient data to generate graphs.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...telemetry].reverse()} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid, #333)" opacity={0.3} />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      stroke="currentColor" 
                      className="text-gray-400 dark:text-gray-500 text-xs" 
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="currentColor" 
                      className="text-gray-400 dark:text-gray-500 text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="currentColor" 
                      className="text-gray-400 dark:text-gray-500 text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--tooltip-bg, #1a1a1a)', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                      labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                    />
                    <Line yAxisId="left" type="monotone" name="Heart Rate (bpm)" dataKey="heartRate" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }} />
                    <Line yAxisId="right" type="monotone" name="SpO2 (%)" dataKey="spo2" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs text-gray-500 font-medium">Heart Rate</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-gray-500 font-medium">SpO2</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default TouristDetailPage;
