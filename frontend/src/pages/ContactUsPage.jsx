import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Your message has been sent! Our grievance desk will respond within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 600);
  };

  const faqs = [
    {
      q: 'How do I obtain my Complaint Tracking ID?',
      a: 'Whenever you submit a grievance on ResolveX, our system generates an instant unique tracking ID (format: RX-YYYYMM-XXXXX). You will also receive an automated email confirmation.'
    },
    {
      q: 'Can I track a complaint without logging into an account?',
      a: 'Yes! Anyone can visit the "Track Complaint" page and enter any valid Tracking ID to verify live status, assigned department, and official progress notes.'
    },
    {
      q: 'What should I do if my complaint is marked Resolved but the problem persists?',
      a: 'You can use the "Reopen Complaint" button on your Complaint Details page. Provide an explanation, and the case will be flagged back to supervisory officers for urgent re-inspection.'
    },
    {
      q: 'How does ResolveX prevent duplicate complaints?',
      a: 'ResolveX incorporates an intelligent token similarity algorithm that warns users if similar issues have already been reported in the same vicinity or category.'
    }
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <span>Official Grievance Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch with ResolveX
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Need assistance filing a complaint, following up with a department, or reporting urgent public hazards? We are here to help.
        </p>
      </section>

      {/* Contact Cards & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Central Redressal Office
                </span>
                <h3 className="text-xl font-bold mt-1">Grievance Helplines</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Available 24 hours a day, 7 days a week for civic emergency triage.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-slate-800 text-indigo-400 shrink-0">
                    <Phone size={18} />
                  </span>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Toll-Free Helpline</span>
                    <strong className="text-sm text-white">1800-RESOLVEX (737-658)</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-slate-800 text-indigo-400 shrink-0">
                    <Mail size={18} />
                  </span>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Official Support Email</span>
                    <strong className="text-sm text-white">support@resolvex.gov</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-slate-800 text-indigo-400 shrink-0">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Headquarters Address</span>
                    <span className="text-slate-300">
                      ResolveX Municipal Redressal HQ, Tower 4, Civic Centre Complex, Metro City
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-slate-800 text-indigo-400 shrink-0">
                    <Clock size={18} />
                  </span>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Office In-Person Hours</span>
                    <span className="text-slate-300">
                      Monday to Friday: 9:00 AM – 6:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Emergency Numbers */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Emergency Sector Direct Lines
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-400 text-[10px]">Water Supply Board</span>
                  <strong className="text-slate-800">1916</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-400 text-[10px]">Electricity Breakdown</span>
                  <strong className="text-slate-800">1912</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-400 text-[10px]">Traffic Police Control</span>
                  <strong className="text-slate-800">103</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-400 text-[10px]">Disaster Management</span>
                  <strong className="text-slate-800">108</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Send an Administrative Inquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Have a question regarding municipal policies, jurisdiction, or escalation protocols?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiry regarding street light replacement budget timeline"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your inquiry here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>{submitting ? 'Sending...' : 'Send Inquiry to Grievance Desk'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Quick Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-indigo-600" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
