import React, { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getTourists, Tourist } from '@/services/api';
import AddTouristModal from '@/components/AddTouristModal';

const TouristsPage: React.FC = () => {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddTouristOpen, setIsAddTouristOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try { setTourists(await getTourists()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = tourists.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-1 dark:text-white transition-colors">Tourists</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
            Manage and monitor registered tourist devices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll} className="w-10 h-10 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors shadow-sm">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tourists..." className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] outline-none focus:border-emerald-500 text-sm dark:text-gray-200 shadow-sm transition-colors" />
          </div>
          <button onClick={() => setIsAddTouristOpen(true)} className="px-4 py-2.5 bg-emerald-800 text-white rounded-full font-medium text-sm flex items-center gap-2 hover:bg-emerald-900 transition-colors shadow-sm">
            <FiPlus /> Add Tourist
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[2rem] border border-gray-100 dark:border-[#222] overflow-hidden shadow-sm transition-colors">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 dark:bg-[#111]/50 border-b border-gray-100 dark:border-[#222] text-gray-500 dark:text-gray-400 font-medium transition-colors">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Device ID</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Alert Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-[#222]/30 transition-colors text-slate-700 dark:text-gray-300">
                <td className="px-6 py-4 font-mono text-xs text-gray-400 dark:text-gray-500">{t.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-gray-200">{t.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{t.deviceId}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{t.trekDestination}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${t.status === 'active' ? 'bg-[#e5f0ea] dark:bg-emerald-900/30 text-[#1b5e3a] dark:text-emerald-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    t.alertStatus === 'safe' ? 'bg-[#e5f0ea] dark:bg-emerald-900/30 text-[#1b5e3a] dark:text-emerald-400' : 
                    t.alertStatus === 'critical' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                  }`}>
                    {t.alertStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/tourist/${t.id}`} className="px-4 py-2 bg-[#e5f0ea] dark:bg-emerald-900/30 text-[#1b5e3a] dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-[#d1e6db] dark:hover:bg-emerald-900/50 transition-colors inline-block">
                    View Vitals
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">No tourists found.</td></tr>
            )}
            {loading && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">Loading tourists...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AddTouristModal 
        isOpen={isAddTouristOpen} 
        onClose={() => setIsAddTouristOpen(false)} 
        onSuccess={fetchAll} 
      />
    </div>
  );
};
export default TouristsPage;
