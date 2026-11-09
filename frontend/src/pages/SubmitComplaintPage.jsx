import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { complaintService } from '../services/api';
import { CATEGORIES, PRIORITIES } from '../components/CategoryIcon';
import CategoryIcon from '../components/CategoryIcon';
import PriorityBadge from '../components/PriorityBadge';
import {
  PlusCircle,
  Upload,
  X,
  FileText,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubmitComplaintPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: searchParams.get('category') || 'Water Supply',
    priority: 'Medium',
    description: '',
    address: '',
    city: '',
    landmark: '',
    pincode: ''
  });

  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [copied, setCopied] = useState(false);

  // Debounced duplicate detection
  const duplicateTimeoutRef = useRef(null);

  useEffect(() => {
    if (duplicateTimeoutRef.current) {
      clearTimeout(duplicateTimeoutRef.current);
    }

    if (formData.title.trim().length >= 6) {
      duplicateTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await complaintService.checkDuplicates({
            title: formData.title,
            description: formData.description,
            category: formData.category
          });
          if (res.data.success && res.data.duplicates) {
            setDuplicateWarnings(res.data.duplicates);
          }
        } catch (err) {
          console.warn('Duplicate check error:', err.message);
        }
      }, 600);
    } else {
      setDuplicateWarnings([]);
    }

    return () => {
      if (duplicateTimeoutRef.current) {
        clearTimeout(duplicateTimeoutRef.current);
      }
    };
  }, [formData.title, formData.description, formData.category]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.error('You can upload a maximum of 5 files');
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    // Generate previews for images
    const previews = newFiles.map((f) => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      isImage: f.type.startsWith('image/'),
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null
    }));
    setFilePreviews(previews);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // Clean up revoked URLs
    if (filePreviews[index]?.url) {
      URL.revokeObjectURL(filePreviews[index].url);
    }
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    setFilePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.address) {
      toast.error('Please fill in all required fields (title, description, and location)');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      files.forEach((file) => {
        data.append('attachments', file);
      });

      const res = await complaintService.create(data);
      if (res.data.success && res.data.data) {
        setSubmittedComplaint(res.data.data);
        toast.success(`Complaint registered! Tracking ID: ${res.data.data.trackingId}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit complaint. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedComplaint?.trackingId) {
      navigator.clipboard.writeText(submittedComplaint.trackingId);
      setCopied(true);
      toast.success('Tracking ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Submit a New Grievance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide complete and accurate details to facilitate rapid departmental allocation and resolution.
        </p>
      </div>

      {/* Success Modal / Banner when complaint is submitted */}
      {submittedComplaint ? (
        <div className="p-8 rounded-3xl bg-white border border-emerald-200 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Grievance Registered Successfully!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your complaint has been logged into the municipal database and dispatched to the concerned grievance desk.
            </p>
          </div>

          {/* Tracking ID Box */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Your Unique Tracking ID
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-indigo-700">
                {submittedComplaint.trackingId}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-slate-700 text-xs font-bold transition-all shadow-sm"
            >
              {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to={`/complaint/${submittedComplaint._id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              View Complaint Details
            </Link>
            <Link
              to={`/track?id=${submittedComplaint.trackingId}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Open Public Tracker
            </Link>
            <button
              onClick={() => {
                setSubmittedComplaint(null);
                setFormData({
                  title: '',
                  category: 'Water Supply',
                  priority: 'Medium',
                  description: '',
                  address: '',
                  city: '',
                  landmark: '',
                  pincode: ''
                });
                setFiles([]);
                setFilePreviews([]);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold text-xs"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Duplicate Detection Warning Banner */}
          {duplicateWarnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <Sparkles size={16} className="text-amber-600" />
                <span>Smart Duplicate Detection Alert</span>
              </div>
              <p className="text-amber-700">
                We found <strong>{duplicateWarnings.length}</strong> recently submitted complaint(s) with similar descriptions in this category. Please check if your grievance has already been reported:
              </p>
              <div className="space-y-1.5 pt-1">
                {duplicateWarnings.map((dup) => (
                  <div
                    key={dup.trackingId}
                    className="p-2.5 rounded-xl bg-white/90 border border-amber-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="font-mono font-bold text-indigo-600 mr-2">
                        {dup.trackingId}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">
                        {dup.title}
                      </span>
                      <span className="ml-2 text-[10px] text-slate-500">
                        ({dup.similarityPercentage}% Match)
                      </span>
                    </div>
                    <Link
                      to={`/track?id=${dup.trackingId}`}
                      target="_blank"
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold shrink-0 flex items-center gap-1"
                    >
                      <span>Check</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-amber-600 italic pt-1">
                You may still submit your complaint if this is an independent or recurring issue.
              </p>
            </div>
          )}

          {/* Section 1: Complaint Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-indigo-600" />
              1. Issue Overview
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Complaint Title *
              </label>
              <input
                type="text"
                name="title"
                required
                maxLength={200}
                placeholder="e.g. Deep crater pothole on Main Avenue causing traffic hazards"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Be specific with short descriptive phrases. Minimum 5 characters.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <div className="relative">
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <CategoryIcon category={formData.category} size={18} />
                  </div>
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Priority Level *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRIORITIES.map((p) => {
                    const isSelected = formData.priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: p })}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Detailed Grievance Description *
              </label>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Explain the problem thoroughly: What happened? How long has it existed? What is the impact on residents or traffic? Any specific hazards?"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
              />
            </div>
          </div>

          {/* Section 2: Location Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} className="text-indigo-600" />
              2. Incident Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Street Address / Exact Location *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. Cross Road #4, outside St. Xavier Gate, Sector 12"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  City / Town
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Metropolis"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Prominent Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="e.g. Near Community Health Center"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Supporting Attachments */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Upload size={16} className="text-indigo-600" />
              3. Evidence & Attachments (Optional)
            </h3>

            {/* Drag & Drop Uploader */}
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 hover:bg-indigo-50/30 transition-all cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Click or drag photos or documents here
                </p>
                <p className="text-xs text-slate-500">
                  Supported formats: JPG, PNG, WEBP, PDF, DOCX (Max 5 files, up to 10MB each)
                </p>
              </div>
            </div>

            {/* File Previews */}
            {filePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                {filePreviews.map((f, idx) => (
                  <div
                    key={idx}
                    className="relative group p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors z-10"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                    {f.isImage ? (
                      <img
                        src={f.url}
                        alt="Preview"
                        className="w-full h-20 object-cover rounded-xl mb-1.5"
                      />
                    ) : (
                      <div className="w-full h-20 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-1.5">
                        <FileText size={28} />
                      </div>
                    )}
                    <div className="w-full">
                      <p className="text-[11px] font-semibold text-slate-800 truncate" title={f.name}>
                        {f.name}
                      </p>
                      <span className="text-[10px] text-slate-400">{f.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 hover:scale-[1.01]"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Grievance...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Submit Complaint & Generate Tracking ID</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
