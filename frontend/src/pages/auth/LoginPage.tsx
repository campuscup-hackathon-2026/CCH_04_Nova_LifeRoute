import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Siren,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Car,
  Building2,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, switchDemoRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'patient@demo.com',
      password: 'password123',
    },
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    clearError();
    // Fill demo credentials
    if (role === 'patient') {
      setValue('email', 'patient@demo.com');
      setValue('password', 'password123');
    } else if (role === 'driver') {
      setValue('email', 'driver@demo.com');
      setValue('password', 'password123');
    } else if (role === 'hospital') {
      setValue('email', 'hospital@demo.com');
      setValue('password', 'password123');
    } else if (role === 'admin') {
      setValue('email', 'admin@demo.com');
      setValue('password', 'password123');
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login({
        email: data.email,
        password: data.password,
        role: selectedRole,
      });
      navigate(`/dashboard/${user.role}`);
    } catch {
      // Error handled in store
    }
  };

  const getDashboardPath = (role: UserRole) => `/dashboard/${role}`;

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200/90">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-healthcare-700 to-emergency-600 flex items-center justify-center text-white mx-auto shadow-md mb-3">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Sign in to SmartPulse AI
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your healthcare dashboard, dispatch telemetry, or fleet controls
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Role:
          </div>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleSelect('patient')}
              className={`py-2 rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'patient'
                  ? 'bg-white text-healthcare-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('driver')}
              className={`py-2 rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'driver'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Driver</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('hospital')}
              className={`py-2 rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'hospital'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospital</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2 rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'admin'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Demo One-Click Login Callout */}
        <div className="mb-6 p-3 rounded-xl bg-healthcare-50 border border-healthcare-200 text-xs text-healthcare-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-healthcare-600 shrink-0" />
            <span>Demo credentials pre-filled for <b>{selectedRole}</b></span>
          </div>
          <button
            type="button"
            onClick={() => {
              switchDemoRole(selectedRole);
              navigate(getDashboardPath(selectedRole));
            }}
            className="font-bold underline text-healthcare-700 hover:text-healthcare-900"
          >
            Instant Skip →
          </button>
        </div>

        {/* Form Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-emergency-50 border border-emergency-200 text-xs text-emergency-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('email')}
                type="email"
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-healthcare-500 text-sm transition"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-emergency-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-healthcare-600 hover:text-healthcare-800 transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-healthcare-500 text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-emergency-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-healthcare-600 hover:bg-healthcare-700 text-white font-bold text-sm shadow-md hover:shadow-healthcare-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-healthcare-600 hover:text-healthcare-800">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

