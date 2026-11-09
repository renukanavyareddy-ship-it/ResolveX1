import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService, complaintService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryIcon from '../components/CategoryIcon';
import {
  Users,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertOctagon,
  Download,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Building,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [criticalComplaints, setCriticalComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, criticalRes] = await Promise.all([
        analyticsService.getDashboard(),
        complaintService.getAll({ priority: 'Critical', limit: 5 })
      ]);

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }
      if (criticalRes.data.success) {
        setCriticalComplaints(criticalRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const summary = analytics?.summary || {
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    criticalComplaints: 0,
    totalUsers: 0,
    resolutionRate: 0,
    avgResolutionDays: 0
  };

  const statCards = [
    {
      title: 'Total Complaints',
      value: summary.totalComplaints,
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      desc: 'All civic grievances'
    },
    {
      title: 'Pending Review',
      value: summary.pendingComplaints,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      desc: 'Requires initial triaging'
    },
    {
      title: 'Active In Progress',
      value: summary.inProgressComplaints,
      icon: RefreshCw,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
      desc: 'Field teams working'
    },
    {
      title: 'Resolved Cases',
      value: summary.resolvedComplaints,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      desc: 'Verified complete'
    },
    {
      title: 'Critical Hazards',
      value: summary.criticalComplaints,
      icon: AlertOctagon,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100',
      desc: 'High emergency risk'
    },
    {
      title: 'Registered Citizens',
      value: summary.totalUsers,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-100',
      desc: 'Active community users'
    }
  ];

  const statusColors = ['#f59e0b', '#6366f1', '#06b6d4', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Initializing Administrator Control Panel...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
              Administration Central Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Grievance Redressal Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time municipal telemetry, department workload, and emergency hazard response.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={complaintService.exportCSVUrl()}
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-colors"
          >
            <Download size={14} className="text-indigo-600" />
            <span>Export CSV</span>
          </a>
          <Link
            to="/admin/complaints"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
          >
            <span>Manage Complaints</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm card-hover flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {card.title}
                </span>
                <span className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon size={16} />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-extrabold text-slate-900 block">
                  {card.value}
                </span>
                <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                  {card.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Efficiency Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Resolution Performance Benchmark
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {summary.resolutionRate}% Overall Resolution Rate
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Average civic resolution turnaround: <strong>{summary.avgResolutionDays} days</strong> across all 10 departments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/analytics"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
          >
            View Department Analytics &rarr;
          </Link>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={16} className="text-indigo-600" />
                Monthly Complaint & Resolution Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Reported volume vs resolved cases over last 6 months</p>
            </div>
          </div>

          <div className="h-72 w-full">
            {analytics?.monthlyTrend && analytics.monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="resolvedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
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
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="total" name="Total Filed" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#totalColor)" />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#resolvedColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No monthly timeline data available.
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PieIcon size={16} className="text-indigo-600" />
              Status Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Active complaint disposition</p>
          </div>

          <div className="h-72 w-full">
            {analytics?.statusDistribution && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
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
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building size={16} className="text-indigo-600" />
              Category-wise Incident Volume
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Complaints sorted across all 10 civic disciplines</p>
          </div>
        </div>

        <div className="h-64 w-full">
          {analytics?.categoryDistribution && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                />
                <Bar dataKey="count" name="Complaints" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Urgent Critical Complaints Alert Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertOctagon size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Critical Priority Hazards Requiring Immediate Action
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">High-impact civic concerns flagged with top urgency</p>
            </div>
          </div>
          <Link
            to="/admin/complaints?priority=Critical"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>View All Critical</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {criticalComplaints.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No active critical complaints pending. All critical hazards resolved!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Citizen</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalComplaints.map((comp) => (
                  <tr key={comp._id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                      {comp.trackingId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {comp.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon category={comp.category} size={15} />
                        <span>{comp.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {comp.userId?.name || 'Citizen'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {comp.department || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={comp.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/complaint/${comp._id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold transition-all inline-block shadow-sm"
                      >
                        Dispatch / Manage
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
