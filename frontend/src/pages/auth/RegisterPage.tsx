import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Siren,
  User,
  Car,
  Building2,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ArrowRight,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['patient', 'driver', 'hospital']),

  // Patient fields
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  address: z.string().optional(),

  // Driver fields
  licenseNumber: z.string().optional(),
  experienceYears: z.coerce.number().optional(),
  vehicleType: z.string().optional(),

  // Hospital fields
  hospitalName: z.string().optional(),
  emergencyHotline: z.string().optional(),
  traumaLevel: z.coerce.number().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'driver' | 'hospital'>('patient');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'patient',
      bloodGroup: 'O+',
      vehicleType: 'ALS',
      traumaLevel: 1,
    },
  });

  const handleRoleChange = (role: 'patient' | 'driver' | 'hospital') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const user = await registerUser({
        name: data.role === 'hospital' ? data.hospitalName || data.name : data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
        bloodGroup: data.bloodGroup,
        allergies: data.allergies ? data.allergies.split(',').map((s) => s.trim()) : [],
        address: data.address,
        licenseNumber: data.licenseNumber,
        experienceYears: data.experienceYears,
        hospitalName: data.hospitalName,
        emergencyHotline: data.emergencyHotline,
      });

      navigate(`/dashboard/${user.role}`);
    } catch {
      // Error in store
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-healthcare-600 flex items-center justify-center text-white mx-auto shadow-md mb-3">
            <Siren className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Join the SmartPulse AI Emergency Network as a Citizen, Paramedic, or Hospital Partner
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Registration Type:
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleRoleChange('patient')}
              className={`py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'patient'
                  ? 'bg-white text-healthcare-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen / Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('driver')}
              className={`py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'driver'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Ambulance Driver</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('hospital')}
              className={`py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'hospital'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hospital Desk</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-emergency-50 border border-emergency-200 text-xs text-emergency-700">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('role')} />

          {/* Common Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {selectedRole === 'hospital' ? 'Contact Person Name' : 'Full Name'}
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder={selectedRole === 'hospital' ? 'Dr. Sarah Connor' : 'Johnathan Miller'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 text-sm"
              />
              {errors.name && <p className="text-xs text-emergency-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 text-sm"
              />
              {errors.email && <p className="text-xs text-emergency-600 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Phone
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 text-sm"
              />
              {errors.phone && <p className="text-xs text-emergency-600 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 text-sm"
              />
              {errors.password && (
                <p className="text-xs text-emergency-600 mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Patient Specific Fields */}
          {selectedRole === 'patient' && (
            <div className="pt-2 border-t border-slate-200/80 space-y-3">
              <div className="text-xs font-bold text-healthcare-700 uppercase tracking-wider">
                Medical Triage Information (Optional)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    {...register('bloodGroup')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Known Allergies (comma separated)
                  </label>
                  <input
                    {...register('allergies')}
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts, Sulfa"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Home Address / District</label>
                <input
                  {...register('address')}
                  type="text"
                  placeholder="45 Lakeview Blvd, Apt 4B, Metro District"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          )}

          {/* Driver Specific Fields */}
          {selectedRole === 'driver' && (
            <div className="pt-2 border-t border-slate-200/80 space-y-3">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Paramedic & Vehicle Verification Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Commercial / Paramedic License No.
                  </label>
                  <input
                    {...register('licenseNumber')}
                    type="text"
                    placeholder="DL-MED-992014"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Experience in Emergency Driving (Years)
                  </label>
                  <input
                    {...register('experienceYears')}
                    type="number"
                    min="1"
                    placeholder="5"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hospital Specific Fields */}
          {selectedRole === 'hospital' && (
            <div className="pt-2 border-t border-slate-200/80 space-y-3">
              <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Hospital Institution Profile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Name</label>
                  <input
                    {...register('hospitalName')}
                    type="text"
                    placeholder="Metro City Apex Trauma Center"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Direct Hotline
                  </label>
                  <input
                    {...register('emergencyHotline')}
                    type="text"
                    placeholder="1-800-METRO-911"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete {selectedRole.toUpperCase()} Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-healthcare-600 hover:text-healthcare-800">
            Log in to your portal
          </Link>
        </div>
      </div>
    </div>
  );
};

