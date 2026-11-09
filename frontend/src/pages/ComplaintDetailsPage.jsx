import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { complaintService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryIcon from '../components/CategoryIcon';
import TimelineStepper from '../components/TimelineStepper';
import {
  ArrowLeft,
  Copy,
  Check,
  Calendar,
  MapPin,
  Building2,
  User,
  MessageSquare,
  FileText,
  Star,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { socket } = useSocket();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Reopen Modal State
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopening, setReopening] = useState(false);

  // Image Modal
  const [activeImage, setActiveImage] = useState(null);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getById(id);
      if (res.data.success) {
        setComplaint(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load complaint details');
      navigate('/my-complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  // Join Socket room for real-time live timeline updates
  useEffect(() => {
    if (socket && complaint?._id) {
      socket.emit('join:complaint', complaint._id);

      const handleUpdate = () => {
        fetchComplaint();
      };

      socket.on('complaint:status_change', handleUpdate);
      return () => {
        socket.off('complaint:status_change', handleUpdate);
      };
    }
  }, [socket, complaint?._id]);

  const handleCopyId = () => {
    if (complaint?.trackingId) {
      navigator.clipboard.writeText(complaint.trackingId);
      setCopied(true);
      toast.success('Tracking ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingFeedback(true);
      const res = await complaintService.submitFeedback(id, {
        rating,
        comment: feedbackComment
      });
      if (res.data.success) {
        toast.success('Feedback recorded. Thank you for helping improve civic services!');
        setComplaint(prev => ({ ...prev, feedback: res.data.data }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    try {
      setReopening(true);
      const res = await complaintService.reopen(id, { reason: reopenReason });
      if (res.data.success) {
        toast.success('Complaint reopened. A supervising officer has been notified.');
        setComplaint(res.data.data);
        setReopenModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reopen complaint');
    } finally {
      setReopening(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Complaint Dossier...
        </span>
      </div>
    );
  }

  if (!complaint) return null;

  const canReopen = !isAdmin && (complaint.status === 'Resolved' || complaint.status === 'Rejected');
  const canLeaveFeedback = !isAdmin && complaint.status === 'Resolved' && !complaint.feedback?.rating;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <Link
          to={isAdmin ? '/admin/complaints' : '/my-complaints'}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{isAdmin ? 'Back to All Complaints' : 'Back to My Complaints'}</span>
        </Link>
        <Link
          to={`/track?id=${complaint.trackingId}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
        >
          <span>Open Public Tracking Link</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Grievance Tracking ID:
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-indigo-300">
                {complaint.trackingId}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white max-w-2xl">
              {complaint.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <StatusBadge status={complaint.status} size="md" />
            <PriorityBadge priority={complaint.priority} size="md" />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <CategoryIcon category={complaint.category} size={22} showBg={true} />
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase">Category</span>
                <span className="font-bold text-slate-900">{complaint.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Calendar size={18} />
              </span>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase">Filing Date</span>
                <span className="font-semibold text-slate-900">
                  {new Date(complaint.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Building2 size={18} />
              </span>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase">Department</span>
                <span className="font-semibold text-slate-900">
                  {complaint.department || 'Awaiting Allocation'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <User size={18} />
              </span>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase">Complainant</span>
                <span className="font-semibold text-slate-900">
                  {complaint.userId?.name || 'Verified Citizen'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Grievance Description
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
              {complaint.description}
            </div>
          </div>

          {/* Incident Location */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Location & Address
            </h3>
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
              <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">{complaint.location?.address}</p>
                <p className="text-slate-500 mt-0.5">
                  {[complaint.location?.landmark, complaint.location?.city, complaint.location?.pincode]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={15} className="text-indigo-600" />
                Evidence & Attached Files ({complaint.attachments.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {complaint.attachments.map((file, idx) => {
                  const isImg = file.fileType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.fileName);
                  const fileUrl = file.filePath;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between group hover:border-indigo-300 transition-colors"
                    >
                      {isImg ? (
                        <div
                          onClick={() => setActiveImage(fileUrl)}
                          className="h-28 rounded-xl overflow-hidden bg-slate-200 cursor-pointer relative mb-2"
                        >
                          <img
                            src={fileUrl}
                            alt={file.fileName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="h-28 rounded-xl bg-indigo-50/60 flex items-center justify-center text-indigo-600 mb-2">
                          <FileText size={36} />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-800 truncate" title={file.fileName}>
                          {file.fileName}
                        </p>
                        <a
                          href={fileUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 mt-1"
                        >
                          <Download size={12} />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Department Staff Assignment */}
          {complaint.assignedTo && complaint.assignedTo.name && (
            <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 space-y-1 text-xs">
              <span className="font-bold text-cyan-950 uppercase tracking-wider block">
                Assigned Redressal Officer
              </span>
              <p className="font-semibold text-slate-900 text-sm">
                {complaint.assignedTo.name} ({complaint.assignedTo.department})
              </p>
              {complaint.assignedTo.email && (
                <p className="text-slate-600">Email: {complaint.assignedTo.email}</p>
              )}
            </div>
          )}

          {/* Official Administrator Response */}
          {complaint.adminResponse && complaint.adminResponse.message && (
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 uppercase tracking-wider">
                <MessageSquare size={16} className="text-indigo-600" />
                <span>Official Municipal Administration Response</span>
              </div>
              <p className="text-sm font-medium text-slate-800 leading-relaxed bg-white/70 p-3.5 rounded-xl border border-indigo-100">
                "{complaint.adminResponse.message}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Responded by: <strong>{complaint.adminResponse.respondedBy || 'Grievance Officer'}</strong></span>
                {complaint.adminResponse.respondedAt && (
                  <span>{new Date(complaint.adminResponse.respondedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          )}

          {/* Status Timeline Stepper */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Resolution Stepper & Verification
            </h3>
            <TimelineStepper
              currentStatus={complaint.status}
              statusHistory={complaint.statusHistory || []}
            />
          </div>

          {/* Action: Reopen Complaint */}
          {canReopen && (
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-purple-950">
                  Is your grievance not resolved satisfactorily?
                </h4>
                <p className="text-xs text-purple-700 mt-0.5">
                  You can reopen this complaint to have it re-inspected by the supervisory authority.
                </p>
              </div>
              <button
                onClick={() => setReopenModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors shrink-0 flex items-center gap-2"
              >
                <RefreshCw size={14} />
                <span>Reopen Complaint</span>
              </button>
            </div>
          )}

          {/* Feedback & Rating Section */}
          {canLeaveFeedback && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Rate the Resolution Quality
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your feedback helps municipal supervisors evaluate department performance.
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        size={28}
                        className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>

                <textarea
                  rows={3}
                  placeholder="Tell us what went well or how the response can be improved..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Resolution Feedback'}
                </button>
              </form>
            </div>
          )}

          {/* Existing Feedback View */}
          {complaint.feedback && complaint.feedback.rating && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Submitted Citizen Feedback
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
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
        </div>
      </div>

      {/* Reopen Complaint Modal */}
      {reopenModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Reopen Grievance: {complaint.trackingId}
            </h3>
            <p className="text-xs text-slate-600">
              Please describe why the issue remains unresolved or why the previous action was insufficient.
            </p>
            <form onSubmit={handleReopenSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                placeholder="e.g. The leak was only temporarily patched and started overflowing again this morning..."
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReopenModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reopening}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
                >
                  {reopening ? 'Reopening...' : 'Confirm Reopen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
        >
          <img
            src={activeImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
