import React, { useState, useEffect } from 'react';
import { Clock, Check, AlertCircle, Save, Calendar, CheckSquare, Square } from 'lucide-react';
import api from '../../services/api';

const AvailabilitySettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [isAvailable, setIsAvailable] = useState(true);
  const [workingDays, setWorkingDays] = useState([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('19:30');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState(12);

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get('/executive/profile');
        if (res.data.success && res.data.profile?.availability) {
          const a = res.data.profile.availability;
          setIsAvailable(a.isAvailable ?? true);
          setWorkingDays(a.workingDays || daysList.slice(0, 6));
          setStartTime(a.startTime || '09:00');
          setEndTime(a.endTime || '19:30');
          setSlotDurationMinutes(a.slotDurationMinutes || 30);
          setMaxBookingsPerDay(a.maxBookingsPerDay || 12);
        }
      } catch (err) {
        console.warn('Failed to load availability:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const toggleDay = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/executive/availability', {
        isAvailable,
        workingDays,
        startTime,
        endTime,
        slotDurationMinutes: Number(slotDurationMinutes),
        maxBookingsPerDay: Number(maxBookingsPerDay),
      });

      if (res.data.success) {
        setSuccessMsg('Consultation availability and calendar settings updated.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update availability.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Availability & Working Hours Settings
        </h2>
        <p className="text-xs text-stone-500">
          Define the days and hours when you accept consultation bookings.
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

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-ivory-100 border border-stone-200">
          <div>
            <strong className="block text-sm font-serif font-bold text-maroon-900">
              Active Consultation Status
            </strong>
            <span className="text-xs text-stone-600">
              When enabled, your profile is marked as "Available" across the public directory.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Working Days Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
            Active Working Days
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {daysList.map((day) => {
              const selected = workingDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors ${
                    selected
                      ? 'bg-maroon-50 border-maroon-300 text-maroon-900'
                      : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  <span>{day}</span>
                  {selected ? (
                    <CheckSquare className="w-4 h-4 text-maroon-700" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Time Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Start Time (IST)
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              End Time (IST)
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Max daily appointments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Max Daily Consultations
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={maxBookingsPerDay}
              onChange={(e) => setMaxBookingsPerDay(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Default Slot Duration (Minutes)
            </label>
            <select
              value={slotDurationMinutes}
              onChange={(e) => setSlotDurationMinutes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 bg-white"
            >
              <option value="15">15 Minutes</option>
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Availability'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilitySettings;
