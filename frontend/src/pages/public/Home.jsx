import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle,
  Video,
  QrCode,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import api from '../../services/api';
import { IndianOrnament, VedicDivider } from '../../components/IndianOrnament';

const Home = () => {
  const [astrologers, setAstrologers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [astroRes, servRes] = await Promise.all([
          api.get('/public/astrologers'),
          api.get('/public/services'),
        ]);
        if (astroRes.data.success) setAstrologers(astroRes.data.astrologers);
        if (servRes.data.success) setServices(servRes.data.services);
      } catch (err) {
        console.warn('[Home Data Fetch Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How does the per-minute consultation fee work?',
      a: 'Every astrologer sets their own transparent per-minute rate (for instance ₹25/min or ₹35/min). When you book, you choose your required duration (10, 15, 20, 30, 45, or 60 minutes), and the system calculates the exact total amount upfront. There are no hidden charges or surprise deductions.',
    },
    {
      q: 'How do I pay using the UPI QR Code?',
      a: 'Upon booking, you are shown the personal UPI QR Code and UPI ID belonging specifically to your chosen astrologer. Simply open Google Pay, PhonePe, Paytm, or BHIM, scan the QR, and transfer the exact fee. Then upload a screenshot showing the transaction ID/UTR. The astrologer manually verifies the payment against their bank statement before scheduling your session.',
    },
    {
      q: 'How is the Zoom consultation conducted?',
      a: 'Once your payment is verified, your astrologer schedules the Zoom meeting for your chosen date and time. Your dashboard provides a dedicated countdown timer and Zoom join button that activates 10 minutes prior to the session start.',
    },
    {
      q: 'What if I do not have my exact birth time?',
      a: 'While an exact birth time gives the most precise Janam Kundli analysis, our certified Acharyas are trained in Prashna Kundli (Horary astrology) and Palmistry remedies to assist seekers who lack exact birth time records.',
    },
    {
      q: 'Can I reschedule or cancel my booking?',
      a: 'Yes. You can cancel pending bookings anytime from your Client Dashboard. If an unforeseen conflict arises after scheduling, you can coordinate a reschedule with your astrologer through the platform.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-200/80">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory-200/50 via-ivory-100 to-white -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-100 border border-gold-300 text-maroon-900 text-xs font-serif font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Certified Vedic Astrologers • Authentic Jyotish Consultations</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-maroon-900 tracking-tight leading-[1.15]">
                Clarity for Your Life Journey Through Sacred Vedic Wisdom
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Connect directly with venerable Vedic Astrologers for confidential, one-on-one video consultations. Experience transparent per-minute pricing, authentic UPI payments, and pragmatic remedial guidance rooted in classical Shastras.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/astrologers"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/services"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-stone-300 hover:border-gold-500 text-stone-800 font-semibold text-base hover:bg-ivory-50 transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Services</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-stone-200/70 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <span className="block text-2xl font-serif font-bold text-maroon-900">15,000+</span>
                  <span className="text-xs text-stone-500">Seekers Guided</span>
                </div>
                <div>
                  <span className="block text-2xl font-serif font-bold text-maroon-900">4.9 / 5</span>
                  <span className="text-xs text-stone-500">Average Rating</span>
                </div>
                <div>
                  <span className="block text-2xl font-serif font-bold text-maroon-900">100%</span>
                  <span className="text-xs text-stone-500">Manual UPI Verified</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gold-300/60">
                {/* Traditional Header Accent */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <IndianOrnament className="w-5 h-5 text-gold-600" />
                    <span className="text-xs font-serif font-bold uppercase tracking-wider text-maroon-900">
                      Live Consultation Desk
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                    Acharyas Available
                  </span>
                </div>

                {/* Sample Astrologer Card in Hero */}
                <div className="mt-4 p-4 rounded-xl bg-ivory-100 border border-gold-200/60 flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
                    alt="Pt. Radheshyam Mishra"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold-500 shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif font-bold text-stone-900 truncate">Pt. Radheshyam Mishra</h4>
                    <p className="text-xs text-stone-600">Jyotish Acharya • 22 Yrs Exp</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-bold text-maroon-800">₹25 / min</span>
                      <span className="text-stone-300">•</span>
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" /> 4.9
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consultation Duration Calculator Preview */}
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-600 font-medium">Select Consultation Duration:</span>
                    <span className="font-serif font-bold text-maroon-900">30 Minutes = ₹750</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
                    <span className="py-1.5 text-center rounded border border-stone-200 bg-white text-stone-700">15m</span>
                    <span className="py-1.5 text-center rounded border border-gold-500 bg-maroon-700 text-white">30m</span>
                    <span className="py-1.5 text-center rounded border border-stone-200 bg-white text-stone-700">45m</span>
                    <span className="py-1.5 text-center rounded border border-stone-200 bg-white text-stone-700">60m</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-gold-600" />
                    <span>Direct Astrologer UPI QR</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-maroon-700" />
                    <span>1-on-1 Zoom Session</span>
                  </div>
                </div>

                <Link
                  to="/astrologers"
                  className="mt-4 block w-full py-2.5 text-center rounded-lg bg-gold-500 hover:bg-gold-600 text-maroon-950 font-semibold text-xs transition-colors"
                >
                  Consult Pt. Radheshyam Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE VEDIC SCIENCE & PLATFORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400/40 shadow-xl bg-ivory-200 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1000&auto=format&fit=crop&q=80"
                alt="Ancient Vedic Wisdom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs uppercase tracking-widest text-gold-300 font-serif">Vedanga Jyotisha</span>
                  <h3 className="text-xl font-serif font-bold">The Cosmic Light Illuminating Human Destiny</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-serif font-semibold text-gold-700 uppercase tracking-widest">
              <IndianOrnament className="w-4 h-4 text-gold-600" />
              <span>Timeless Vedic Philosophy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-maroon-900 tracking-tight">
              An Ethical Haven Free From Fear and Superstition
            </h2>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              In classical Vedic tradition, Jyotish (derived from <em>Jyoti</em>, meaning divine light) is revered as the eye of the Vedas. It does not prescribe fatalistic dread; rather, it reveals the planetary blueprint of your Prarabdha Karma so that you can navigate worldly choices with consciousness and poise.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Scholarly Lineage & Vetting</h4>
                  <p className="text-xs text-stone-600">Our executives hold verified degrees from premier Sanskrit institutions with decades of real chart analysis.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Pragmatic, Non-Destructive Remedies</h4>
                  <p className="text-xs text-stone-600">Guidance emphasizes scientific lifestyle alignment, mantra therapy, and targeted gemstones rather than exploitative rituals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Direct Astrologer Relationship</h4>
                  <p className="text-xs text-stone-600">Each astrologer personally manages their consultation queue, UPI QR verification, and Zoom sessions without third-party interference.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-maroon-800 hover:text-maroon-950 group"
              >
                <span>Read our complete philosophy & lineage</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONFIGURABLE ASTROLOGY SERVICES */}
      <section className="bg-ivory-200/50 py-16 sm:py-20 border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-700">
              Vedic Consultation Categories
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-maroon-900">
              Consultation Services Tailored to Your Questions
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Select any specialized area of Vedic inquiry. Every service is backed by comprehensive Janam Kundli decoding and actionable remedial measures.
            </p>
            <VedicDivider />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-gold-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-ivory-200 text-maroon-800 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5 text-gold-600" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ivory-100 border border-stone-200 text-stone-700">
                      Rec. {service.recommendedDuration} mins
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-maroon-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {service.benefits.slice(0, 3).map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/astrologers?topic=${encodeURIComponent(service.title)}`}
                  className="w-full py-2.5 text-center rounded-lg bg-stone-50 hover:bg-maroon-700 hover:text-white border border-stone-200 text-xs font-semibold text-stone-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Book This Service</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED ASTROLOGERS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-700 block">
              Verified Astrologer Executives
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-maroon-900 mt-1">
              Consult Our Senior Astrologers
            </h2>
          </div>
          <Link
            to="/astrologers"
            className="text-sm font-semibold text-maroon-800 hover:text-maroon-950 flex items-center gap-1.5"
          >
            <span>View all certified astrologers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {astrologers.map((astro) => (
            <div
              key={astro.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:border-gold-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={astro.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300'}
                    alt={astro.name}
                    className="w-20 h-20 rounded-xl object-cover border border-gold-300 shadow-xs flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-serif font-semibold text-gold-700">
                        {astro.title}
                      </span>
                      <span className="flex items-center text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                        {astro.rating} ({astro.reviewCount})
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-maroon-900 truncate">
                      {astro.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {astro.experience} Years Experience • {astro.languages?.join(', ')}
                    </p>

                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-100 text-maroon-900 border border-gold-300">
                      ₹{astro.pricePerMinute} / minute
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                  {astro.biography}
                </p>

                {/* Specializations badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {astro.specialization?.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] bg-ivory-200 text-stone-700 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 grid grid-cols-2 gap-3">
                <Link
                  to={`/astrologers/${astro.id}`}
                  className="py-2.5 text-center rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  View Profile
                </Link>

                <Link
                  to={`/book/${astro.id}`}
                  className="py-2.5 text-center rounded-lg bg-maroon-700 hover:bg-maroon-800 text-xs font-semibold text-white shadow-xs transition-colors"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-ivory-200/60 py-16 sm:py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-700">
              Transparent 6-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-maroon-900">
              How Your Consultation Works
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              From choosing your consultation duration to attending your confidential Zoom session.
            </p>
            <VedicDivider />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Select Astrologer',
                desc: 'Review verified qualifications, years of experience, and per-minute consultation rates.',
                icon: Compass,
              },
              {
                step: '02',
                title: 'Choose Duration & Time',
                desc: 'Pick your consultation duration (10, 15, 20, 30, 45, or 60 mins). Live price calculated immediately.',
                icon: Clock,
              },
              {
                step: '03',
                title: 'Scan Astrologer UPI QR',
                desc: 'Pay directly using GPay, PhonePe, Paytm or BHIM to the astrologer’s dedicated QR code.',
                icon: QrCode,
              },
              {
                step: '04',
                title: 'Upload Payment Proof',
                desc: 'Upload a clear screenshot showing the 12-digit UPI reference / UTR number for manual validation.',
                icon: ShieldCheck,
              },
              {
                step: '05',
                title: 'Manual Verification',
                desc: 'Astrologer inspects their bank app, verifies the transaction manually, and schedules the meeting.',
                icon: CheckCircle,
              },
              {
                step: '06',
                title: 'Join Zoom Consultation',
                desc: 'Access your Zoom link with our live session timer and receive deeply personalized Vedic guidance.',
                icon: Video,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs relative overflow-hidden"
                >
                  <span className="absolute top-4 right-4 font-serif font-bold text-3xl text-gold-300/40">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-ivory-200 text-maroon-800 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-maroon-900 mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. VERIFIED TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-700">
            Client Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-maroon-900">
            Real Seekers, Authentic Results
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Vivek Sengupta',
              city: 'New Delhi',
              topic: 'Career Transition & Rahu Dasha',
              text: 'Acharya Radheshyam’s precision is remarkable. He accurately pointed out the exact quarter of my job shift and recommended a simple Gayatri ritual that removed all mental anxiety.',
              rating: 5,
            },
            {
              name: 'Meenakshi Iyer',
              city: 'Bengaluru',
              topic: 'Kundli Milan (Marriage)',
              text: 'Unlike other astrologers who terrify families over Manglik dosha, Dr. Ananya explained the actual astrological neutralizing factors with patience and scientific reasoning.',
              rating: 5,
            },
            {
              name: 'Rajesh Agrawal',
              city: 'Ahmedabad',
              topic: 'Vastu Shastra & Business Growth',
              text: 'The non-destructive Vastu recommendations for our manufacturing unit brought noticeable peace and order within three months. Completely professional and transparent payment system.',
              rating: 5,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <span className="font-serif font-semibold text-maroon-900 block text-sm">
                  {item.name}
                </span>
                <span className="text-xs text-stone-500">
                  {item.city} • <span className="text-gold-700">{item.topic}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-700">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-maroon-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-serif font-semibold text-maroon-900 hover:bg-stone-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    openFaq === idx ? 'transform rotate-180 text-maroon-700' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-ivory-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-maroon-900 text-white rounded-3xl p-8 sm:p-12 border-2 border-gold-500/40 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl -z-10" />

          <IndianOrnament className="w-8 h-8 text-gold-400 mx-auto mb-4" />

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight mb-3">
            Ready to Discover What the Cosmos Holds for You?
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Choose your preferred Vedic astrologer, select a duration that fits your needs, and enjoy authentic, confidential guidance via Zoom.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/astrologers"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-maroon-950 font-bold text-sm shadow-md transition-all"
            >
              Book Your Consultation Now
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-maroon-800/80 hover:bg-maroon-800 border border-gold-400/40 text-white font-semibold text-sm transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
