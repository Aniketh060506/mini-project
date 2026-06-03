import React, { useState, useEffect } from 'react';
import { FiArrowUpRight, FiPlus } from 'react-icons/fi';
import { getTourists, getAlerts, Tourist, Alert } from '@/services/api';
import MapView from '@/components/MapView';
import AddTouristModal from '@/components/AddTouristModal';
import ImportDataModal from '@/components/ImportDataModal';
import NewAlertModal from '@/components/NewAlertModal';

const DashboardPage: React.FC = () => {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const [isAddTouristOpen, setIsAddTouristOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const [isNewAlertOpen, setIsNewAlertOpen] = useState(false);

  const fetchData = async () => {
    try { setTourists(await getTourists()); } catch (e) { console.error('Tourists Error:', e); }
    try { setAlerts(await getAlerts()); } catch (e) { console.error('Alerts Error:', e); }
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeTourists = tourists.filter(t => t.status === 'active');
  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 dark:text-white transition-colors">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAddTouristOpen(true)} className="px-4 py-2.5 bg-emerald-800 text-white rounded-full font-medium text-sm flex items-center gap-2 hover:bg-emerald-900 transition-colors">
            <FiPlus /> Add Tourist
          </button>
          <button onClick={() => setIsImportDataOpen(true)} className="px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] text-slate-800 dark:text-gray-200 rounded-full font-medium text-sm hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
            Import Data
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Card - Dark Green */}
        <div className="bg-[#1b5e3a] p-6 rounded-[2rem] text-white flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="font-medium text-emerald-100">Total Tourists</div>
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center">
              <FiArrowUpRight />
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">{tourists.length}</div>
            <div className="text-xs text-emerald-200 flex items-center gap-2">
              <span className="bg-emerald-700 px-2 py-0.5 rounded flex items-center">
                <FiArrowUpRight className="mr-1"/> 5
              </span>
              Increased from last month
            </div>
          </div>
        </div>

        {/* Active Treks Card */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="font-medium text-slate-700 dark:text-gray-300">Active Treks</div>
            <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#333] flex items-center justify-center text-slate-500 dark:text-gray-400">
              <FiArrowUpRight />
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2 text-slate-800 dark:text-white">{activeTourists.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded flex items-center text-slate-600 dark:text-gray-300">
                <FiArrowUpRight className="mr-1"/> 2
              </span>
              Increased from last week
            </div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="font-medium text-slate-700 dark:text-gray-300">Active Alerts</div>
            <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#333] flex items-center justify-center text-slate-500 dark:text-gray-400">
              <FiArrowUpRight />
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2 text-slate-800 dark:text-white">{activeAlerts.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Unacknowledged alerts
            </div>
          </div>
        </div>

        {/* Critical Card */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="font-medium text-slate-700 dark:text-gray-300">Critical Status</div>
            <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#333] flex items-center justify-center text-slate-500 dark:text-gray-400">
              <FiArrowUpRight />
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2 text-slate-800 dark:text-white">{criticalAlerts.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Tourists at direct risk
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] transition-colors">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Live Telemetry Map</h3>
            <MapView tourists={tourists} height="360px" />
          </div>
        </div>

    {/* Right Col - Feed */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-[#222] min-h-[440px] max-h-[600px] flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="font-bold text-lg dark:text-white">Alert Feed</h3>
              <button onClick={() => setIsNewAlertOpen(true)} className="text-xs font-semibold px-3 py-1 border border-gray-200 dark:border-[#333] dark:text-gray-300 rounded-full transition-colors">
                + New
              </button>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">All tourists safe</div>
              ) : (
                alerts.map(alert => {
                  // Fallback to descriptive messages if the backend doesn't provide a detailed one
                  let displayMessage = alert.message;
                  if (!displayMessage || displayMessage.trim() === '') {
                    if (alert.type && alert.type.toLowerCase().includes('fall')) {
                      displayMessage = 'Fall Detected! Immediate assistance may be required.';
                    } else if (alert.type && alert.type.toLowerCase().includes('health')) {
                      displayMessage = 'Abnormal Vitals Detected. Please check telemetry.';
                    } else if (alert.severity === 'critical') {
                      displayMessage = 'Critical Alert Triggered';
                    } else {
                      displayMessage = 'Warning Alert Triggered';
                    }
                  }

                  // Enhance the title if touristName is just an ID
                  const title = alert.touristName.startsWith('T') && alert.touristName.length > 5 
                    ? `Tourist ID: ${alert.touristName}` : alert.touristName;

                  return (
                    <div key={alert.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-[#222] rounded-xl transition-colors">
                      <div className={`mt-1 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                        alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                      }`}>
                        <div className={`w-3 h-3 rounded-full animate-pulse ${alert.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-800 dark:text-gray-200">{title}</div>
                        <div className="text-sm font-medium text-slate-600 dark:text-gray-400 mt-0.5 leading-snug">{displayMessage}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${alert.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                            {alert.type && alert.type !== 'UNKNOWN' ? alert.type.replace('_', ' ') : alert.severity}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <AddTouristModal 
        isOpen={isAddTouristOpen} 
        onClose={() => setIsAddTouristOpen(false)} 
        onSuccess={fetchData} 
      />
      <ImportDataModal 
        isOpen={isImportDataOpen} 
        onClose={() => setIsImportDataOpen(false)} 
        onSuccess={fetchData} 
      />
      <NewAlertModal 
        isOpen={isNewAlertOpen} 
        onClose={() => setIsNewAlertOpen(false)} 
        onSuccess={fetchData} 
        tourists={tourists}
      />
    </div>
  );
};
export default DashboardPage;
