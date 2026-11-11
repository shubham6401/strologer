import React, { useState, useEffect } from 'react';
import { Camera, Check, AlertCircle, Save, Sparkles, Plus, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ExecutiveProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    title: 'Acharya',
    phone: '',
    experience: 5,
    biography: '',
    specializations: [],
    qualifications: [],
    languages: [],
  });

  const [newSpec, setNewSpec] = useState('');
  const [newQual, setNewQual] = useState('');
  const [newLang, setNewLang] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/executive/profile');
        if (res.data.success) {
          const p = res.data.profile;
          setProfile(p);
          setFormData({
            name: p.userId?.name || user?.name || '',
            title: p.title || 'Acharya',
            phone: p.userId?.phone || user?.phone || '',
            experience: p.experience || 5,
            biography: p.biography || '',
            specializations: p.specialization || [],
            qualifications: p.qualifications || [],
            languages: p.languages || [],
          });
        }
      } catch (err) {
        setErrorMsg('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('profileImage', file);

    setUploadingPhoto(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.post('/executive/profile/photo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setSuccessMsg('Profile photograph uploaded successfully.');
        await refreshUser();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddTag = (field, value, setter) => {
    if (!value.trim()) return;
    if (!formData[field].includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()],
      });
    }
    setter('');
  };

  const handleRemoveTag = (field, item) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((x) => x !== item),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/executive/profile', {
        name: formData.name,
        title: formData.title,
        phone: formData.phone,
        experience: Number(formData.experience),
        biography: formData.biography,
        specialization: formData.specializations,
        qualifications: formData.qualifications,
        languages: formData.languages,
      });

      if (res.data.success) {
        setSuccessMsg('Executive profile updated and published successfully.');
        await refreshUser();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save changes.');
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-maroon-900">Astrologer Profile</h2>
          <p className="text-xs text-stone-500">
            Keep your credentials, lineage, and public biography updated.
          </p>
        </div>
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

      {/* Profile Photo Upload Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-maroon-800 border-2 border-gold-500 overflow-hidden shadow-sm flex items-center justify-center text-white text-2xl font-bold font-serif">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'A'
            )}
          </div>
          <label className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
            <Camera className="w-6 h-6" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif font-bold text-base text-stone-900">Profile Photograph</h3>
          <p className="text-xs text-stone-500">
            JPG, JPEG, or PNG image under 5MB. Clear, traditional attire photograph recommended.
          </p>
          <div className="pt-2">
            <label className="inline-block px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer">
              {uploadingPhoto ? 'Uploading...' : 'Choose New Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTextChange}
              placeholder="e.g. Jyotish Acharya"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleTextChange}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleTextChange}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Years of Experience</label>
            <input
              type="number"
              name="experience"
              min="0"
              value={formData.experience}
              onChange={handleTextChange}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Consultant Biography (Visible on Public Website)
          </label>
          <textarea
            name="biography"
            rows="5"
            value={formData.biography}
            onChange={handleTextChange}
            placeholder="Share your lineage, Sanskrit educational background, and consultation methodology..."
            className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 resize-none leading-relaxed"
          />
        </div>

        {/* Specializations Tag Management */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700">Specializations</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.specializations.map((spec) => (
              <span
                key={spec}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ivory-200 text-stone-800 border border-stone-200"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag('specializations', spec)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add specialization (e.g. Kundli Milan, Vastu, Prashna)..."
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
            />
            <button
              type="button"
              onClick={() => handleAddTag('specializations', newSpec, setNewSpec)}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Qualifications Tag Management */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700">Qualifications & Degrees</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.qualifications.map((q) => (
              <span
                key={q}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-950 border border-gold-300"
              >
                <span>{q}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag('qualifications', q)}
                  className="text-gold-700 hover:text-gold-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add degree / credential (e.g. Jyotish Acharya BHU)..."
              value={newQual}
              onChange={(e) => setNewQual(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
            />
            <button
              type="button"
              onClick={() => handleAddTag('qualifications', newQual, setNewQual)}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Languages Tag Management */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700">Spoken Languages</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.languages.map((l) => (
              <span
                key={l}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-800"
              >
                <span>{l}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag('languages', l)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add language (e.g. Hindi, Sanskrit, English)..."
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-gold-500"
            />
            <button
              type="button"
              onClick={() => handleAddTag('languages', newLang, setNewLang)}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExecutiveProfile;
