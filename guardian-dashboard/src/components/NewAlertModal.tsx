import React, { useState } from 'react';
import { FiX, FiAlertTriangle, FiUser, FiInfo } from 'react-icons/fi';
import { createAlert } from '@/services/api';

interface NewAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tourists: { id: string; name: string }[];
}

const NewAlertModal: React.FC<NewAlertModalProps> = ({ isOpen, onClose, onSuccess, tourists }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    touristId: '',
    type: 'SOS_TRIGGERED',
    severity: 'critical' as 'critical' | 'warning' | 'info',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.touristId) {
      setError('Please select a tourist.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const targetTourist = tourists.find(t => t.id === formData.touristId);
      await createAlert({
        ...formData,
        touristName: targetTourist?.name || formData.touristId,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        lat: 0,
        lng: 0
      });
      window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Alert dispatched successfully!' }));
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch alert.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-[2rem] shadow-2xl animate-scale-in flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'}`}>
              <FiAlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Dispatch Alert</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manually trigger an emergency response</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#222] text-gray-500 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}
          
          <form id="new-alert-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Target Tourist *</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select required value={formData.touristId} onChange={e => setFormData({...formData, touristId: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-red-500 outline-none transition-colors dark:text-white appearance-none cursor-pointer">
                  <option value="" disabled>Select tourist...</option>
                  {tourists.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Alert Type *</label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-red-500 outline-none transition-colors dark:text-white appearance-none cursor-pointer h-full">
                  <option value="SOS_TRIGGERED">SOS Triggered</option>
                  <option value="FALL_DETECTED">Fall Detected</option>
                  <option value="GEOFENCE_BREACH">Geofence Out Of Bounds</option>
                  <option value="HEALTH_CRITICAL">Critical Health Pulse</option>
                  <option value="MANUAL_AUTHORITY">Manual Staff Alert</option>
                </select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Severity *</label>
                <select required value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value as any})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-red-500 outline-none transition-colors dark:text-white appearance-none cursor-pointer h-full">
                  <option value="critical">Critical (Red)</option>
                  <option value="warning">Warning (Orange)</option>
                  <option value="info">Info (Blue)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Custom Message (Optional)</label>
              <div className="relative">
                <FiInfo className="absolute left-3.5 top-[14px] text-gray-400" />
                <textarea rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-red-500 outline-none transition-colors dark:text-white resize-none" placeholder="Provide extra context to responders..."></textarea>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#151515] rounded-b-[2rem] flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-[#222] transition-colors">
            Cancel
          </button>
          <button type="submit" form="new-alert-form" disabled={loading} className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${formData.severity === 'critical' ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/20'}`}>
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : 'Dispatch Alert'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAlertModal;
