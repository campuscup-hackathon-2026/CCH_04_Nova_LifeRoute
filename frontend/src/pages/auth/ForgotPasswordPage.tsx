import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Siren, Mail, KeyRound, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('patient@demo.com');
  const [otp, setOtp] = useState('948216');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await authService.requestPasswordReset(email);
      setMessage(res.message);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.verifyOtpAndReset(email, otp, newPassword);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-healthcare-50 text-healthcare-600 flex items-center justify-center mx-auto shadow-sm mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulated secure recovery process for emergency credentials
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-emergency-50 border border-emergency-200 text-xs text-emergency-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-healthcare-50 border border-healthcare-200 text-xs text-healthcare-800">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="patient@demo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-healthcare-600 hover:bg-healthcare-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {isLoading ? 'Sending Code...' : 'Send Recovery OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  6-Digit OTP Code
                </label>
                <span className="text-[11px] text-healthcare-600 font-semibold">Demo code: 948216</span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-healthcare-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Secure Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {isLoading ? 'Resetting Password...' : 'Verify OTP & Set Password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Password Reset Successful</h3>
            <p className="text-xs text-slate-500">
              Your credentials have been securely updated. You can now log into your portal.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-950 transition"
            >
              <span>Back to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

