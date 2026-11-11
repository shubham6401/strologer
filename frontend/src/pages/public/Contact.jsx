import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await api.post('/public/contact', formData);
      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-serif font-semibold text-gold-700 uppercase tracking-widest">
          <IndianOrnament className="w-4 h-4 text-gold-600" />
          <span>Support & Consultations Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-maroon-900 tracking-tight">
          We Are Here to Assist Your Quest
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Have queries regarding consultation booking, payment verification, or astrologer onboarding? Reach out to our dedicated support team.
        </p>
        <VedicDivider />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl text-maroon-900 pb-3 border-b border-stone-100">
              Consultation Secretariat
            </h3>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Headquarters</strong>
                  <span>Kashi Vedic Kendra, Assi Ghat Road, Varanasi, Uttar Pradesh 221005</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Direct Telephone</strong>
                  <span>+91 98765 43210 / +91 98765 12345</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Inquiries & Support Email</strong>
                  <span>support@jyotishyavani.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Desk Availability</strong>
                  <span>Monday – Sunday: 09:00 AM to 08:30 PM (IST)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-ivory-200/90 rounded-2xl p-6 border border-gold-300 text-xs text-stone-700 space-y-2">
            <h4 className="font-serif font-bold text-sm text-maroon-900">
              Are you a practicing Vedic Astrologer?
            </h4>
            <p>
              Join our verified guild of Acharyas. Maintain complete control over your per-minute fees, personal UPI QR payments, and video calendar.
            </p>
            <a
              href="/executive/signup"
              className="inline-block mt-2 font-semibold text-maroon-800 hover:text-maroon-950 underline"
            >
              Apply as an Executive Astrologer →
            </a>
          </div>
        </div>

        {/* Right: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-serif font-bold text-maroon-900">
                Message Received With Reverence
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting Jyotishya Vani. A member of our consultation support team will review your inquiry and respond within 2 to 4 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                }}
                className="px-6 py-2.5 rounded-lg bg-maroon-700 text-white text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-maroon-900 pb-3 border-b border-stone-100">
                Send Us a Message
              </h3>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject / Concern
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Payment Verification Help">Payment Verification Help</option>
                    <option value="Zoom Meeting Support">Zoom Meeting Support</option>
                    <option value="Rescheduling Assistance">Rescheduling Assistance</option>
                    <option value="Astrologer Partnership">Astrologer Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Message or Question *
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe how we can assist you..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Secretariat</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
