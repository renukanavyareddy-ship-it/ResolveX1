import React from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, XCircle, ArrowUpRight, UserCheck } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const configs = {
    'Submitted': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      icon: Clock
    },
    'Under Review': {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dot: 'bg-indigo-500',
      icon: ArrowUpRight
    },
    'Assigned': {
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      dot: 'bg-cyan-500',
      icon: UserCheck
    },
    'In Progress': {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500 animate-pulse',
      icon: RefreshCw
    },
    'Resolved': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle2
    },
    'Rejected': {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      icon: XCircle
    },
    'Reopened': {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500 animate-pulse',
      icon: AlertCircle
    }
  };

  const config = configs[status] || configs['Submitted'];
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1 font-medium',
    md: 'text-sm px-3 py-1 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses[size] || sizeClasses.sm} shadow-sm`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon size={12} className="stroke-[2.5]" />
      <span>{status}</span>
    </span>
  );
}
