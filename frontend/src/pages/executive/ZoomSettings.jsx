import React, { useState, useEffect } from 'react';
import { Video, Check, AlertCircle, Save, ShieldCheck, Link2 } from 'lucide-react';
import api from '../../services/api';

const ZoomSettings = () => {
  const [personalMeetingUrl, setPersonalMeetingUrl] = useState('');
  const [meetingPasscode, setMeetingPasscode] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchZoom = async () => {
      try {
        const res = await api.get('/executive/profile');
        if (res.data.success && res.data.profile?.zoomSettings) {
          const z = res.data.profile.zoomSettings;
          setPersonalMeetingUrl(z.personalMeetingUrl || '');
          setMeetingPasscode(z.meetingPasscode || '');
          setCustomInstructions(z.customInstructions || '');
        }
      } catch (err) {
        console.warn('Failed to load zoom settings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchZoom();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/executive/zoom-settings', {
        personalMeetingUrl,
        meetingPasscode,
        customInstructions,
      });

      if (res.data.success) {
        setSuccessMsg('Zoom consultation settings updated successfully.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update Zoom settings.');
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
          Zoom Video Settings & Fallbacks
        </h2>
        <p className="text-xs text-stone-500">
          Configure your personal Zoom room URL and passcodes used when automated Server-to-Server Zoom meetings are generated or manually set.
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

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Personal / Default Zoom Meeting URL *
          </label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              required
              value={personalMeetingUrl}
              onChange={(e) => setPersonalMeetingUrl(e.target.value)}
              placeholder="https://us04web.zoom.us/j/123456789?pwd=..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-gold-500"
            />
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            This URL acts as your reliable video room when scheduling verified consultations.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Default Meeting Passcode
          </label>
          <input
            type="text"
            value={meetingPasscode}
            onChange={(e) => setMeetingPasscode(e.target.value)}
            placeholder="e.g. VEDIC108"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Custom Room Guidance for Seekers
          </label>
          <textarea
            rows="3"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. Please join from a quiet room with good lighting and have your birth chart questions ready..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500 resize-none leading-relaxed"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-100 border border-gold-300/60 text-xs text-stone-700 space-y-1">
          <div className="flex items-center gap-2 font-serif font-bold text-maroon-900">
            <ShieldCheck className="w-4 h-4 text-gold-600" />
            <span>Server-Side Credential Isolation</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            All Zoom Server-to-Server OAuth credentials reside strictly on the backend server environment. Frontend clients can never inspect or scrape video tokens or private API keys.
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Zoom Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZoomSettings;
