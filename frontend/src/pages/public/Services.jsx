import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/public/services');
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.warn('[Services Fetch Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-serif font-semibold text-gold-700 uppercase tracking-widest">
          <IndianOrnament className="w-4 h-4 text-gold-600" />
          <span>Vedic Consultation Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-maroon-900 tracking-tight">
          Comprehensive Astrological Consultations
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Each consultation is conducted 1-on-1 via private Zoom video, backed by an in-depth reading of your planetary dasha cycles, transits, and divisional charts.
        </p>
        <VedicDivider />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md hover:border-gold-400 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-6">
              {/* Badge & Duration */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-ivory-200 text-maroon-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 border border-stone-200 text-xs font-medium text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-gold-600" />
                  <span>Recommended: {service.recommendedDuration} mins</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-serif font-bold text-xl text-maroon-900 mb-2">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
                {service.fullDescription}
              </p>

              {/* Benefits Checklist */}
              <div className="space-y-2 border-t border-stone-100 pt-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 block mb-2">
                  What is covered:
                </span>
                {service.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-4 bg-stone-50 border-t border-stone-100">
              <Link
                to={`/astrologers?topic=${encodeURIComponent(service.title)}`}
                className="w-full py-2.5 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Find Astrologer For This Topic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
