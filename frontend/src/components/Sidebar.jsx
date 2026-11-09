import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Search,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Users,
  BarChart3,
  CheckCircle2,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Submit Complaint', path: '/submit-complaint', icon: PlusCircle },
    { name: 'My Complaints', path: '/my-complaints', icon: FileText },
    { name: 'Track Status', path: '/track', icon: Search },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'All Complaints', path: '/admin/complaints', icon: FileText },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Citizen Directory', path: '/admin/users', icon: Users },
    { name: 'Track Complaint', path: '/track', icon: Search },
    { name: 'Admin Profile', path: '/profile', icon: User }
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              Resolve<span className="text-indigo-400">X</span>
            </span>
            <span className="block text-[10px] font-semibold text-indigo-400/90 tracking-wider uppercase -mt-0.5">
              {isAdmin ? 'Admin Console' : 'Citizen Portal'}
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-[11px] text-slate-400 font-medium capitalize truncate">
                  {isAdmin ? 'System Admin' : 'Verified Citizen'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 pt-1 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            Menu Navigation
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/dashboard' || link.path === '/admin'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Submit button for Citizen */}
        {!isAdmin && (
          <div className="p-3">
            <NavLink
              to="/submit-complaint"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle size={16} />
              <span>Submit Grievance</span>
            </NavLink>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
