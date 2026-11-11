import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, Phone, User, Award, ArrowRight, AlertCircle, BadgeIndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ExecutiveSignup = () => {
  const { executiveRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    title: 'Acharya',
    email: '',
    phone: '',
    password: '',
    experience: 5,
    pricePerMinute: 25,
    specializations: 'Kundli Analysis, Career Guidance, Marriage Consultation',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience),
        pricePerMinute: Number(formData.pricePerMinute),
        specializations: formData.specializations.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await executiveRegister(payload);
      navigate('/executive/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check the entered details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-maroon-800 text-gold-400 border border-gold-500/40 flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-maroon-900">
            Astrologer Executive Onboarding
          </h2>
          <p className="text-xs text-stone-500">
            Create your professional consultation profile, configure your per-minute rate, and begin accepting bookings.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Title</label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 bg-white"
              >
                <option value="Acharya">Acharya</option>
                <option value="Pt.">Pt. (Pandit)</option>
                <option value="Dr.">Dr.</option>
                <option value="Jyotish Ratna">Jyotish Ratna</option>
                <option value="Vaidya">Vaidya</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Radheshyam Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="acharya@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Experience (Yrs)</label>
              <input
                type="number"
                name="experience"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Fee / Min (₹) *</label>
              <input
                type="number"
                name="pricePerMinute"
                min="1"
                required
                value={formData.pricePerMinute}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 font-bold text-maroon-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Areas of Specialization (comma separated)
            </label>
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              placeholder="Kundli Analysis, Career Guidance, Vastu Shastra..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Creating Astrologer Profile...</span>
            ) : (
              <>
                <span>Complete Registration & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-600">
          Already registered as an Astrologer?{' '}
          <Link
            to="/executive/login"
            className="font-semibold text-maroon-800 hover:text-maroon-950 underline"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSignup;
