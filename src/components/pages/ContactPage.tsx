import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Phone, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { submitContactMessage } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    await submitContactMessage(name, email, subject || 'General Inquiry', message);
    setLoading(false);
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact info sidebar */}
        <div className="bg-gradient-to-b from-pink-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-200">
              Get In Touch
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1 mb-3">
              We'd Love To Hear From You
            </h1>
            <p className="text-xs text-pink-100 leading-relaxed mb-6">
              Have questions about a product recommendation, partner deal, or collaboration with ShopNest?
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-pink-200 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-pink-200 uppercase font-bold">Email Support</span>
                  <span className="font-semibold">support@shopnest.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-pink-200 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-pink-200 uppercase font-bold">Social DM</span>
                  <span className="font-semibold">@meeshodeals825 on Instagram</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 text-[11px] text-pink-200">
            Available Monday to Saturday, 9:00 AM – 7:00 PM IST
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting ShopNest. Our curation team will review your inquiry and respond within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-bold text-pink-600 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Send Us a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Kurti recommendation / Brand collaboration"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what's on your mind..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
