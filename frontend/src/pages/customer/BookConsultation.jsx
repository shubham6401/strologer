import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { IndianOrnament } from '../../components/IndianOrnament';

const BookConsultation = () => {
  const { astrologerId } = useParams();
  const [searchParams] = useSearchParams();
  const durationParam = Number(searchParams.get('duration')) || 30;

  const { user } = useAuth();
  const navigate = useNavigate();

  const [astrologer, setAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    consultationTopic: 'Kundli & Janam Patrika Analysis',
    problemDescription: '',
    selectedDuration: durationParam,
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredTime: '11:00 AM',
    // Birth details
    dateOfBirth: user?.birthDetails?.dateOfBirth || '',
    timeOfBirth: user?.birthDetails?.timeOfBirth || '',
    placeOfBirth: user?.birthDetails?.placeOfBirth || '',
    gender: user?.birthDetails?.gender || 'male',
  });

  const durationOptions = [10, 15, 20, 30, 45, 60];

  const standardTopics = [
    'Kundli & Janam Patrika Analysis',
    'Career, Job & Business Guidance',
    'Marriage & Relationship Consultation',
    'Kundli Milan (Matchmaking)',
    'Yearly Horoscope & Gochar Analysis',
    'Vastu Shastra Consultation',
    'Vedic Numerology & Name Correction',
    'Gemstone & Vedic Remedies Guidance',
    'Comprehensive Personal Consultation',
  ];

  const standardTimes = [
    '09:30 AM',
    '10:30 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
    '07:30 PM',
  ];

  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const res = await api.get(`/public/astrologers/${astrologerId}`);
        if (res.data.success) {
          setAstrologer(res.data.astrologer);
        }
      } catch (err) {
        setErrorMsg('Could not find selected astrologer.');
      } finally {
        setLoading(false);
      }
    };
    fetchAstrologer();
  }, [astrologerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDurationSelect = (dur) => {
    setFormData({ ...formData, selectedDuration: dur });
  };

  const calculatedTotal =
    (formData.selectedDuration || 30) * (astrologer?.pricePerMinute || 20);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        executiveId: astrologerId,
        consultationTopic: formData.consultationTopic,
        problemDescription: formData.problemDescription,
        selectedDuration: Number(formData.selectedDuration),
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        clientBirthDetails: {
          fullName: formData.fullName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          placeOfBirth: formData.placeOfBirth,
        },
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success && res.data.booking) {
        // Redirect directly to payment instructions page for this booking
        navigate(`/payment/${res.data.booking._id}`);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Failed to initialize booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 mt-2">Loading astrologer details...</p>
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h3 className="font-serif font-bold text-lg text-maroon-900">Astrologer Not Found</h3>
        <Link
          to="/astrologers"
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-maroon-700 text-white text-xs font-semibold"
        >
          Return to Astrologers Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/astrologers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-maroon-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Astrologers</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Booking Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-maroon-900">
              Book Consultation Session
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Fill in your consultation preferences and birth chart data.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Duration Selection & Rate */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Select Consultation Duration *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {durationOptions.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => handleDurationSelect(dur)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      formData.selectedDuration === dur
                        ? 'bg-maroon-700 text-white border-maroon-700 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {dur} mins
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Topic & Preferred Date/Time */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h3 className="font-serif font-bold text-sm text-maroon-900">
                Consultation Topic & Preferred Timing
              </h3>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Consultation Topic *
                </label>
                <select
                  name="consultationTopic"
                  value={formData.consultationTopic}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 bg-white"
                >
                  {standardTopics.map((top) => (
                    <option key={top} value={top}>
                      {top}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    name="preferredDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 bg-white"
                  >
                    {standardTimes.map((t) => (
                      <option key={t} value={t}>
                        {t} IST
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Specific Problem Description or Questions (Optional)
                </label>
                <textarea
                  name="problemDescription"
                  rows="3"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  placeholder="Outline any specific life questions, concerns, or areas you wish the Acharya to focus on..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* 3. Client & Birth Chart Details */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h3 className="font-serif font-bold text-sm text-maroon-900">
                Birth Details for Kundli Analysis
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
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
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Time of Birth
                  </label>
                  <input
                    type="time"
                    name="timeOfBirth"
                    value={formData.timeOfBirth}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Place of Birth (City, State)
                  </label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    placeholder="e.g. Varanasi, UP"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Initializing Booking...</span>
              ) : (
                <>
                  <span>Confirm Booking & Proceed to Payment (₹{calculatedTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Sticky Astrologer & Price Breakdown Card */}
        <div className="lg:col-span-4 sticky top-28 bg-white rounded-2xl p-6 border border-stone-200 shadow-md space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
            <img
              src={astrologer.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'}
              alt={astrologer.name}
              className="w-16 h-16 rounded-xl object-cover border border-gold-400"
            />
            <div>
              <span className="text-[11px] uppercase font-serif font-semibold text-gold-700">
                {astrologer.title}
              </span>
              <h3 className="font-serif font-bold text-base text-maroon-900 leading-tight">
                {astrologer.name}
              </h3>
              <p className="text-xs text-stone-500">{astrologer.experience} Years Experience</p>
            </div>
          </div>

          {/* Pricing Ledger */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Fee Calculation Summary
            </h4>
            <div className="p-4 bg-ivory-100 rounded-xl border border-gold-200/70 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Per-minute rate:</span>
                <span className="font-semibold text-stone-900">₹{astrologer.pricePerMinute} / min</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Selected duration:</span>
                <span className="font-semibold text-stone-900">{formData.selectedDuration} minutes</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-serif font-bold text-maroon-900">
                <span>Total Amount:</span>
                <span className="text-base">₹{calculatedTotal}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 text-maroon-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Next Step: Direct UPI Payment</span>
            </div>
            <p>
              On the next screen, you will scan {astrologer.name}’s dedicated UPI QR code, pay the exact fee of ₹{calculatedTotal}, and upload your transaction receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
