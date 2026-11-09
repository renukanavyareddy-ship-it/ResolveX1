import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryIcon, { CATEGORIES, PRIORITIES, STATUSES } from '../components/CategoryIcon';
import {
  Search,
  Filter,
  Download,
  Eye,
  Sliders,
  CheckCircle2,
  Building2,
  UserCheck,
  MessageSquare,
  FileEdit,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DEPARTMENTS = [
  'Water Supply & Sewerage Board',
  'State Electricity Transmission Board',
  'Public Works Department (PWD)',
  'Municipal Sanitation Department',
  'Parks & Recreation Electrical Wing',
  'Traffic Police & Road Safety Cell',
  'Department of Public Education & Infrastructure',
  'Directorate of Health Services',
  'Urban Development & Railway Engineering Authority',
  'Pollution Control Board',
  'General Administration'
];

export default function AdminComplaintsPage() {
  const [searchParams] = useSearchParams();

  const [complaints, setComplaints] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'All');
  const [department, setDepartment] = useState('All');

  // Management Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalTab, setModalTab] = useState('status'); // 'status' | 'assign' | 'response' | 'note' | 'priority'
  const [saving, setSaving] = useState(false);

  // Form states in modal
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [statusAdminResponse, setStatusAdminResponse] = useState('');

  const [assignDept, setAssignDept] = useState('');
  const [assignStaffName, setAssignStaffName] = useState('');
  const [assignStaffEmail, setAssignStaffEmail] = useState('');

  const [newPriority, setNewPriority] = useState('Medium');
  const [adminResponseMsg, setAdminResponseMsg] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');

  const fetchComplaints = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      if (priority !== 'All') params.priority = priority;
      if (department !== 'All') params.department = department;

      const res = await complaintService.getAll(params);
      if (res.data.success) {
        setComplaints(res.data.data || []);
        setTotalCount(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(1);
  }, [category, status, priority, department]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints(1);
  };

  const openManageModal = (comp, tab = 'status') => {
    setSelectedComplaint(comp);
    setModalTab(tab);
    setNewStatus(comp.status);
    setStatusComment('');
    setStatusAdminResponse(comp.adminResponse?.message || '');
    setAssignDept(comp.department || DEPARTMENTS[0]);
    setAssignStaffName(comp.assignedTo?.name || '');
    setAssignStaffEmail(comp.assignedTo?.email || '');
    setNewPriority(comp.priority);
    setAdminResponseMsg(comp.adminResponse?.message || '');
    setInternalNoteText('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await complaintService.updateStatus(selectedComplaint._id, {
        status: newStatus,
        comment: statusComment,
        adminResponse: statusAdminResponse
      });
      if (res.data.success) {
        toast.success(`Complaint status updated to ${newStatus}`);
        setSelectedComplaint(null);
        fetchComplaints(currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await complaintService.assign(selectedComplaint._id, {
        department: assignDept,
        staffName: assignStaffName,
        staffEmail: assignStaffEmail
      });
      if (res.data.success) {
        toast.success(`Complaint assigned to ${assignDept}`);
        setSelectedComplaint(null);
        fetchComplaints(currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePriority = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await complaintService.updatePriority(selectedComplaint._id, {
        priority: newPriority
      });
      if (res.data.success) {
        toast.success(`Priority updated to ${newPriority}`);
        setSelectedComplaint(null);
        fetchComplaints(currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Priority update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddResponse = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await complaintService.addResponse(selectedComplaint._id, {
        message: adminResponseMsg
      });
      if (res.data.success) {
        toast.success('Official response posted and notification sent to citizen');
        setSelectedComplaint(null);
        fetchComplaints(currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post response');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await complaintService.addInternalNote(selectedComplaint._id, {
        note: internalNoteText
      });
      if (res.data.success) {
        toast.success('Internal staff note added to case file');
        setSelectedComplaint(null);
        fetchComplaints(currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add note');
    } finally {
      setSaving(false);
    }
  };

  // Build CSV Export URL with active filters
  const csvDownloadUrl = complaintService.exportCSVUrl({
    category: category !== 'All' ? category : undefined,
    status: status !== 'All' ? status : undefined,
    priority: priority !== 'All' ? priority : undefined
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complaint Redressal Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, filter, assign, and resolve civic complaints across all city departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={csvDownloadUrl}
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-colors"
          >
            <Download size={15} className="text-indigo-600" />
            <span>Export Filtered CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-4 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Tracking ID, Title, or Citizen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </form>

          {/* Status Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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

          {/* Priority Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="All">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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

          {/* Department Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer truncate"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applied filters summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{complaints.length}</strong> of <strong>{totalCount}</strong> grievances found
          </span>
          {(category !== 'All' || status !== 'All' || priority !== 'All' || department !== 'All' || search) && (
            <button
              onClick={() => {
                setCategory('All');
                setStatus('All');
                setPriority('All');
                setDepartment('All');
                setSearch('');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Loading Complaints Database...
              </span>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-16 text-center text-slate-500 text-xs">
              No complaints found matching the selected criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Tracking ID</th>
                  <th className="py-3.5 px-4">Complaint Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Citizen</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((comp) => (
                  <tr key={comp._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {comp.trackingId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                      <div className="truncate">{comp.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {new Date(comp.createdAt).toLocaleDateString()}
                      </div>
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
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{comp.userId?.name || 'Citizen'}</div>
                      <div className="text-[10px] text-slate-400 truncate">{comp.userId?.phone || comp.userId?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-[150px] truncate" title={comp.department}>
                      {comp.department || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={comp.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openManageModal(comp, 'status')}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold transition-all shadow-sm"
                          title="Update Status / Action"
                        >
                          Manage
                        </button>
                        <Link
                          to={`/complaint/${comp._id}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="View Full Dossier"
                        >
                          <Eye size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => fetchComplaints(currentPage - 1)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => fetchComplaints(currentPage + 1)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin Action Management Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600">
                  {selectedComplaint.trackingId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedComplaint.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedComplaint.status} size="xs" />
                  <PriorityBadge priority={selectedComplaint.priority} size="xs" />
                </div>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Action Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
              {[
                { id: 'status', label: 'Update Status' },
                { id: 'assign', label: 'Assign Department' },
                { id: 'priority', label: 'Set Priority' },
                { id: 'response', label: 'Citizen Statement' },
                { id: 'note', label: 'Internal Staff Note' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    modalTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Update Status Form */}
            {modalTab === 'status' && (
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select New Status *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewStatus(s)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                          newStatus === s
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{s}</span>
                        {newStatus === s && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Audit Trail Status Comment (Required)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Field inspection completed. Work order #492 issued for patch repair."
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Official Admin Remark (Sent to Citizen via Email & App)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Dear citizen, our rapid response team has patched the pothole and restored traffic flow."
                    value={statusAdminResponse}
                    onChange={(e) => setStatusAdminResponse(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
                  >
                    {saving ? 'Updating...' : 'Save & Publish Status'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Assign Department Form */}
            {modalTab === 'assign' && (
              <form onSubmit={handleAssign} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Assign to Municipal Department *
                  </label>
                  <select
                    required
                    value={assignDept}
                    onChange={(e) => setAssignDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Officer / Staff In-Charge Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eng. Ramesh Kumar"
                      value={assignStaffName}
                      onChange={(e) => setAssignStaffName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Officer Email
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh.k@watersupply.gov"
                      value={assignStaffEmail}
                      onChange={(e) => setAssignStaffEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
                  >
                    {saving ? 'Assigning...' : 'Confirm Assignment'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Priority Form */}
            {modalTab === 'priority' && (
              <form onSubmit={handleUpdatePriority} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Adjust Priority Level *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                          newPriority === p
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    {saving ? 'Saving...' : 'Update Priority'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 4: Citizen Statement / Admin Response Form */}
            {modalTab === 'response' && (
              <form onSubmit={handleAddResponse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Official Public Response Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter an official message from the municipal department visible to the complainant..."
                    value={adminResponseMsg}
                    onChange={(e) => setAdminResponseMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    {saving ? 'Posting...' : 'Post Official Response'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 5: Internal Staff Note */}
            {modalTab === 'note' && (
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Internal Private Staff Note (Confidential) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter internal inspection note, contractor requisition details, or budget allocation note (invisible to citizen)..."
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    {saving ? 'Saving...' : 'Add Internal Note'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
