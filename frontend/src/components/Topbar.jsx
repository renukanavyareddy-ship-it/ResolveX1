import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import {
  Menu,
  Bell,
  Search,
  Check,
  CheckCheck,
  ExternalLink,
  User,
  Shield,
  Clock
} from 'lucide-react';

export default function Topbar({ onMenuClick, title }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getMy();
      if (res.data.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // refresh every 20s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markRead(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchTrackingId.trim()) {
      navigate(`/track?id=${searchTrackingId.trim().toUpperCase()}`);
      setSearchTrackingId('');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        {title && (
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {title}
          </h1>
        )}
      </div>

      {/* Middle: Quick Tracking ID search */}
      <form onSubmit={handleQuickSearch} className="hidden md:flex items-center relative max-w-xs w-full">
        <Search size={15} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          placeholder="Track ID (e.g. RX-202611-1001)"
          value={searchTrackingId}
          onChange={(e) => setSearchTrackingId(e.target)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
        />
      </form>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Real-time notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                  >
                    <CheckCheck size={13} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No notifications yet. You're completely up to date!
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        setDropdownOpen(false);
                        if (n.complaintId) {
                          navigate(isAdmin ? `/admin/complaints` : `/complaint/${n.complaintId}`);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                        !n.isRead ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-indigo-600' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(n._id, e)}
                          title="Mark read"
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                        >
                          <Check size={13} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setDropdownOpen(false)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View all notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-slate-800 leading-tight">
              {user?.name || 'My Account'}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium capitalize -mt-0.5">
              {isAdmin ? 'Administrator' : 'Citizen'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
