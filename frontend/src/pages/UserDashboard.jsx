import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsService, complaintService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryIcon from '../components/CategoryIcon';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export default function UserDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, complaintsRes] = await Promise.all([
        analyticsService.getDashboard(),
        complaintService.getMy({ limit: 5 })
      ]);

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }
      if (complaintsRes.data.success) {
        setRecentComplaints(complaintsRes.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load user dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const summary = analytics?.summary || {
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0
  };

  const statCards = [
    {
      title: 'Total Grievances',
      value: summary.totalComplaints,
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      desc: 'All registered complaints'
    },
    {
      title: 'Pending Review',
      value: summary.pendingComplaints,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      desc: 'Awaiting officer allocation'
    },
    {
      title: 'In Progress',
      value: summary.inProgressComplaints,
      icon: RefreshCw,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
      desc: 'Under active department action'
    },
    {
      title: 'Resolved',
      value: summary.resolvedComplaints,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      desc: 'Successfully closed cases'
    }
  ];

  const statusColors = ['#f59e0b', '#6366f1', '#06b6d4', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Grievance Dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
            <span>Citizen Redressal Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Track your open grievances, review municipal staff responses, or submit a new community issue for swift action.
          </p>
        </div>
        <Link
          to="/submit-complaint"
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] shrink-0"
        >
          <PlusCircle size={18} />
          <span>Quick Submit Grievance</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm card-hover flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <span className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={20} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {card.value}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1">
                  {card.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <PieIcon size={16} className="text-indigo-600" />
                Grievance Status Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution across resolution lifecycle</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {analytics?.statusDistribution && analytics.statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {analytics.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No complaint status data to display yet.
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-600" />
                Category-wise Complaints
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Top filed sectors & civic domains</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {analytics?.categoryDistribution && analytics.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryDistribution.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No category breakdown data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Complaints
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Your latest filed issues and their current states</p>
          </div>
          <Link
            to="/my-complaints"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentComplaints.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FileText size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Complaints Submitted Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Have a local issue that needs government or community attention? Submit a complaint in under 2 minutes.
              </p>
              <Link
                to="/submit-complaint"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors mt-2"
              >
                <PlusCircle size={15} />
                <span>Submit Grievance</span>
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Complaint Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentComplaints.map((comp) => (
                  <tr key={comp._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {comp.trackingId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {comp.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon category={comp.category} size={15} />
                        <span className="font-medium text-slate-700">{comp.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={comp.priority} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={comp.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/complaint/${comp._id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-semibold transition-colors inline-block"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
