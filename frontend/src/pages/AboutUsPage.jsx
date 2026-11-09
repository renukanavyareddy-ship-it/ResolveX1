import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Target,
  Eye,
  Award,
  Users,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AboutUsPage() {
  const pillars = [
    {
      title: 'Real-Time Transparency',
      desc: 'Eliminating dark silos in municipal governance. Every complaint is tracked with immutable status timestamps and visible official remarks.',
      icon: Eye
    },
    {
      title: 'Multi-Department Coordination',
      desc: 'Unifying Water, Electricity, Transportation, Sanitation, and Public Safety into a single centralized digital grievance desk.',
      icon: Building
    },
    {
      title: 'Citizen Empowerment',
      desc: 'Enabling citizens to rate resolution quality, submit photo evidence, and reopen complaints if work was incomplete.',
      icon: Award
    },
    {
      title: 'AI & Data-Driven Insights',
      desc: 'Detecting duplicate issues early, prioritizing critical hazards, and equipping administrators with predictive resolution analytics.',
      icon: Sparkles
    }
  ];

  return (
    <div className="space-y-20 py-12">
      {/* Hero Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <span>About ResolveX Grievance Redressal</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Transforming Municipal Governance into a Responsive, Citizen-Centric Service.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          ResolveX was created with a clear mission: bridge the gap between residents and city administrations through cutting-edge full-stack technology, real-time accountability, and transparent resolution metrics.
        </p>
      </section>

      {/* Mission & Vision Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Target size={26} />
            </div>
            <h2 className="text-2xl font-bold">Our Core Mission</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              To deliver an accessible, reliable, and equitable digital grievance mechanism where every citizen can voice issues without administrative friction, and where municipal staff are empowered with the tools to resolve them swiftly.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Eye size={26} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Strategic Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We envision clean, safe, and well-maintained cities where civic infrastructure problems are resolved proactively within 48 hours, supported by automated telemetry, citizen feedback loops, and open government data.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Architecture Pillars
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Engineered for Real-World Municipal Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 pt-8">
        <h3 className="text-2xl font-bold text-slate-900">
          Ready to experience modern civic governance?
        </h3>
        <p className="text-sm text-slate-600">
          Join thousands of proactive citizens making their neighborhoods safer, cleaner, and better maintained.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
          >
            Create Citizen Account
          </Link>
          <Link
            to="/track"
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Track an Issue
          </Link>
        </div>
      </section>
    </div>
  );
}
