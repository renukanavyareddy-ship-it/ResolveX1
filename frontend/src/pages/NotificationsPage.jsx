import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  ArrowRight,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getMy();
      if (res.data.success) {
        setNotifications(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markRead(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.success('Marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      notificationService.markRead(n._id).catch(console.error);
    }
    if (n.complaintId) {
      navigate(isAdmin ? `/admin/complaints` : `/complaint/${n.complaintId}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status alerts, department dispatches, and supervisor communications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <CheckCheck size={15} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Loading Notifications...
            </span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are completely up to date. You will receive notifications when complaint statuses change or responses are posted.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-4 ${
                  !n.isRead ? 'bg-indigo-50/40' : ''
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                    !n.isRead ? 'bg-indigo-600' : 'bg-transparent'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{n.title}</span>
                    {n.trackingId && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold">
                        {n.trackingId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[11px] text-slate-400 font-mono mt-2 block">
                    {new Date(n.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!n.isRead && (
                    <button
                      onClick={(e) => handleMarkRead(n._id, e)}
                      title="Mark as read"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <ArrowRight size={16} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
