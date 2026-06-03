import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiSettings, FiLogOut, FiBell, FiSearch, FiHelpCircle, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  }

  // Global Toast System
  const [toast, setToast] = useState({ message: '', visible: false });
  useEffect(() => {
    const handleToast = (e: any) => {
      setToast({ message: e.detail, visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const triggerToast = (message: string) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: message }));
  };

  const menu = [
    { name: 'Dashboard', icon: <FiGrid />, path: '/' },
    { name: 'Tourists', icon: <FiUsers />, path: '/tourists' },
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-white dark:bg-black text-slate-800 dark:text-white font-sans transition-colors duration-300">
        {/* Sidebar */}
        <div className="w-[260px] bg-white dark:bg-[#111] border-r border-gray-100 dark:border-[#222] flex flex-col pt-8 pb-6 px-6 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold">
              <div className="w-4 h-4 border-2 border-emerald-300 rounded-full"></div>
            </div>
            <span className="font-bold text-xl tracking-tight dark:text-white">Guardian</span>
          </div>
          
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider mb-4">
            MENU
          </div>
          <nav className="flex-1 space-y-2">
            {menu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-[#e5f0ea] dark:bg-emerald-900/30 text-[#1b5e3a] dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-[#222]/50 dark:hover:text-slate-200'}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider mb-4">
            GENERAL
          </div>
          <div className="space-y-2 mb-8">
            <button onClick={() => triggerToast('Settings panel is coming soon!')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 font-medium hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#222]/50 dark:hover:text-slate-200 transition-colors">
              <FiSettings className="text-lg" /> Settings
            </button>
            <button onClick={() => triggerToast('Help documentation is being updated.')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 font-medium hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#222]/50 dark:hover:text-slate-200 transition-colors">
              <FiHelpCircle className="text-lg" /> Help
            </button>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <FiLogOut className="text-lg" /> Logout
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Topbar */}
          <header className="h-20 flex items-center justify-between px-10 bg-white dark:bg-black transition-colors border-b border-gray-100 dark:border-[#222]">
            <div className="relative w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search task" className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] outline-none focus:border-emerald-500 text-sm dark:text-gray-200 transition-colors" />
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors shadow-sm"
              >
                {isDarkMode ? <FiSun /> : <FiMoon />}
              </button>
              <button 
                onClick={() => triggerToast('No new notifications.')}
                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                <FiBell />
              </button>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] pl-2 pr-4 py-1.5 rounded-full transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight dark:text-gray-200">{user?.username || 'Admin'}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Authority</span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page Area */}
          <main className="flex-1 overflow-auto px-10 pb-10 pt-6">
            {children}
          </main>
        </div>
      </div>

      {/* Global Toast */}
      {toast.visible && (
        <div className="fixed bottom-8 right-8 bg-[#1b5e3a] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up z-[999]">
          <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
          <span className="font-semibold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
};
export default Layout;
