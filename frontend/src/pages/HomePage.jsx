import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Building,
  Bell,
  BarChart3,
  FileCheck
} from 'lucide-react';
import { CATEGORIES } from '../components/CategoryIcon';
import CategoryIcon from '../components/CategoryIcon';

export default function HomePage() {
  const [trackingInput, setTrackingInput] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      navigate(`/track?id=${trackingInput.trim().toUpperCase()}`);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Submit Grievance',
      desc: 'Fill out the complaint form with title, category, location, and upload supporting photos or documents.',
      icon: PlusCircle
    },
    {
      num: '02',
      title: 'Get Unique Tracking ID',
      desc: 'Receive an instant high-entropy tracking number and automated email confirmation for your records.',
      icon: ShieldCheck
    },
    {
      num: '03',
      title: 'Department Action',
      desc: 'Municipal administrators review, assign field staff, and update real-time progress via Socket.IO.',
      icon: Clock
    },
    {
      num: '04',
      title: 'Resolution & Feedback',
      desc: 'Inspect official proof of work, rate the service quality, or reopen the case if unsatisfied.',
      icon: CheckCircle2
    }
  ];

  const features = [
    {
      title: 'Real-Time Live Updates',
      desc: 'Powered by WebSockets for instant status notifications right on your dashboard without refreshing.',
      icon: Bell,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Smart Duplicate Detection',
      desc: 'AI-assisted token similarity analysis flags duplicate grievances to prevent redundant municipal effort.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Centralized Admin Dispatch',
      desc: 'Seamless multi-department coordination between Water, Electricity, Road PWD, and Police wings.',
      icon: Building,
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Transparent Public Tracking',
      desc: 'Any citizen can verify complaint progression, timestamps, and officer remarks with just the tracking ID.',
      icon: Search,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
        {/* Decorative background blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-300/20 via-indigo-300/20 to-purple-300/20 blur-3xl -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-sm animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>Next-Generation Grievance Redressal Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Your Voice Matters.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              We Make Things Better.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Report civic, municipal, educational, or utility problems in seconds. Track live progress, receive automated email alerts, and hold local administration accountable with complete transparency.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/submit-complaint"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40"
            >
              <PlusCircle size={18} />
              <span>Submit a Complaint</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/track"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm hover:shadow transition-all"
            >
              <Search size={18} className="text-indigo-600" />
              <span>Track Complaint Status</span>
            </Link>
          </div>

          {/* Instant Search Bar */}
          <div className="max-w-xl mx-auto pt-6">
            <form
              onSubmit={handleTrack}
              className="flex items-center p-2 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50"
            >
              <div className="pl-3 pr-2 text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. RX-202611-1001)"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="flex-1 py-2 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors"
              >
                Track Now
              </button>
            </form>
          </div>

          {/* Key Stat Counters */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">
                98.4%
              </span>
              <span className="text-xs text-slate-500 font-semibold mt-1 block">
                Resolution Rate
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-indigo-600">
                &lt; 48 Hrs
              </span>
              <span className="text-xs text-slate-500 font-semibold mt-1 block">
                Average Redressal Time
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">
                10+
              </span>
              <span className="text-xs text-slate-500 font-semibold mt-1 block">
                Civic Departments
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600">
                100%
              </span>
              <span className="text-xs text-slate-500 font-semibold mt-1 block">
                Audit Trail Transparency
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Clear, Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How ResolveX Works
          </h2>
          <p className="text-slate-600 text-sm">
            From complaint submission to official department verification, experience a streamlined civic resolution pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Icon size={24} />
                    </span>
                    <span className="text-3xl font-extrabold text-slate-200 font-mono">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Complaint Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Comprehensive Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Supported Complaint Categories
          </h2>
          <p className="text-slate-600 text-sm">
            Select from 10 specialized municipal and utility sectors for direct routing to the concerned officers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/submit-complaint?category=${encodeURIComponent(cat)}`}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm card-hover text-center flex flex-col items-center justify-center gap-3 group"
            >
              <CategoryIcon category={cat} size={28} showBg={true} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us / Smart Features */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Smart Technology
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Cities Choose ResolveX
            </h2>
            <p className="text-slate-400 text-sm">
              Engineered with modern full-stack web standards, real-time messaging, and intelligent analytics for unmatched governance efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50 transition-all card-hover"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 sm:p-12 text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Experiencing a Civic Problem in Your Neighborhood?
            </h3>
            <p className="text-indigo-100 text-sm">
              Don't wait. Register your grievance right now and watch it get resolved by dedicated department teams.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 font-bold text-sm shadow-md transition-all text-center"
            >
              Create Citizen Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-indigo-800/60 hover:bg-indigo-800 text-white font-bold text-sm border border-indigo-400/40 transition-all text-center"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
