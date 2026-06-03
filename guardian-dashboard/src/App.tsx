import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import TouristsPage from '@/pages/TouristsPage';
import AlertsPage from '@/pages/AlertsPage';
import TouristDetailPage from '@/pages/TouristDetailPage';
import Layout from '@/components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/tourists" element={<ProtectedRoute><Layout><TouristsPage /></Layout></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Layout><AlertsPage /></Layout></ProtectedRoute>} />
      <Route path="/tourist/:touristId" element={<ProtectedRoute><Layout><TouristDetailPage /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
