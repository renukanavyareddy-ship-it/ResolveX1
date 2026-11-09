import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  CheckCircle2,
  Calendar,
  Save,
  KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
  const { user, updateUser, isAdmin } = useAuth();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await authService.updateProfile({ name, phone, address });
      if (res.data.success) {
        updateUser(res.data.data);
        toast.success('Profile details updated successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (res.data.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your personal contact details, residential location, and authentication credentials.
        </p>
      </div>

      {/* User Info Overview Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isAdmin ? 'System Administrator' : 'Verified Citizen'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <p className="text-[11px] text-slate-400 font-mono pt-1">
            Account created on: {new Date(user?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User size={16} className="text-indigo-600" />
            Contact & Address Details
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 555-0192"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Residential Address / Area
              </label>
              <textarea
                rows={3}
                placeholder="Sector, Street, Apartment..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Save size={14} />
              <span>{savingProfile ? 'Saving...' : 'Update Profile Details'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <KeyRound size={16} className="text-indigo-600" />
            Security & Password
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password (Min 6 characters) *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock size={14} />
                <span>{savingPassword ? 'Updating...' : 'Change Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
