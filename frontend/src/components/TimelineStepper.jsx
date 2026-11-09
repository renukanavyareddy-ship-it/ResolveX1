import React from 'react';
import { Check, Clock, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

const STANDARD_STEPS = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

export default function TimelineStepper({ currentStatus, statusHistory = [] }) {
  const isRejected = currentStatus === 'Rejected';
  const isReopened = currentStatus === 'Reopened';

  // Determine which standard step index is active
  let activeIndex = STANDARD_STEPS.indexOf(currentStatus);
  if (activeIndex === -1) {
    if (isRejected) activeIndex = 1;
    if (isReopened) activeIndex = 3;
  }

  return (
    <div className="w-full py-4">
      {/* Horizontal step bar for tablets/desktops */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 -z-0">
          <div
            className={`h-full transition-all duration-500 ${
              isRejected ? 'bg-rose-500' : 'bg-indigo-600'
            }`}
            style={{
              width: `${Math.max(0, Math.min(100, (activeIndex / (STANDARD_STEPS.length - 1)) * 100))}%`
            }}
          />
        </div>

        {STANDARD_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex || (idx === activeIndex && currentStatus === 'Resolved');
          const isCurrent = idx === activeIndex && currentStatus !== 'Resolved';
          const isPending = idx > activeIndex;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isCompleted || isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Special status callout for Rejected or Reopened */}
      {isRejected && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-sm">
          <XCircle size={18} />
          <span><strong>Complaint Rejected:</strong> This complaint could not be processed. View administrator remarks below.</span>
        </div>
      )}
      {isReopened && (
        <div className="mt-4 p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-center gap-2 text-purple-700 text-sm">
          <RefreshCw size={18} className="animate-spin" />
          <span><strong>Complaint Reopened:</strong> Citizen requested further review. Case reopened for resolution.</span>
        </div>
      )}

      {/* Detailed Status History Log */}
      {statusHistory.length > 0 && (
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock size={16} className="text-indigo-600" />
            Audit Trail & Status Progression
          </h4>
          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {statusHistory.map((item, index) => (
              <div key={item._id || index} className="flex items-start gap-4 relative">
                <div className="w-7 h-7 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 flex items-center justify-center shrink-0 z-10 shadow-sm text-xs font-bold">
                  {index + 1}
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex-1 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-900">
                      Status set to: <span className="text-indigo-600">{item.status}</span>
                    </span>
                    <span className="text-xs text-slate-600 font-mono">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                  {item.comment && (
                    <p className="text-xs text-slate-700 mt-1.5 leading-relaxed bg-white/70 p-2 rounded-lg border border-slate-100">
                      {item.comment}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
                    <span>Updated by: <strong className="text-slate-800">{item.changedByName || 'System'}</strong></span>
                    {item.changedByRole && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/60 font-medium uppercase text-[9px] tracking-wider text-slate-700">
                        {item.changedByRole}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
