import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signOut, getCurrentUser, confirmSignIn } from 'aws-amplify/auth';

type AuthContextType = {
  user: any;
  login: (u: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  requiresNewPassword?: boolean;
  setNewPassword?: (newPassword: string, name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresNewPassword, setRequiresNewPassword] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (e: string, p: string) => {
    setLoading(true); setError(null); setRequiresNewPassword(false);
    try {
      const res = await signIn({ username: e, password: p });
      if (res.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setRequiresNewPassword(true);
      } else if (res.nextStep.signInStep === 'DONE') {
        await checkUser();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmNewPassword = async (newPassword: string, name: string) => {
    setLoading(true); setError(null);
    try {
      await confirmSignIn({
        challengeResponse: newPassword,
        options: { userAttributes: { name: name } }
      });
      setRequiresNewPassword(false);
      await checkUser();
    } catch (err: any) {
      setError(err.message || 'Password update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (e) { console.error(e); }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, requiresNewPassword, setNewPassword: confirmNewPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
