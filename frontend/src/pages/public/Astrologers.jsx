import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Clock, Globe, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const Astrologers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';

  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState(initialTopic);
  const [maxPrice, setMaxPrice] = useState('');

  const fetchAstrologers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (specializationFilter) params.append('specialization', specializationFilter);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const res = await api.get(`/public/astrologers?${params.toString()}`);
      if (res.data.success) {
        setAstrologers(res.data.astrologers);
      }
    } catch (err) {
      console.warn('[Fetch Astrologers Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologers();
  }, [specializationFilter, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAstrologers();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSpecializationFilter('');
    setMaxPrice('');
    setSearchParams({});
  };

  const allSpecializations = [
    'Kundli Analysis',
    'Career & Business Astrology',
    'Marriage Compatibility',
    'Vastu Shastra Consultation',
    'KP Astrology',
    'Gemstone Recommendations',
    'Numerology',
    'Vedic Remedies',
  ];

  return (
    <div className="py-12 sm:py-16 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-serif font-semibold text-gold-700 uppercase tracking-widest">
          <IndianOrnament className="w-4 h-4 text-gold-600" />
          <span>Verified Consultants Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-maroon-900 tracking-tight">
          Explore Our Certified Vedic Astrologers
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Every astrologer on our platform has been rigorously screened for scriptural knowledge, experience, and ethical integrity. Book directly at their transparent per-minute rate.
        </p>
        <VedicDivider />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
          </div>

          {/* Specialization Filter */}
          <div>
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-white"
            >
              <option value="">All Specializations</option>
              {allSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Filter */}
          <div>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 bg-white"
            >
              <option value="">Any Fee / Minute</option>
              <option value="25">Up to ₹25 / min</option>
              <option value="35">Up to ₹35 / min</option>
              <option value="50">Up to ₹50 / min</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium text-xs transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Astrologers Directory List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-serif text-maroon-900 mt-4">Loading verified astrologers...</p>
        </div>
      ) : astrologers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-lg mx-auto">
          <Sparkles className="w-10 h-10 text-gold-500 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-maroon-900 mb-1">No Astrologers Match Your Search</h3>
          <p className="text-xs text-stone-500 mb-6">
            Try adjusting your search criteria or resetting filters to view all available consultants.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2 rounded-lg bg-maroon-700 text-white text-xs font-semibold"
          >
            Show All Astrologers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {astrologers.map((astro) => (
            <div
              key={astro.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md hover:border-gold-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Top Profile Card */}
                <div className="flex items-start gap-4">
                  <img
                    src={astro.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}
                    alt={astro.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-gold-400/70 shadow-sm flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-serif font-semibold uppercase tracking-wider text-gold-700">
                        {astro.title}
                      </span>
                      <span className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                        {astro.rating} ({astro.reviewCount})
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-maroon-900 truncate mt-0.5">
                      {astro.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-stone-700">
                        <Clock className="w-3.5 h-3.5 text-gold-600" />
                        {astro.experience} Yrs Exp
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-stone-400" />
                        {astro.languages?.join(', ')}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="mt-2.5 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-maroon-50 text-maroon-900 border border-maroon-200">
                      ₹{astro.pricePerMinute} / minute
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                  {astro.biography}
                </p>

                {/* Specializations */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1.5">
                    Areas of Expertise:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {astro.specialization?.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px] bg-ivory-200 text-stone-700 font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Working hours notice */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <UserCheck className="w-3.5 h-3.5" />
                    Available: {astro.availability?.startTime} - {astro.availability?.endTime} IST
                  </span>
                  <span>{astro.totalConsultations} Consultations</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-stone-100 grid grid-cols-2 gap-3">
                <Link
                  to={`/astrologers/${astro.id}`}
                  className="py-2.5 text-center rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  View Profile
                </Link>

                <Link
                  to={`/book/${astro.id}`}
                  className="py-2.5 text-center rounded-xl bg-maroon-700 hover:bg-maroon-800 text-xs font-semibold text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Astrologers;
