import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, Clock, MapPin, Check, AlertCircle, Save, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CustomerProfile = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dateOfBirth: user?.birthDetails?.dateOfBirth || '',
    timeOfBirth: user?.birthDetails?.timeOfBirth || '',
    placeOfBirth: user?.birthDetails?.placeOfBirth || '',
    gender: user?.birthDetails?.gender || 'male',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dateOfBirth: user.birthDetails?.dateOfBirth || '',
        timeOfBirth: user.birthDetails?.timeOfBirth || '',
        placeOfBirth: user.birthDetails?.placeOfBirth || '',
        gender: user.birthDetails?.gender || 'male',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/auth/me', {
        name: formData.name,
        phone: formData.phone,
        birthDetails: {
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          placeOfBirth: formData.placeOfBirth,
          gender: formData.gender,
        },
      });

      if (res.data.success) {
        setSuccessMsg('Your profile and birth details were updated successfully.');
        await refreshUser();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Client Profile & Kundli Birth Chart
        </h2>
        <p className="text-xs text-stone-500">
          Save your personal details and accurate birth coordinates for faster consultation bookings.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-sm text-maroon-900 pb-2 border-b border-stone-100">
            Account Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Registered Email (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contact Phone Number *
            </label>
            <input
              type="tel"
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Vedic Birth Details for Janam Patrika */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <h3 className="font-serif font-bold text-sm text-maroon-900">
              Janam Kundli Birth Coordinates
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Having these pre-saved allows your astrologer to compute your natal charts immediately upon booking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Time of Birth (Exact)
              </label>
              <input
                type="time"
                name="timeOfBirth"
                value={formData.timeOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500 bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Place of Birth (City, State, Country)
            </label>
            <input
              type="text"
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              placeholder="e.g. Varanasi, Uttar Pradesh, India"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfile;
