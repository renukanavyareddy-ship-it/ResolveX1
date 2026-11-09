import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, UserCheck, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-2">
            <ShieldCheck size={26} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to ResolveX
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your grievance dashboard or municipal administration panel
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Helpers */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-indigo-950 font-bold">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-indigo-600" />
              Demo Testing Accounts (Click to Fill):
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@resolvex.com', 'Admin@123')}
              className="p-2 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-slate-700 font-semibold text-left transition-all shadow-sm flex flex-col"
            >
              <span className="text-[10px] uppercase font-bold text-indigo-600">👑 Admin Account</span>
              <span className="font-mono text-[11px] truncate">admin@resolvex.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('rahul.sharma@example.com', 'User@123')}
              className="p-2 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-slate-700 font-semibold text-left transition-all shadow-sm flex flex-col"
            >
              <span className="text-[10px] uppercase font-bold text-indigo-600">👤 Citizen Rahul</span>
              <span className="font-mono text-[11px] truncate">rahul.sharma@example.com</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {submitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Register as Citizen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
