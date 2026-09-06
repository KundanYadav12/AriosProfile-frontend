import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') || '';
  const email = queryParams.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword({ token, email, newPassword });
      if (res.data?.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset token.');
      toast.error(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Create New Superadmin Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Set a strong password for <span className="font-semibold text-slate-800">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-200/80">
          
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Password Reset Complete</h3>
              <p className="text-sm text-slate-600 mb-6">
                Your password has been updated. You can now log into Superadmin with your new credentials.
              </p>
              <Link
                to="/superadmin/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 focus:ring-2 focus:ring-ariso-500/20 text-slate-900 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-ariso-500 focus:ring-2 focus:ring-ariso-500/20 text-slate-900 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3.5 rounded-xl bg-ariso-600 hover:bg-ariso-700 text-white font-bold text-sm shadow-md shadow-ariso-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
