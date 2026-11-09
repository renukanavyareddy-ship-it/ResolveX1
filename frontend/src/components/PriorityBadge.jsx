import React from 'react';
import { AlertTriangle, AlertOctagon, Info, Flame } from 'lucide-react';

export default function PriorityBadge({ priority, size = 'sm' }) {
  const configs = {
    'Low': {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      icon: Info
    },
    'Medium': {
      bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      dot: 'bg-yellow-500',
      icon: AlertTriangle
    },
    'High': {
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      dot: 'bg-orange-500',
      icon: Flame
    },
    'Critical': {
      bg: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
      dot: 'bg-rose-600 animate-ping',
      icon: AlertOctagon
    }
  };

  const config = configs[priority] || configs['Medium'];
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
      <span className="relative flex h-2 w-2">
        {priority === 'Critical' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${priority === 'Critical' ? 'bg-rose-600' : config.dot}`} />
      </span>
      <Icon size={12} className="stroke-[2.5]" />
      <span>{priority}</span>
    </span>
  );
}
