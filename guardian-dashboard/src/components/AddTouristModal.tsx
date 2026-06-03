import React, { useState } from 'react';
import { FiX, FiUserPlus, FiMapPin, FiPhone, FiCreditCard } from 'react-icons/fi';
import { addTourist } from '@/services/api';

interface AddTouristModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTouristModal: React.FC<AddTouristModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    deviceId: '',
    blockchainId: '',
    trekDestination: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addTourist({
        ...formData,
        age: parseInt(formData.age, 10) || 0,
        status: 'active',
        alertStatus: 'safe',
        lat: 0,
        lng: 0,
        heartRate: 75,
        spo2: 98,
        temperature: 36.5,
        registrationDate: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      });
      window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Tourist added successfully!' }));
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to add tourist to the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-[2rem] shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#222] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <FiUserPlus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Tourist</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Register a new tourist tracking device to the network</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#222] text-gray-500 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}
          
          <form id="add-tourist-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Full Name *</label>
                <div className="relative">
                  <FiUserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-colors dark:text-white" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Age *</label>
                <input required type="number" min="1" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-emerald-500 outline-none transition-colors dark:text-white" placeholder="32" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-emerald-500 outline-none transition-colors dark:text-white" placeholder="+91 9876543210" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Blockchain ID / Wallet</label>
                <div className="relative">
                  <FiCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={formData.blockchainId} onChange={e => setFormData({...formData, blockchainId: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-emerald-500 outline-none transition-colors dark:text-white" placeholder="0x..." />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Trek Destination *</label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="text" value={formData.trekDestination} onChange={e => setFormData({...formData, trekDestination: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-emerald-500 outline-none transition-colors dark:text-white" placeholder="e.g., KedarKantha Trek, Dayara Bugyal" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Device Mac ID *</label>
                <input required type="text" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm font-mono focus:border-emerald-500 outline-none transition-colors dark:text-white uppercase" placeholder="A1:B2:C3..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Emergency Name</label>
                <input type="text" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-emerald-500 outline-none transition-colors dark:text-white" placeholder="Jane Doe" />
              </div>
            </div>
            
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Emergency Phone</label>
                <input type="tel" value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:border-emerald-500 outline-none transition-colors dark:text-white" placeholder="+91 9998887776" />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#151515] rounded-b-[2rem] flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-[#222] transition-colors">
            Cancel
          </button>
          <button type="submit" form="add-tourist-form" disabled={loading} className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#1b5e3a] text-white hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center min-w-[140px]">
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : 'Register Tourist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTouristModal;
