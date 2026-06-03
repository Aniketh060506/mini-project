import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiKey, FiUser, FiMail } from 'react-icons/fi';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, requiresNewPassword, setNewPassword: confirmNewPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (!requiresNewPassword) navigate('/');
    } catch {}
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmNewPassword!(newPassword, fullName);
      navigate('/');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black transition-colors font-sans">
      <div className="bg-white dark:bg-[#111] rounded-[2rem] p-10 w-full max-w-md border border-gray-100 dark:border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-colors">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#1b5e3a] flex items-center justify-center text-white font-bold">
            <div className="w-5 h-5 border-2 border-emerald-300 rounded-full"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-800 dark:text-white transition-colors">Guardian</span>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
            {requiresNewPassword ? 'Set New Password' : 'Authority Login'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2 transition-colors">
            {requiresNewPassword ? 'First login requires a password change' : 'Sign in to monitor tourist safety'}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm font-medium rounded-xl p-3 mb-6 border border-red-100">{error}</div>}

        {requiresNewPassword ? (
          <form onSubmit={handleNewPassword} className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input required type="text" placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#222] focus:bg-white dark:focus:bg-[#222] focus:border-[#1b5e3a] outline-none text-slate-800 dark:text-white font-medium transition-colors" />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input required type={showPassword ? 'text' : 'password'} placeholder="Enter your new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#222] focus:bg-white dark:focus:bg-[#222] focus:border-[#1b5e3a] outline-none text-slate-800 dark:text-white font-medium transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 mt-2 rounded-xl bg-[#1b5e3a] text-white font-semibold hover:bg-[#14472d] transition-colors">
              {loading ? 'Saving...' : 'Set Password & Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input required type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#222] focus:bg-white dark:focus:bg-[#222] focus:border-[#1b5e3a] outline-none text-slate-800 dark:text-white font-medium transition-colors" />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input required type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-[#222] focus:bg-white dark:focus:bg-[#222] focus:border-[#1b5e3a] outline-none text-slate-800 dark:text-white font-medium transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 mt-2 rounded-xl bg-[#1b5e3a] text-white font-semibold hover:bg-[#14472d] transition-colors">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default LoginPage;
