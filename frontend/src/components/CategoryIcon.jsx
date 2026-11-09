import React from 'react';
import {
  Droplet,
  Zap,
  Truck,
  Trash2,
  Lightbulb,
  ShieldAlert,
  GraduationCap,
  HeartPulse,
  Building2,
  HelpCircle
} from 'lucide-react';

export const categoryIconsMap = {
  'Water Supply': { icon: Droplet, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  'Electricity': { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  'Roads and Transportation': { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
  'Sanitation and Cleanliness': { icon: Trash2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  'Street Lights': { icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  'Public Safety': { icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
  'Education': { icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  'Healthcare': { icon: HeartPulse, color: 'text-pink-500', bg: 'bg-pink-50' },
  'Infrastructure': { icon: Building2, color: 'text-violet-500', bg: 'bg-violet-50' },
  'Other': { icon: HelpCircle, color: 'text-slate-500', bg: 'bg-slate-50' }
};

export const CATEGORIES = [
  'Water Supply',
  'Electricity',
  'Roads and Transportation',
  'Sanitation and Cleanliness',
  'Street Lights',
  'Public Safety',
  'Education',
  'Healthcare',
  'Infrastructure',
  'Other'
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const STATUSES = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
  'Reopened'
];

export default function CategoryIcon({ category, size = 18, showBg = false, className = '' }) {
  const item = categoryIconsMap[category] || categoryIconsMap['Other'];
  const IconComponent = item.icon;

  if (showBg) {
    return (
      <span className={`inline-flex items-center justify-center p-2 rounded-lg ${item.bg} ${item.color} ${className}`}>
        <IconComponent size={size} />
      </span>
    );
  }

  return <IconComponent size={size} className={`${item.color} ${className}`} />;
}
