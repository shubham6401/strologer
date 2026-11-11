import React, { useState, useEffect } from 'react';
import { BadgeIndianRupee, Check, AlertCircle, Save, Info, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ConsultationPricing = () => {
  const { profile, setProfile } = useAuth();
  const [rate, setRate] = useState(25);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await api.get('/executive/profile');
        if (res.data.success && res.data.profile) {
          setRate(res.data.profile.pricePerMinute || 20);
        }
      } catch (err) {
        console.warn('Failed to load current pricing:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const numRate = Number(rate);
    if (isNaN(numRate) || numRate < 1) {
      setErrorMsg('Price per minute must be at least ₹1.');
      setSaving(false);
      return;
    }

    try {
      const res = await api.put('/executive/pricing', { pricePerMinute: numRate });
      if (res.data.success) {
        setSuccessMsg(`Consultation fee updated to ₹${numRate} / minute.`);
        if (profile) {
          setProfile({ ...profile, pricePerMinute: numRate });
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update pricing.');
    } finally {
      setSaving(false);
    }
  };

  const durations = [10, 15, 20, 30, 45, 60];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Consultation Pricing Management
        </h2>
        <p className="text-xs text-stone-500">
          Set your personal per-minute fee. Clients will be billed based on your exact rate multiplied by their selected duration.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pricing input card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Your Per-Minute Fee (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-maroon-900 text-lg">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-stone-300 font-serif font-bold text-2xl text-maroon-900 focus:outline-none focus:border-gold-500"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Standard industry range: ₹15 to ₹50 per minute.
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Update & Save Pricing'}</span>
            </button>
          </form>

          {/* Pricing Policy Snapshot Info */}
          <div className="p-3.5 rounded-xl bg-ivory-100 border border-gold-300/60 text-xs text-stone-700 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-maroon-900">
              <Info className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <span>Snapshot Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-600">
              Whenever a customer creates a consultation booking, our server freezes the price-per-minute snapshot for that booking. Future updates to your fee will never alter existing pending or scheduled consultations.
            </p>
          </div>
        </div>

        {/* Live Calculation Matrix Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-base text-maroon-900">
                Live Customer Fee Preview
              </h3>
              <p className="text-xs text-stone-500">
                Calculated automatically at your current rate of ₹{rate || 0}/min:
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gold-100 text-maroon-900 border border-gold-300">
              ₹{rate || 0}/min
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Consultation Duration</th>
                  <th className="px-5 py-3">Rate Breakdown</th>
                  <th className="px-5 py-3 text-right">Customer Pays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {durations.map((d) => (
                  <tr key={d} className="hover:bg-stone-50">
                    <td className="px-5 py-3 font-semibold text-stone-800">
                      {d} Minutes
                    </td>
                    <td className="px-5 py-3 text-stone-500">
                      {d} mins × ₹{rate || 0}
                    </td>
                    <td className="px-5 py-3 text-right font-serif font-bold text-maroon-900 text-sm">
                      ₹{d * (Number(rate) || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPricing;
