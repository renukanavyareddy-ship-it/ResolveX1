import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Search,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Track Complaint', path: '/track' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck size={22} strokeWidth={2.2} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                Resolve<span className="text-indigo-600">X</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Grievance Redressal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-white text-indigo-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/track"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <Search size={14} />
              <span>Track Status</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
                >
                  <LayoutDashboard size={14} />
                  <span>{isAdmin ? 'Admin Portal' : 'My Dashboard'}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02]"
                >
                  <span>Submit Complaint</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-sm"
                >
                  <LayoutDashboard size={16} />
                  <span>{isAdmin ? 'Admin Portal' : 'My Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-rose-600 bg-rose-50 text-sm font-semibold"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm"
                >
                  Register / Submit Complaint
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
