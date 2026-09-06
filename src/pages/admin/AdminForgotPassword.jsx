import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { authAPI } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setSubmitted(true);
      if (res.data?.devResetUrl) {
        setDevResetUrl(res.data.devResetUrl);
      }
      toast.success(res.data?.message || 'Reset link dispatched.');
    } catch (err) {
      toast.error('Failed to dispatch reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-ariso-600 flex items-center justify-center text-white shadow-lg shadow-ariso-600/20">
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
              <path d="M8 22L16 8L24 22H19.5L16 15.5L12.5 22H8Z" fill="currentColor" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            ARISO
          </span>
        </Link>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Reset Superadmin Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your registered email address to receive a single-use secure reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-200/80">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Check Your Inbox</h3>
              <p className="text-sm text-slate-600 mb-6">
                If the email is registered, we have sent instructions to reset your password.
              </p>

              {devResetUrl && (
                <div className="p-3 mb-6 bg-slate-50 border border-slate-200 rounded-xl text-left">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Dev Mode Instant Link:</span>
                  <a href={devResetUrl} className="text-xs text-ariso-600 font-mono break-all hover:underline">
                    {devResetUrl}
                  </a>
                </div>
              )}

              <Link
                to="/superadmin/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ariso-600 hover:text-ariso-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Registered Admin Email
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md shadow-ariso-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <Link
                  to="/superadmin/login"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
