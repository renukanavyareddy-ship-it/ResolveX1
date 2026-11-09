import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryIcon from '../components/CategoryIcon';
import TimelineStepper from '../components/TimelineStepper';
import {
  Search,
  Copy,
  Check,
  Building2,
  Calendar,
  MapPin,
  MessageSquare,
  Star,
  AlertCircle,
  Share2,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrackComplaintPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingIdInput, setTrackingIdInput] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchComplaint = async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return;
    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const res = await complaintService.track(idToSearch.trim().toUpperCase());
      if (res.data.success && res.data.data) {
        setComplaint(res.data.data);
      } else {
        setError(res.data.message || 'No complaint found with this Tracking ID');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found. Please verify the Tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      setTrackingIdInput(queryId);
      fetchComplaint(queryId);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingIdInput.trim()) {
      setSearchParams({ id: trackingIdInput.trim().toUpperCase() });
      fetchComplaint(trackingIdInput.trim());
    }
  };

  const handleCopy = () => {
    if (complaint?.trackingId) {
      navigator.clipboard.writeText(complaint.trackingId);
      setCopied(true);
      toast.success('Tracking ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Search Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          Public Grievance Tracker
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Track Your Complaint
        </h1>
        <p className="text-slate-600 text-sm">
          Enter your unique Tracking ID to view the live status, department assignment, and official resolution timeline.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="pt-4 max-w-lg mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. RX-202611-1001"
              value={trackingIdInput}
              onChange={(e) => setTrackingIdInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Track</span>
            )}
          </button>
        </form>

        {/* Quick Demo Pill Helper */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span>Try sample IDs:</span>
          {['RX-202611-1001', 'RX-202611-1002', 'RX-202611-1003'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setTrackingIdInput(sample);
                setSearchParams({ id: sample });
                fetchComplaint(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-mono text-[11px] font-semibold text-slate-700 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3 max-w-lg mx-auto shadow-sm">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Complaint details card */}
      {complaint && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 overflow-hidden animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Complaint Tracking ID:
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-indigo-300">
                  {complaint.trackingId}
                </span>
                <button
                  onClick={handleCopy}
                  title="Copy ID"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white max-w-2xl">
                {complaint.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <StatusBadge status={complaint.status} size="md" />
              <PriorityBadge priority={complaint.priority} size="md" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Meta tags bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <CategoryIcon category={complaint.category} size={20} showBg={true} />
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">Category</span>
                  <span className="font-bold text-slate-900">{complaint.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Calendar size={18} />
                </span>
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">Submitted On</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(complaint.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Building2 size={18} />
                </span>
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">Assigned Department</span>
                  <span className="font-semibold text-slate-900">
                    {complaint.department || 'Under Review / Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Grievance Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Location info if available */}
            {complaint.location && (complaint.location.city || complaint.location.landmark) && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Location Area
                </h3>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <MapPin size={15} className="text-rose-500" />
                  <span>
                    {[complaint.location.landmark, complaint.location.city].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            )}

            {/* Administrator Response */}
            {complaint.adminResponse && complaint.adminResponse.message && (
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  <MessageSquare size={16} className="text-indigo-600" />
                  <span>Official Administrator Statement</span>
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  "{complaint.adminResponse.message}"
                </p>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Responded by: <strong>{complaint.adminResponse.respondedBy || 'Grievance Officer'}</strong></span>
                  {complaint.adminResponse.respondedAt && (
                    <span>{new Date(complaint.adminResponse.respondedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            )}

            {/* Citizen Feedback if resolved */}
            {complaint.feedback && complaint.feedback.rating && (
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Citizen Feedback
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        className={s <= complaint.feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                </div>
                {complaint.feedback.comment && (
                  <p className="text-xs text-slate-700 italic">
                    "{complaint.feedback.comment}"
                  </p>
                )}
              </div>
            )}

            {/* Progress Stepper & Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Resolution Stepper & Verification
              </h3>
              <TimelineStepper
                currentStatus={complaint.status}
                statusHistory={complaint.statusHistory || []}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
