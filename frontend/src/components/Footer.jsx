import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <ShieldCheck size={22} />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Resolve<span className="text-indigo-400">X</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Smart Complaint Reporting & Resolution Management System. Empowering citizens with real-time grievance tracking, transparent municipal oversight, and rapid multi-department dispute redressal.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Redressal Engine Online
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-slate-400 hover:text-white transition-colors">
                  Track Complaint by ID
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Citizen Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
                  Register Grievance
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Department Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Complaint Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Key Sectors
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Water Supply & Drainage</li>
              <li>• Electricity & Transmission</li>
              <li>• Roads & Transportation</li>
              <li>• Sanitation & Waste Management</li>
              <li>• Street Lighting</li>
              <li>• Public Safety & Hazards</li>
              <li>• Healthcare Dispensaries</li>
              <li>• Civic Infrastructure</li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Civic Helplines
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-indigo-400 shrink-0" />
                <span>Toll-Free Helpline: <strong>1800-RESOLVEX</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-400 shrink-0" />
                <span>support@resolvex.gov</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>ResolveX Grievance Redressal HQ, Civic Centre</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} ResolveX Smart Complaint Reporting & Resolution Management System. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with modern MERN Architecture • Powered by Socket.IO & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
