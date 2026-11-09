import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import {
  Users,
  Search,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  Shield,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      const res = await userService.getAll(params);
      if (res.data.success) {
        setUsers(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load registered citizens directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove citizen account "${name}"?`)) {
      return;
    }

    try {
      const res = await userService.delete(id);
      if (res.data.success) {
        toast.success(`User "${name}" removed successfully`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registered Citizen Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage authenticated citizens, view grievance submission histories, and monitor user profiles.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearch} className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or contact number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Loading Directory...
              </span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center text-slate-500 text-xs">
              No registered citizens found matching your query.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Citizen Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">City / Address</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4 text-center">Complaints</th>
                  <th className="py-3.5 px-4 text-center">Resolved</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {u.email}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {u.phone || <span className="text-slate-400 italic">Not set</span>}
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                      {u.address || <span className="text-slate-400 italic">N/A</span>}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {u.role === 'admin' ? 'Administrator' : 'Citizen'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-900">
                      {u.complaintsCount || 0}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-emerald-600">
                      {u.resolvedCount || 0}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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
