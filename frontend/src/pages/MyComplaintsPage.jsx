import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryIcon, { CATEGORIES, STATUSES } from '../components/CategoryIcon';
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  Calendar,
  MapPin,
  ArrowRight,
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const res = await complaintService.getMy(params);
      if (res.data.success) {
        setComplaints(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load my complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedStatus, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Registered Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review the real-time status, department feedback, and official timeline of all your filed grievances.
          </p>
        </div>
        <Link
          to="/submit-complaint"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <PlusCircle size={16} />
          <span>New Grievance</span>
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="sm:col-span-5 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Title, Tracking ID or Keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </form>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="sm:col-span-1 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'table' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'cards' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading Complaints...
          </span>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Complaints Match Your Criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filters or submit a new grievance to the city administration.
          </p>
          <div className="pt-2">
            <Link
              to="/submit-complaint"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle size={15} />
              <span>Submit a Complaint</span>
            </Link>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Tracking ID</th>
                  <th className="py-3.5 px-4">Grievance Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((comp) => (
                  <tr key={comp._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-indigo-600">
                      {comp.trackingId}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900 max-w-sm">
                      <div className="truncate">{comp.title}</div>
                      {comp.location?.address && (
                        <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                          {comp.location.address}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon category={comp.category} size={15} />
                        <span className="font-medium text-slate-700">{comp.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <PriorityBadge priority={comp.priority} size="xs" />
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={comp.status} size="xs" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/complaint/${comp._id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                      >
                        <span>View Details</span>
                        <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {complaints.map((comp) => (
            <div
              key={comp._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm card-hover flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {comp.trackingId}
                  </span>
                  <StatusBadge status={comp.status} size="xs" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-2">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <CategoryIcon category={comp.category} size={14} />
                    <span className="font-semibold">{comp.category}</span>
                  </div>
                  <PriorityBadge priority={comp.priority} size="xs" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(comp.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/complaint/${comp._id}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
