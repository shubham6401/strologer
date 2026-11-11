import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Globe,
  Award,
  ShieldCheck,
  CheckCircle,
  Video,
  ArrowRight,
  Calendar,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import api from '../../services/api';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const AstrologerDetail = () => {
  const { id } = useParams();
  const [astrologer, setAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(30);

  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const res = await api.get(`/public/astrologers/${id}`);
        if (res.data.success) {
          setAstrologer(res.data.astrologer);
        }
      } catch (err) {
        console.warn('[Fetch Astrologer Detail Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAstrologer();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-serif text-maroon-900 mt-4">Loading astrologer profile...</p>
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-serif font-bold text-maroon-900">Astrologer Not Found</h2>
        <p className="text-xs text-stone-500 mt-2 mb-6">
          The requested astrologer profile could not be located.
        </p>
        <Link
          to="/astrologers"
          className="px-5 py-2.5 rounded-lg bg-maroon-700 text-white font-semibold text-xs"
        >
          Return to Astrologers Directory
        </Link>
      </div>
    );
  }

  const durationOptions = [10, 15, 20, 30, 45, 60];
  const calculatedFee = selectedDuration * (astrologer.pricePerMinute || 20);

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/astrologers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-maroon-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to all Astrologers</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Full Profile Details */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-stone-100">
            <img
              src={astrologer.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600'}
              alt={astrologer.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-gold-400 shadow-md flex-shrink-0"
            />
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-serif font-bold uppercase tracking-wider text-gold-700">
                  {astrologer.title}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                  {astrologer.rating} • {astrologer.reviewCount} Verified Reviews
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-maroon-900">
                {astrologer.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                <span className="flex items-center gap-1 font-medium text-stone-800">
                  <Clock className="w-4 h-4 text-gold-600" />
                  {astrologer.experience} Years Active Practice
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-stone-400" />
                  {astrologer.languages?.join(', ')}
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">
                  {astrologer.totalConsultations}+ Completed Sessions
                </span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-maroon-900">
              Biography & Astrological Background
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {astrologer.biography}
            </p>
          </div>

          {/* Specializations */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-maroon-900">
              Areas of Specialization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {astrologer.specialization?.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-ivory-100 border border-stone-200/80 text-xs font-medium text-stone-800"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications & Credentials */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-maroon-900">
              Credentials & Academic Lineage
            </h3>
            <div className="space-y-2">
              {astrologer.qualifications?.map((q, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                  <Award className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Working hours & Consultation format */}
          <div className="p-4 rounded-xl bg-ivory-100 border border-gold-300/60 flex items-start gap-3 text-xs text-stone-700">
            <ShieldCheck className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-maroon-950 font-semibold block text-sm">Consultation Standards</strong>
              Consultations are conducted in 1-on-1 private Zoom rooms. You will be provided your personal session link with an active timer once payment is manually verified by {astrologer.name}.
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Booking Calculator Card */}
        <div className="lg:col-span-4 sticky top-28 bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs text-stone-500 uppercase tracking-wider block">Consultation Rate</span>
              <div className="text-2xl font-serif font-bold text-maroon-900">
                ₹{astrologer.pricePerMinute} <span className="text-xs font-normal text-stone-500">/ min</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Available
            </span>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Select Consultation Duration:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedDuration(dur)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                    selectedDuration === dur
                      ? 'bg-maroon-700 text-white border-maroon-700 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {dur} mins
                </button>
              ))}
            </div>
          </div>

          {/* Live Price Calculator Breakdown */}
          <div className="p-4 rounded-xl bg-ivory-100 border border-gold-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Rate per minute:</span>
              <span>₹{astrologer.pricePerMinute}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Selected duration:</span>
              <span>{selectedDuration} minutes</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-serif font-bold text-sm text-maroon-900">
              <span>Total Payable Amount:</span>
              <span>₹{calculatedFee}</span>
            </div>
          </div>

          {/* CTA Book Consultation */}
          <Link
            to={`/book/${astrologer.id}?duration=${selectedDuration}`}
            className="w-full py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Book Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-[11px] text-stone-500 text-center leading-normal">
            Payment is completed via the astrologer’s personal UPI QR code and verified manually before meeting scheduling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AstrologerDetail;
