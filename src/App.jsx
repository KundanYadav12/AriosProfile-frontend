import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SiteDataProvider } from './context/SiteDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Public Pages
import HomePage from './pages/HomePage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProducts from './pages/admin/AdminProducts';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminMedia from './pages/admin/AdminMedia';
import AdminTestimonials from './pages/admin/AdminTestimonials';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 rounded-full border-2 border-ariso-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SiteDataProvider>
          <Routes>
            {/* Public Website */}
            <Route path="/" element={<HomePage />} />

            {/* Superadmin Auth Routes */}
            <Route path="/superadmin/login" element={<AdminLogin />} />
            <Route path="/superadmin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/superadmin/reset-password" element={<AdminResetPassword />} />

            {/* Superadmin Protected CMS */}
            <Route
              path="/superadmin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SiteDataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
