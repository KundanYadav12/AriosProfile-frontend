import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isExpired = new URLSearchParams(location.search).get('session_expired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome to Ariso Superadmin');
      navigate('/superadmin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-ariso-600 flex items-center justify-center text-white shadow-lg shadow-ariso-600/20">
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
              <path d="M8 22L16 8L24 22H19.5L16 15.5L12.5 22H8Z" fill="currentColor" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            ARISO
          </span>
        </Link>
        <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Superadmin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to manage company website content and products
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-200/80">
          
          {isExpired && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Your session expired. Please log in again.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ariso.in"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 focus:ring-2 focus:ring-ariso-500/20 text-slate-900 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/superadmin/forgot-password"
                  className="text-xs font-semibold text-ariso-600 hover:text-ariso-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 focus:ring-2 focus:ring-ariso-500/20 text-slate-900 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md shadow-ariso-600/20 hover:shadow-ariso-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 flex items-center gap-1">
              ← Return to public website
            </Link>
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>TLS / SHA-256</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
