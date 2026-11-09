import React, { useState, useEffect } from 'react';
import { analyticsService, complaintService } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Download,
  Building2,
  CheckCircle2,
  Clock,
  PieChart as PieIcon,
  Percent,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getDashboard();
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const summary = analytics?.summary || {};
  const departmentStats = analytics?.departmentStats || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Aggregating Department Performance Analytics...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Department Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Statistical breakdown of resolution rates, department dispatch efficiency, and municipal workloads.
          </p>
        </div>

        <a
          href={complaintService.exportCSVUrl()}
          download
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all self-start sm:self-auto"
        >
          <Download size={15} />
          <span>Export Full Analytics CSV</span>
        </a>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Resolution Efficacy
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">
              {summary.resolutionRate || 0}%
            </span>
            <span className="text-[11px] text-slate-400">Total complaints closed</span>
          </div>
          <span className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Percent size={24} />
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Avg Turnaround Time
            </span>
            <span className="text-3xl font-extrabold text-indigo-600 mt-1 block">
              {summary.avgResolutionDays || 0} Days
            </span>
            <span className="text-[11px] text-slate-400">From filing to verification</span>
          </div>
          <span className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Clock size={24} />
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Resolved Cases
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {summary.resolvedComplaints || 0}
            </span>
            <span className="text-[11px] text-slate-400">Quality checked</span>
          </div>
          <span className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <CheckCircle2 size={24} />
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Critical Urgency Ratio
            </span>
            <span className="text-3xl font-extrabold text-rose-600 mt-1 block">
              {summary.criticalComplaints || 0}
            </span>
            <span className="text-[11px] text-slate-400">Total critical hazards</span>
          </div>
          <span className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <TrendingUp size={24} />
          </span>
        </div>
      </div>

      {/* Department Performance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-indigo-600" />
              Department Redressal Performance Scorecard
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative assessment of complaints handled versus successfully resolved
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {departmentStats.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No department-specific assignments recorded yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Department / Civic Body</th>
                  <th className="py-3.5 px-4 text-center">Total Assigned</th>
                  <th className="py-3.5 px-4 text-center">Resolved</th>
                  <th className="py-3.5 px-4">Completion Progress</th>
                  <th className="py-3.5 px-4 text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentStats.map((dept, index) => (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {dept.department}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      {dept.total}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-emerald-600">
                      {dept.resolved}
                    </td>
                    <td className="py-4 px-4 min-w-[180px]">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${dept.resolutionRate}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-block font-extrabold text-xs px-2.5 py-1 rounded-full ${
                          dept.resolutionRate >= 70
                            ? 'bg-emerald-50 text-emerald-700'
                            : dept.resolutionRate >= 40
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {dept.resolutionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Monthly Trend Detailed Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={16} className="text-indigo-600" />
            Monthly Resolution Inflow vs Outflow
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Historical trajectory over time</p>
        </div>

        <div className="h-72 w-full">
          {analytics?.monthlyTrend && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
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
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="total" name="Incoming Complaints" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved & Verified" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
