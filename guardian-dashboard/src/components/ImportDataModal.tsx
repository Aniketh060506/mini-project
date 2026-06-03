import React, { useState } from 'react';
import { FiX, FiUploadCloud, FiFileText } from 'react-icons/fi';
import { importTouristsBatch } from '@/services/api';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportDataModal: React.FC<ImportDataModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const rawData = JSON.parse(text);
      const touristsArray = Array.isArray(rawData) ? rawData : (rawData.tourists || []);
      
      if (touristsArray.length === 0) {
        throw new Error("No tourists found in the file.");
      }

      await importTouristsBatch(touristsArray);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: `Successfully imported ${touristsArray.length} tourists!` }));
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to import data. Please ensure it is a valid JSON file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-[2rem] shadow-2xl animate-scale-in flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <FiUploadCloud size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Import Data</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upload JSON tourist roster</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#222] text-gray-500 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}
          
          <form id="import-data-form" onSubmit={handleSubmit}>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 dark:border-[#333] rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiFileText className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                  <span className="font-semibold text-slate-700 dark:text-gray-200">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">JSON formatted roster only</p>
              </div>
              <input type="file" className="hidden" accept=".json" onChange={handleFileChange} />
            </label>

            {file && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FiFileText className="text-blue-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-200 truncate">{file.name}</span>
                </div>
                <span className="text-xs text-blue-500 font-bold ml-2">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#151515] rounded-b-[2rem] flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-[#222] transition-colors">
            Cancel
          </button>
          <button type="submit" form="import-data-form" disabled={!file || loading} className="px-8 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center min-w-[140px]">
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : 'Import Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportDataModal;
